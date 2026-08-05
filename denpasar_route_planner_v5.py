#!/usr/bin/env python3
"""
Denpasar School Visit Route Planner v5 (RUTE JALAN, round-trip, greedy regional explorer,
minimum jarak tempuh per tim)
===========================================================================================
Membagi daftar sekolah menjadi N tim, lalu mencari urutan kunjungan
paling efisien di dalam tiap tim — SEMUA jarak yang dipakai untuk
pembagian & pengurutan adalah JARAK RUTE JALAN SUNGGUHAN (OSRM).

PERUBAHAN v5 (JAMINAN JARAK MINIMUM PER TIM):
    6. Ditambahkan tahap pasca-optimasi "enforce_minimum_team_distance":
       kalau ada tim yang jarak pulang-perginya masih di bawah ambang
       minimum (default 10 KM — misal cuma dapat 1-2 sekolah yang
       berdekatan sehingga cuma ~3-5 KM), tim itu akan "diberi tugas
       tambahan": sekolah PALING DEKAT dari tim lain (yang tim lain itu
       masih punya sisa >1 sekolah) dipindahkan ke tim yang kekurangan
       jarak tersebut, satu per satu, sampai jarak tempuhnya mencapai
       minimal ambang batas. Ini memastikan tidak ada tim yang "healthy
       leisure trip" sangat pendek sementara tim lain kebagian banyak.
       Konsekuensinya, jumlah sekolah per tim TIDAK LAGI dijamin selisih
       maksimal 1 (itu hanya berlaku di tahap pembagian awal) — demi
       keadilan BEBAN KERJA (jarak tempuh), bukan lagi keadilan jumlah
       titik semata.

(Poin 1-5 dari v4 tetap dipertahankan seluruhnya — lihat di bawah.)

    1. SETIAP TIM SEKARANG PULANG-PERGI (round-trip): berangkat dari
       SMA Negeri 3 Denpasar, mengunjungi semua sekolah yang ditugaskan,
       lalu KEMBALI LAGI ke SMA Negeri 3 Denpasar. Dihitung dengan
       Held-Karp DP versi closed-tour -> tetap solusi OPTIMAL (bukan
       aproksimasi) untuk ukuran tim wajar (<=12-13 sekolah/tim).

    2. Pembagian tim TIDAK LAGI pakai k-means/centroid, tapi memakai
       strategi GREEDY REGIONAL GROWING (mirip algoritma Prim multi-
       sumber): pilih beberapa sekolah "jangkar" yang tersebar di
       seluruh kota (farthest-point sampling di atas jarak JALAN
       sungguhan), lalu tumbuhkan tiap klaster selangkah demi
       selangkah — di setiap langkah, sekolah BELUM-DITUGASKAN yang
       PALING DEKAT ke klaster mana pun langsung diberikan ke klaster
       itu.

    3. KEADILAN AWAL diukur dari JUMLAH SEKOLAH per tim (dibuat seadil
       mungkin, selisih maksimal 1 sekolah antar tim), sebelum tahap
       jaminan jarak minimum (poin 6) dijalankan.

    4. Objektif optimasi utama = MURNI meminimalkan TOTAL jarak seluruh
       tim, dipoles dengan local search "tukar sekolah antar tim".

    5. Semua paralelisme dari v3 dipertahankan.

Cara pakai:
    python denpasar_route_planner_v5.py --teams 14 --min-distance 10 --output routes.html
"""

import argparse
import concurrent.futures
import heapq
import math
import os
import random
import time

import folium
import requests

# ---------------------------------------------------------------------------
# 1. DATA SEKOLAH — (nama, latitude, longitude)
# ---------------------------------------------------------------------------
SCHOOLS = [
    ("SD Saraswati 2 Denpasar", -8.6531041, 115.2259646),
    ("SD Saraswati 3 Denpasar", -8.6710790, 115.2394054),
    ("SD Saraswati 5 Denpasar", -8.6433401, 115.2491952),
    ("SD Saraswati 6 Denpasar", -8.6401192, 115.2300375),
    ("SD Cipta Dharma", -8.6576569, 115.2293887),
    ("SD Raj Yamuna", -8.6512100, 115.2580230),
    ("SD PGRI Kota Denpasar", -8.6471780, 115.2342800),
    ("SD Negeri 16 Kesiman", -8.6378820, 115.2609080),
    ("SD Negeri 19 Dauh Puri", -8.6748382, 115.2076571),
    ("SD Negeri 28 Dangin Puri", -8.6529990, 115.2240916),
    ("SD Negeri 1 Sanur", -8.6810680, 115.2485410),
    ("SD Negeri 2 Sanur", -8.6744540, 115.2552880),
    ("SD Negeri 1 Sumerta", -8.6503950, 115.2341770),
    ("SD Bali Public School", -8.6653870, 115.2342106),
    ("SD Insan Prestasi", -8.6375170, 115.2299445),
    ("SMP Negeri 1 Denpasar", -8.6565457, 115.2195260),
    ("SMP Negeri 2 Denpasar", -8.6517490, 115.1992437),
    ("SMP Negeri 3 Denpasar", -8.6521491, 115.2255139),
    ("SMP Negeri 4 Denpasar", -8.6525041, 115.2038285),
    ("SMP Negeri 5 Denpasar", -8.6328669, 115.2003900),
    ("SMP Negeri 6 Denpasar", -8.7024923, 115.2172824),
    ("SMP Negeri 7 Denpasar", -8.6651935, 115.1992527),
    ("SMP Negeri 8 Denpasar", -8.6445762, 115.2347672),
    ("SMP Negeri 9 Denpasar", -8.6896022, 115.2592440),
    ("SMP Negeri 10 Denpasar", -8.6380309, 115.2137092),
    ("SMP Negeri 11 Denpasar", -8.7244144, 115.2308311),
    ("SMP Negeri 12 Denpasar", -8.5980704, 115.2218950),
    ("SMP Negeri 13 Denpasar", -8.6800827, 115.1759418),
    ("SMP Negeri 14 Denpasar", -8.6449701, 115.2480915),
    ("SMP Negeri 15 Denpasar", -8.6205055, 115.1853325),
    ("SMP Negeri 16 Denpasar", -8.7026787, 115.2357066),
    ("SMP Negeri 17 Denpasar", -8.6118894, 115.2427851),
    ("SMP Cipta Dharma", -8.6444595, 115.2751583),
    ("SMP Santo Yoseph Denpasar", -8.6713616, 115.2177887),
    ("SMP Tunas Daud", -8.6252323, 115.1851557),
    ("SMP PGRI 2 Denpasar", -8.6457880, 115.2334701),
    ("SMP PGRI 3 Denpasar", -8.6547095, 115.2030197),
    ("SMP PGRI 7 Denpasar", -8.6754334, 115.2245510),
    ("SMP PGRI 8 Denpasar", -8.6324999, 115.2004239),
    ("SMP Widya Sakti", -8.6225100, 115.2409820),
    ("SMP Ganesha Denpasar", -8.7008675, 115.2120384),
    ("SMP (SLUB) Saraswati 1 Denpasar", -8.6525164, 115.2251022),
    ("SMP Harapan Nusantara", -8.6210374, 115.1891938),
    ("SMP Kristen 1 Harapan Denpasar", -8.6838298, 115.2151861),
    ("SMA Negeri 1 Denpasar", -8.6538510, 115.2249570),
    ("SMA Negeri 2 Denpasar", -8.6767620, 115.2176170),
    ("SMA Negeri 4 Denpasar", -8.6642577, 115.1994414),
    ("SMA Negeri 5 Denpasar", -8.7053381, 115.2277067),
    ("SMA Negeri 6 Denpasar", -8.6791487, 115.2499217),
    ("SMA Negeri 7 Denpasar", -8.6516509, 115.2246657),
    ("SMA Negeri 8 Denpasar", -8.5984675, 115.2232459),
    ("SMA Negeri 9 Denpasar", -8.6454098, 115.2478276),
    ("SMA Negeri 10 Denpasar", -8.7145404, 115.2095478),
    ("SMA Negeri 11 Denpasar", -8.6803734, 115.1766677),
    ("SMA Negeri 12 Denpasar", -8.7046040, 115.1845940),
    ("SMA (SLUA) Saraswati 1 Denpasar", -8.6525164, 115.2251022),
    ("SMA Tunas Daud", -8.6252323, 115.1851557),
    ("SMAS Dwijendra", -8.6545246, 115.2255482),
    ("SMAS Kristen Harapan Denpasar", -8.6835547, 115.2151278),
    ("SMAS Katolik Santo Yoseph Denpasar", -8.6710826, 115.2170137),
    ("SMK Negeri 1 Denpasar", -8.6379300, 115.2073280),
    ("SMK Negeri 2 Denpasar", -8.7032570, 115.2292790),
    ("SMK Negeri 3 Denpasar", -8.7006920, 115.2538780),
    ("SMK Negeri 4 Denpasar", -8.6584140, 115.2332531),
    ("SMK TI Bali Global Denpasar", -8.6834159, 115.2340094),
]

# Titik start & finish bersama untuk SEMUA tim (round-trip)
START_SCHOOL = ("SMA Negeri 3 Denpasar", -8.650722902153001, 115.23216470868577)

ALL_SCHOOLS = [START_SCHOOL] + SCHOOLS

QUALITATIVE_PALETTE = [
    "#e6194b", "#3cb44b", "#4363d8", "#f58231", "#911eb4",
    "#42d4f4", "#f032e6", "#808000", "#469990", "#9A6324",
    "#800000", "#000075", "#e6beff", "#a9a9a9", "#bfef45",
    "#fabed4", "#aaffc3", "#ffd8b1", "#dcbeff", "#000000",
]

OSRM_BASE = "https://router.project-osrm.org"

# Ambang jumlah titik non-start per tim yang masih dihitung EXACT lewat
# Held-Karp DP (closed tour). Di atas ini dipakai heuristik NN + 2-opt.
EXACT_TSP_MAX_M = 12

# Jarak pulang-pergi minimum per tim (KM). Kalau ada tim yang jaraknya
# di bawah ini (mis. cuma dapat sekolah-sekolah yang berdekatan sehingga
# cuma ~3-5 km), tim itu akan diberi tugas tambahan (mengunjungi sekolah
# lain) sampai jaraknya mencapai ambang ini.
DEFAULT_MIN_TEAM_DISTANCE_KM = 10.0


# ---------------------------------------------------------------------------
# 2. JARAK RUTE JALAN SUNGGUHAN (OSRM), dengan fallback garis lurus
# ---------------------------------------------------------------------------
def haversine_km(a, b):
    lat1, lon1 = a
    lat2, lon2 = b
    r = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    x = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * r * math.asin(math.sqrt(x))


def fetch_osrm_matrix(coords, profile="driving", chunk_size=60, timeout=30, max_workers=4):
    n = len(coords)
    matrix = [[0.0] * n for _ in range(n)]
    chunks = [list(range(start, min(start + chunk_size, n))) for start in range(0, n, chunk_size)]
    all_coord_str = ";".join(f"{coords[i][1]},{coords[i][0]}" for i in range(n))

    def fetch_chunk(chunk_idx):
        sources_param = ";".join(str(i) for i in chunk_idx)
        url = (
            f"{OSRM_BASE}/table/v1/{profile}/{all_coord_str}"
            f"?sources={sources_param}&annotations=distance"
        )
        resp = requests.get(url, timeout=timeout)
        resp.raise_for_status()
        data = resp.json()
        if data.get("code") != "Ok":
            raise RuntimeError(f"OSRM merespons dengan error: {data.get('code')} — {data.get('message', '')}")
        return chunk_idx, data["distances"]

    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(max_workers, len(chunks))) as ex:
            futures = [ex.submit(fetch_chunk, c) for c in chunks]
            for fut in concurrent.futures.as_completed(futures):
                chunk_idx, distances = fut.result()
                for row_i, global_i in enumerate(chunk_idx):
                    row = distances[row_i]
                    for j in range(n):
                        d = row[j]
                        matrix[global_i][j] = (
                            (d / 1000.0) if d is not None else haversine_km(coords[global_i], coords[j]) * 1.3
                        )
        return matrix
    except Exception as e:
        print(f"[!] Gagal mengambil jarak rute jalan dari OSRM: {e}")
        return None


def fetch_osrm_route_geometry(a, b, profile="driving", timeout=15):
    try:
        coord_str = f"{a[1]},{a[0]};{b[1]},{b[0]}"
        url = f"{OSRM_BASE}/route/v1/{profile}/{coord_str}?overview=full&geometries=geojson"
        resp = requests.get(url, timeout=timeout)
        resp.raise_for_status()
        data = resp.json()
        if data.get("code") != "Ok":
            return None
        coords_lonlat = data["routes"][0]["geometry"]["coordinates"]
        return [(lat, lon) for lon, lat in coords_lonlat]
    except Exception:
        return None


def haversine_matrix(coords, circuity=1.3):
    n = len(coords)
    return [
        [haversine_km(coords[i], coords[j]) * circuity if i != j else 0.0 for j in range(n)]
        for i in range(n)
    ]


# ---------------------------------------------------------------------------
# 3. TSP ROUND-TRIP DI DALAM SATU TIM (Held-Karp DP, closed tour)
#    Titik 0 dalam `indices` SELALU = SMA Negeri 3 Denpasar, dipaksa jadi
#    titik AWAL sekaligus AKHIR (pulang-pergi).
# ---------------------------------------------------------------------------
_TSP_CACHE = {}


def route_length(matrix, indices, order):
    return sum(
        matrix[indices[order[i]]][indices[order[i + 1]]] for i in range(len(order) - 1)
    )


def _solve_tsp_exact_dp_closed(matrix, indices):
    """Held-Karp DP untuk TOUR TERTUTUP (berangkat & kembali ke posisi 0).
    Hasil selalu OPTIMAL (bukan aproksimasi)."""
    n = len(indices)
    m = n - 1
    if m == 0:
        return [0], 0.0

    NEG = float("inf")
    full_mask = (1 << m) - 1
    dp = [[NEG] * m for _ in range(1 << m)]
    parent = [[-1] * m for _ in range(1 << m)]

    d_start = [matrix[indices[0]][indices[k + 1]] for k in range(m)]
    for j in range(m):
        dp[1 << j][j] = d_start[j]

    dmat = [[matrix[indices[a + 1]][indices[b + 1]] for b in range(m)] for a in range(m)]

    for mask in range(1, 1 << m):
        row = dp[mask]
        for j in range(m):
            cur = row[j]
            if cur == NEG or not (mask & (1 << j)):
                continue
            dj = dmat[j]
            for k in range(m):
                if mask & (1 << k):
                    continue
                nmask = mask | (1 << k)
                nd = cur + dj[k]
                if nd < dp[nmask][k]:
                    dp[nmask][k] = nd
                    parent[nmask][k] = j

    d_return = [matrix[indices[k + 1]][indices[0]] for k in range(m)]
    best_j = min(range(m), key=lambda j: dp[full_mask][j] + d_return[j])
    best_dist = dp[full_mask][best_j] + d_return[best_j]

    order_rest = []
    mask, j = full_mask, best_j
    while j != -1:
        order_rest.append(j + 1)
        pj = parent[mask][j]
        mask ^= (1 << j)
        j = pj
    order_rest.reverse()
    return [0] + order_rest + [0], best_dist


def _solve_tsp_heuristic_closed(matrix, indices):
    """Fallback NN + 2-opt untuk tim besar (jarang terjadi), versi tour
    tertutup: posisi awal & akhir sama-sama dipaksa = 0."""
    n = len(indices)
    unvisited = set(range(1, n))
    order = [0]
    while unvisited:
        last = order[-1]
        nxt = min(unvisited, key=lambda j: matrix[indices[last]][indices[j]])
        order.append(nxt)
        unvisited.remove(nxt)
    order.append(0)

    n_full = len(order)
    improved = True
    while improved:
        improved = False
        for i in range(1, n_full - 2):
            for j in range(i + 1, n_full - 1):
                a, b, c, d = order[i - 1], order[i], order[j], order[j + 1]
                before = matrix[indices[a]][indices[b]] + matrix[indices[c]][indices[d]]
                after = matrix[indices[a]][indices[c]] + matrix[indices[b]][indices[d]]
                if after + 1e-9 < before:
                    order[i : j + 1] = reversed(order[i : j + 1])
                    improved = True
    return order, route_length(matrix, indices, order)


def solve_tsp(matrix, indices):
    """indices: [0]+list sekolah (indeks global). Return: (order pulang-pergi,
    jarak total round-trip km). Cache di-key oleh HIMPUNAN sekolah, bukan
    urutan list, supaya cache hit sering saat local search."""
    n = len(indices)
    if n <= 1:
        return [0], 0.0

    key = (indices[0], tuple(sorted(indices[1:])))
    cached = _TSP_CACHE.get(key)
    if cached is not None:
        order_global, dist = cached
        pos = {g: i for i, g in enumerate(indices)}
        order = [pos[g] for g in order_global]
        return order, dist

    m = n - 1
    if m <= EXACT_TSP_MAX_M:
        order, dist = _solve_tsp_exact_dp_closed(matrix, indices)
    else:
        order, dist = _solve_tsp_heuristic_closed(matrix, indices)

    _TSP_CACHE[key] = ([indices[o] for o in order], dist)
    return order, dist


def team_route_distance(full_matrix, local_school_indices):
    """Jarak round-trip (berangkat & kembali ke SMA Negeri 3) untuk satu
    tim, dari daftar indeks LOKAL sekolah (0..n_schools-1)."""
    if not local_school_indices:
        return 0.0
    idxs = [0] + [i + 1 for i in local_school_indices]
    if len(idxs) <= 1:
        return 0.0
    _, dist = solve_tsp(full_matrix, idxs)
    return dist


# ---------------------------------------------------------------------------
# 4. PEMBAGIAN TIM — GREEDY REGIONAL GROWING (bukan k-means)
# ---------------------------------------------------------------------------
def fair_team_sizes(n_schools, k):
    """Bagi n_schools ke k tim seadil mungkin (selisih maksimal 1)."""
    base = n_schools // k
    rem = n_schools % k
    return [base + 1] * rem + [base] * (k - rem)


def farthest_point_seeds(school_matrix, k, start_idx, rng):
    n = len(school_matrix)
    seeds = [start_idx]
    min_dist = [school_matrix[start_idx][j] for j in range(n)]
    while len(seeds) < k:
        seed_set = set(seeds)
        candidates = [j for j in range(n) if j not in seed_set]
        if not candidates:
            break
        next_idx = max(candidates, key=lambda j: min_dist[j])
        seeds.append(next_idx)
        for j in range(n):
            if school_matrix[next_idx][j] < min_dist[j]:
                min_dist[j] = school_matrix[next_idx][j]
    return seeds


def greedy_regional_clustering(school_matrix, k, sizes, seed_indices):
    n = len(school_matrix)
    assigned = [-1] * n
    capacities = sizes[:]
    clusters = {c: [] for c in range(k)}
    heap = []

    for c, s in enumerate(seed_indices):
        assigned[s] = c
        capacities[c] -= 1
        clusters[c].append(s)

    for c, s in enumerate(seed_indices):
        for p in range(n):
            if assigned[p] == -1:
                heapq.heappush(heap, (school_matrix[s][p], p, c))

    while heap:
        d, p, c = heapq.heappop(heap)
        if assigned[p] != -1 or capacities[c] <= 0:
            continue
        assigned[p] = c
        capacities[c] -= 1
        clusters[c].append(p)
        for q in range(n):
            if assigned[q] == -1:
                heapq.heappush(heap, (school_matrix[p][q], q, c))

    remaining = [p for p in range(n) if assigned[p] == -1]
    for p in remaining:
        cand = [c for c in range(k) if capacities[c] > 0] or list(range(k))
        best_c = min(
            cand,
            key=lambda c: min((school_matrix[m][p] for m in clusters[c]), default=float("inf")),
        )
        assigned[p] = best_c
        capacities[best_c] -= 1
        clusters[best_c].append(p)

    return assigned


def _centroid_of(coords, indices):
    if not indices:
        return None
    lat = sum(coords[i][0] for i in indices) / len(indices)
    lon = sum(coords[i][1] for i in indices) / len(indices)
    return (lat, lon)


def local_search_refine(coords, full_matrix, assignment, k, n_schools, max_passes=10, near_teams=5):
    assignment = assignment[:]
    team_points = {c: [i for i in range(n_schools) if assignment[i] == c] for c in range(k)}
    dists = [team_route_distance(full_matrix, team_points[c]) for c in range(k)]
    best_total = sum(dists)

    for _ in range(max_passes):
        improved = False
        centroids = {c: _centroid_of(coords, team_points[c]) for c in range(k)}

        for i in range(n_schools):
            ti = assignment[i]
            candidate_teams = sorted(
                (c for c in range(k) if c != ti and centroids[c] is not None),
                key=lambda c: haversine_km(coords[i], centroids[c]),
            )[:near_teams]

            swapped = False
            for tj in candidate_teams:
                for j in team_points[tj][:]:
                    pts_ti = [m for m in team_points[ti] if m != i] + [j]
                    pts_tj = [m for m in team_points[tj] if m != j] + [i]
                    new_dist_ti = team_route_distance(full_matrix, pts_ti)
                    new_dist_tj = team_route_distance(full_matrix, pts_tj)
                    old_pair = dists[ti] + dists[tj]
                    new_pair = new_dist_ti + new_dist_tj
                    if new_pair + 1e-9 < old_pair:
                        assignment[i], assignment[j] = tj, ti
                        team_points[ti].remove(i)
                        team_points[tj].remove(j)
                        team_points[ti].append(j)
                        team_points[tj].append(i)
                        dists[ti], dists[tj] = new_dist_ti, new_dist_tj
                        best_total += new_pair - old_pair
                        centroids[ti] = _centroid_of(coords, team_points[ti])
                        centroids[tj] = _centroid_of(coords, team_points[tj])
                        improved = True
                        swapped = True
                        break
                if swapped:
                    break

        if not improved:
            break

    return assignment, best_total


def _restart_worker(args):
    seed, coords, school_matrix, full_matrix, k, base_sizes, n_schools = args
    rng = random.Random(seed)
    start_idx = rng.randrange(n_schools)
    seed_indices = farthest_point_seeds(school_matrix, k, start_idx, rng)
    sizes = base_sizes[:]
    rng.shuffle(sizes)
    assignment = greedy_regional_clustering(school_matrix, k, sizes, seed_indices)
    assignment, total = local_search_refine(coords, full_matrix, assignment, k, n_schools)
    return assignment, total


def best_greedy_clustering(coords, school_matrix, full_matrix, k, n_schools, restarts=10, max_workers=None):
    base_sizes = fair_team_sizes(n_schools, k)
    tasks = [
        (seed, coords, school_matrix, full_matrix, k, base_sizes, n_schools)
        for seed in range(restarts)
    ]

    if max_workers is None:
        max_workers = min(restarts, os.cpu_count() or 1)

    best_assignment, best_total = None, float("inf")

    if max_workers > 1 and restarts > 1:
        with concurrent.futures.ProcessPoolExecutor(max_workers=max_workers) as ex:
            for assignment, total in ex.map(_restart_worker, tasks):
                if total < best_total:
                    best_total, best_assignment = total, assignment
    else:
        for t in tasks:
            assignment, total = _restart_worker(t)
            if total < best_total:
                best_total, best_assignment = total, assignment

    return best_assignment, best_total


# ---------------------------------------------------------------------------
# 4b. JAMINAN JARAK MINIMUM PER TIM (v5)
#     Kalau ada tim yang jarak pulang-perginya < min_distance_km, tim itu
#     "dipaksa" mengunjungi sekolah tambahan — diambil dari tim lain yang
#     PALING DEKAT ke rute tim tersebut (dan tim donor masih tersisa
#     sekolah lain, tidak sampai kosong) — sampai jaraknya cukup.
# ---------------------------------------------------------------------------
def enforce_minimum_team_distance(full_matrix, assignment, k, n_schools,
                                   min_distance_km=DEFAULT_MIN_TEAM_DISTANCE_KM,
                                   max_iterations=1000):
    assignment = assignment[:]
    team_points = {c: [i for i in range(n_schools) if assignment[i] == c] for c in range(k)}
    dists = {c: team_route_distance(full_matrix, team_points[c]) for c in range(k)}

    moves_log = []

    for _ in range(max_iterations):
        # Cari tim yang PALING kekurangan jarak (paling di bawah ambang).
        deficient = [c for c in range(k) if dists[c] < min_distance_km]
        if not deficient:
            break
        target = min(deficient, key=lambda c: dists[c])

        ref_points = team_points[target]  # bisa kosong kalau tim ini belum punya sekolah sama sekali

        best_school, best_donor, best_dist = None, None, float("inf")
        for donor in range(k):
            if donor == target:
                continue
            # Jangan sampai tim donor jadi kosong total karena disedot.
            if len(team_points[donor]) <= 1:
                continue
            for school in team_points[donor]:
                if ref_points:
                    d = min(full_matrix[m + 1][school + 1] for m in ref_points)
                else:
                    d = full_matrix[0][school + 1]  # dari titik START kalau tim target masih kosong
                if d < best_dist:
                    best_dist = d
                    best_school = school
                    best_donor = donor

        if best_school is None:
            # Tidak ada lagi sekolah yang bisa dipindah tanpa mengosongkan tim lain.
            break

        team_points[best_donor].remove(best_school)
        team_points[target].append(best_school)
        assignment[best_school] = target
        dists[target] = team_route_distance(full_matrix, team_points[target])
        dists[best_donor] = team_route_distance(full_matrix, team_points[best_donor])
        moves_log.append((best_school, best_donor, target))

    return assignment, dists, moves_log


# ---------------------------------------------------------------------------
# 5. RENDER PETA HTML — round-trip (garis balik ke start ikut digambar)
# ---------------------------------------------------------------------------
def color_for(i):
    if i < len(QUALITATIVE_PALETTE):
        return QUALITATIVE_PALETTE[i]
    rng = random.Random(i)
    return "#%06x" % rng.randint(0, 0xFFFFFF)


def build_map(all_schools, matrix, assignment, k, n_schools, output_path, draw_real_roads, profile="driving", http_workers=8):
    center_lat = sum(s[1] for s in all_schools) / len(all_schools)
    center_lon = sum(s[2] for s in all_schools) / len(all_schools)
    m = folium.Map(location=[center_lat, center_lon], zoom_start=12, tiles="cartodbpositron")

    team_routes = []
    all_segments = set()
    for team in range(k):
        indices = [0] + [i + 1 for i in range(n_schools) if assignment[i] == team]
        if len(indices) <= 1:
            continue
        order, dist = solve_tsp(matrix, indices)
        ordered_global_idx = [indices[o] for o in order]  # round-trip: elemen pertama & terakhir = 0
        team_routes.append((team, ordered_global_idx, dist))
        if draw_real_roads:
            for a_idx, b_idx in zip(ordered_global_idx[:-1], ordered_global_idx[1:]):
                all_segments.add((a_idx, b_idx))

    geometry_cache = {}
    if draw_real_roads and all_segments:
        def fetch_seg(pair):
            a_idx, b_idx = pair
            a = (all_schools[a_idx][1], all_schools[a_idx][2])
            b = (all_schools[b_idx][1], all_schools[b_idx][2])
            return pair, fetch_osrm_route_geometry(a, b, profile=profile)

        with concurrent.futures.ThreadPoolExecutor(max_workers=http_workers) as ex:
            for pair, geom in ex.map(fetch_seg, all_segments):
                geometry_cache[pair] = geom

    summary = []
    grand_total = 0.0
    for team, ordered_global_idx, dist in team_routes:
        grand_total += dist
        color = color_for(team)
        n_stops = len(ordered_global_idx) - 1  # tidak menghitung dobel titik start di akhir
        fg = folium.FeatureGroup(
            name=f"Tim {team + 1} — {n_stops} titik (pulang-pergi) — ~{dist:.1f} km (rute jalan)"
        )
        stop_names = []

        for seq, gi in enumerate(ordered_global_idx, start=1):
            name, lat, lon = all_schools[gi]
            if gi == 0:
                if seq == 1:
                    stop_names.append(f"START: {name}")
                    folium.Marker(
                        location=(lat, lon),
                        icon=folium.DivIcon(
                            html=f"""
                            <div style="position:relative;">
                                <div style="
                                    background:#111;color:#ffd700;border-radius:50%;
                                    width:26px;height:26px;text-align:center;line-height:26px;
                                    font-size:12px;font-weight:bold;border:2px solid #ffd700;
                                    box-shadow:0 0 5px rgba(0,0,0,0.7);">
                                    S
                                </div>
                                <div style="
                                    position:absolute;left:30px;top:2px;white-space:nowrap;
                                    background:rgba(255,255,255,0.92);padding:1px 5px;border-radius:3px;
                                    font-size:11px;border:1px solid #111;color:#111;
                                    font-family:Arial, sans-serif;font-weight:bold;">
                                    START/FINISH — {name}
                                </div>
                            </div>"""
                        ),
                        popup=f"<b>START & FINISH (semua tim)</b><br>{name}",
                    ).add_to(fg)
                else:
                    stop_names.append(f"FINISH: kembali ke {name}")
                continue

            stop_names.append(f"{seq}. {name}")
            folium.Marker(
                location=(lat, lon),
                icon=folium.DivIcon(
                    html=f"""
                    <div style="position:relative;">
                        <div style="
                            background:{color};color:white;border-radius:50%;
                            width:24px;height:24px;text-align:center;line-height:24px;
                            font-size:11px;font-weight:bold;border:2px solid white;
                            box-shadow:0 0 3px rgba(0,0,0,0.6);">
                            {seq}
                        </div>
                        <div style="
                            position:absolute;left:28px;top:2px;white-space:nowrap;
                            background:rgba(255,255,255,0.88);padding:1px 5px;border-radius:3px;
                            font-size:11px;border:1px solid {color};color:#222;
                            font-family:Arial, sans-serif;">
                            {name}
                        </div>
                    </div>"""
                ),
                popup=f"<b>Tim {team + 1}</b><br>Stop {seq}: {name}",
            ).add_to(fg)

        if draw_real_roads:
            for a_idx, b_idx in zip(ordered_global_idx[:-1], ordered_global_idx[1:]):
                geometry = geometry_cache.get((a_idx, b_idx))
                a = (all_schools[a_idx][1], all_schools[a_idx][2])
                b = (all_schools[b_idx][1], all_schools[b_idx][2])
                if geometry:
                    folium.PolyLine(geometry, color=color, weight=4, opacity=0.85).add_to(fg)
                else:
                    folium.PolyLine([a, b], color=color, weight=3, opacity=0.5, dash_array="6,6").add_to(fg)
        else:
            latlon = [(all_schools[gi][1], all_schools[gi][2]) for gi in ordered_global_idx]
            folium.PolyLine(latlon, color=color, weight=4, opacity=0.85, dash_array="6,6").add_to(fg)

        fg.add_to(m)
        summary.append((team + 1, n_stops, dist, stop_names))

    folium.LayerControl(collapsed=False).add_to(m)
    m.save(output_path)
    return summary, grand_total


# ---------------------------------------------------------------------------
# 6. MAIN
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Denpasar School Visit Route Planner v5 (greedy regional explorer, round-trip, jarak minimum per tim)"
    )
    parser.add_argument("--teams", type=int, default=14, help="Jumlah tim (default: 14)")
    parser.add_argument("--output", type=str, default="denpasar_routes_v3.html", help="Nama file HTML output")
    parser.add_argument("--restarts", type=int, default=10, help="Jumlah percobaan pemilihan titik jangkar acak")
    parser.add_argument(
        "--profile", type=str, default="driving", choices=["driving", "bike", "foot"],
        help="Moda transportasi untuk OSRM (default: driving/mobil-motor)",
    )
    parser.add_argument(
        "--no-road-lines", action="store_true",
        help="Kalau dipakai, garis rute di peta digambar lurus saja (lebih cepat)",
    )
    parser.add_argument("--workers", type=int, default=None, help="Jumlah proses paralel untuk clustering")
    parser.add_argument("--http-workers", type=int, default=8, help="Jumlah thread paralel untuk request OSRM")
    parser.add_argument(
        "--min-distance", type=float, default=DEFAULT_MIN_TEAM_DISTANCE_KM,
        help="Jarak pulang-pergi MINIMUM per tim dalam KM (default: 10). "
             "Kalau ada tim di bawah ambang ini, tim itu akan diberi sekolah "
             "tambahan dari tim tetangga sampai jaraknya cukup.",
    )
    args = parser.parse_args()

    t0 = time.time()

    start_coord = (START_SCHOOL[1], START_SCHOOL[2])
    all_coords = [start_coord] + [(s[1], s[2]) for s in SCHOOLS]
    n_schools = len(SCHOOLS)
    school_coords = all_coords[1:]

    print("Mengambil matriks jarak RUTE JALAN dari OSRM (paralel, per-chunk)...")
    matrix = fetch_osrm_matrix(all_coords, profile=args.profile, max_workers=args.http_workers)
    used_real_roads = matrix is not None
    if matrix is None:
        print("    -> Gagal. Pakai estimasi garis-lurus x1.3 sebagai fallback.")
        matrix = haversine_matrix(all_coords)
        school_matrix = haversine_matrix(school_coords)
    else:
        print("    -> Berhasil, memakai jarak rute jalan sungguhan dari OSRM.")
        school_matrix = [[matrix[i + 1][j + 1] for j in range(n_schools)] for i in range(n_schools)]

    print(
        f"Membagi {n_schools} sekolah ke {args.teams} tim dengan strategi GREEDY REGIONAL "
        f"(paralel, {args.restarts} percobaan) — semua tim pulang-pergi dari "
        f"{START_SCHOOL[0]}..."
    )
    assignment, best_total = best_greedy_clustering(
        school_coords, school_matrix, matrix, args.teams, n_schools,
        restarts=args.restarts, max_workers=args.workers,
    )

    print(
        f"Menjamin jarak pulang-pergi minimum {args.min_distance:.1f} km per tim "
        f"(tim yang jaraknya terlalu pendek akan diberi sekolah tambahan)..."
    )
    assignment, dists, moves_log = enforce_minimum_team_distance(
        matrix, assignment, args.teams, n_schools, min_distance_km=args.min_distance,
    )
    if moves_log:
        print(f"    -> {len(moves_log)} sekolah dipindahkan antar tim untuk memenuhi jarak minimum:")
        for school_idx, donor, target in moves_log:
            print(f"       '{SCHOOLS[school_idx][0]}': Tim {donor + 1} -> Tim {target + 1}")
    else:
        print("    -> Semua tim sudah memenuhi jarak minimum tanpa perlu penyesuaian.")

    print("Menyusun peta & mengambil geometri jalan (paralel)...")
    summary, grand_total = build_map(
        ALL_SCHOOLS, matrix, assignment, args.teams, n_schools, args.output,
        draw_real_roads=used_real_roads and not args.no_road_lines,
        profile=args.profile,
        http_workers=args.http_workers,
    )

    max_dist = max((d for _, _, d, _ in summary), default=0.0)
    min_dist = min((d for _, _, d, _ in summary), default=0.0)
    label = "jarak rute jalan sungguhan (pulang-pergi)" if used_real_roads else "estimasi garis-lurus x1.3 (pulang-pergi)"
    print(f"\n=== Ringkasan Rute — {args.teams} Tim ({n_schools} sekolah, round-trip) — {label} ===\n")
    for team_no, count, dist, stops in sorted(summary):
        flag = ""
        if abs(dist - max_dist) < 1e-6:
            flag = "  <-- terjauh"
        elif abs(dist - min_dist) < 1e-6:
            flag = "  <-- terpendek"
        print(f"Tim {team_no}: {count} sekolah, jarak pulang-pergi ~{dist:.1f} km{flag}")
        for s in stops:
            print(f"    {s}")
        print()
    print(f"Jarak tim terjauh   : {max_dist:.1f} km")
    print(f"Jarak tim terpendek : {min_dist:.1f} km  (target minimum: {args.min_distance:.1f} km)")
    print(f"Total seluruh tim   : {grand_total:.1f} km")
    if not used_real_roads:
        print("\n[!] PERINGATAN: angka di atas MASIH ESTIMASI garis-lurus x1.3, bukan rute jalan")
        print("    sungguhan, karena OSRM tidak bisa diakses saat script ini dijalankan.")
    print(f"\nPeta interaktif disimpan di: {args.output}")
    print(f"Total waktu eksekusi: {time.time() - t0:.1f} detik")


if __name__ == "__main__":
    main()