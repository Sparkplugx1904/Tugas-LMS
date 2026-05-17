import { useState } from "react";

const soalData = [
  // ── DOMAIN FUNGSI ────────────────────────────────────────────────────────────
  {
    id: 1,
    bab: "Fungsi",
    topik: "Daerah Asal Fungsi",
    level: "C3",
    soal: "Daerah asal fungsi f(x) = √(2x − 4) adalah …",
    opsi: [
      "{ x | x ≥ 2, x ∈ ℝ }",
      "{ x | x > 2, x ∈ ℝ }",
      "{ x | x ≥ −2, x ∈ ℝ }",
      "{ x | x ≤ 2, x ∈ ℝ }",
      "{ x | x < 2, x ∈ ℝ }",
    ],
    jawaban: 0,
    pembahasan: "Syarat: 2x − 4 ≥ 0 ⟹ x ≥ 2.",
  },
  {
    id: 2,
    bab: "Fungsi",
    topik: "Daerah Asal Fungsi",
    level: "C3",
    soal: "Daerah asal fungsi f(x) = (x + 3) / (x² − x − 6) adalah …",
    opsi: [
      "{ x | x ≠ 3, x ∈ ℝ }",
      "{ x | x ≠ −2, x ∈ ℝ }",
      "{ x | x ≠ 3 dan x ≠ −2, x ∈ ℝ }",
      "{ x | x ≠ −3 dan x ≠ 2, x ∈ ℝ }",
      "{ x | x ∈ ℝ }",
    ],
    jawaban: 2,
    pembahasan: "Penyebut: x² − x − 6 = (x − 3)(x + 2) ≠ 0 ⟹ x ≠ 3 dan x ≠ −2.",
  },
  {
    id: 3,
    bab: "Fungsi",
    topik: "Daerah Asal Fungsi",
    level: "C3",
    soal: "Daerah asal fungsi f(x) = √(x² − 9) adalah …",
    opsi: [
      "{ x | −3 ≤ x ≤ 3, x ∈ ℝ }",
      "{ x | x ≤ −3 atau x ≥ 3, x ∈ ℝ }",
      "{ x | x > 3, x ∈ ℝ }",
      "{ x | x < −3, x ∈ ℝ }",
      "{ x | x ≤ −3, x ∈ ℝ }",
    ],
    jawaban: 1,
    pembahasan: "Syarat: x² − 9 ≥ 0 ⟹ (x − 3)(x + 3) ≥ 0 ⟹ x ≤ −3 atau x ≥ 3.",
  },
  {
    id: 4,
    bab: "Fungsi",
    topik: "Daerah Asal Fungsi",
    level: "C3",
    soal: "Daerah asal fungsi f(x) = √(5 − x) / (x − 2) adalah …",
    opsi: [
      "{ x | x ≤ 5, x ∈ ℝ }",
      "{ x | x < 5 dan x ≠ 2, x ∈ ℝ }",
      "{ x | x ≤ 5 dan x ≠ 2, x ∈ ℝ }",
      "{ x | x ≥ 5, x ∈ ℝ }",
      "{ x | 2 < x ≤ 5, x ∈ ℝ }",
    ],
    jawaban: 2,
    pembahasan: "Syarat pembilang: 5 − x ≥ 0 ⟹ x ≤ 5. Syarat penyebut: x − 2 ≠ 0 ⟹ x ≠ 2.",
  },
  {
    id: 5,
    bab: "Fungsi",
    topik: "Daerah Asal Fungsi",
    level: "C3",
    soal: "Daerah asal fungsi f(x) = 2 / √(3x − 6) adalah …",
    opsi: [
      "{ x | x > 2, x ∈ ℝ }",
      "{ x | x ≥ 2, x ∈ ℝ }",
      "{ x | x < 2, x ∈ ℝ }",
      "{ x | x ≠ 2, x ∈ ℝ }",
      "{ x | x > 6, x ∈ ℝ }",
    ],
    jawaban: 0,
    pembahasan: "Syarat: 3x − 6 > 0 (tidak sama dengan nol karena di bawah akar di penyebut) ⟹ x > 2.",
  },

  // ── HIMPUNAN PASANGAN BERURUTAN ──────────────────────────────────────────────
  {
    id: 6,
    bab: "Fungsi",
    topik: "Himpunan Pasangan Berurutan",
    level: "C3",
    soal: "Diketahui A = {1, 2, 3} dan B = {p, q, r, s}. Himpunan pasangan berurutan yang merupakan fungsi dari A ke B adalah …",
    opsi: [
      "{ (1,p), (1,q), (2,r), (3,s) }",
      "{ (1,p), (2,q), (3,r) }",
      "{ (1,p), (2,q) }",
      "{ (1,p), (2,q), (2,r), (3,s) }",
      "{ (p,1), (q,2), (r,3) }",
    ],
    jawaban: 1,
    pembahasan: "Fungsi: setiap anggota domain (A) dipasangkan tepat satu kali. Opsi B memetakan 1→p, 2→q, 3→r (semua anggota A muncul tepat sekali).",
  },
  {
    id: 7,
    bab: "Fungsi",
    topik: "Himpunan Pasangan Berurutan",
    level: "C3",
    soal: "Diketahui A = {a, b, c, d} dan B = {1, 2, 3}. Himpunan pasangan berurutan yang merupakan fungsi dari A ke B adalah …",
    opsi: [
      "{ (a,1), (b,2), (c,3), (d,3) }",
      "{ (a,1), (b,2), (c,3) }",
      "{ (a,1), (a,2), (b,2), (c,3), (d,1) }",
      "{ (a,1), (b,2) }",
      "{ (1,a), (2,b), (3,c) }",
    ],
    jawaban: 0,
    pembahasan: "Setiap anggota A (a, b, c, d) muncul tepat satu kali. Opsi A memenuhi syarat tersebut; dua anggota boleh dipasangkan ke nilai yang sama.",
  },
  {
    id: 8,
    bab: "Fungsi",
    topik: "Himpunan Pasangan Berurutan",
    level: "C3",
    soal: "Diketahui A = {1, 2, 3, 4} dan B = {2, 4, 6, 8, 10}. Aturan yang mendefinisikan fungsi dari A ke B adalah …",
    opsi: [
      "Setiap anggota A dikurangi 1 dipasangkan dengan anggota B",
      "Setiap anggota A dikali 2 dipasangkan dengan anggota B",
      "Setiap anggota A ditambah 3 dipasangkan dengan anggota B",
      "Setiap anggota A dipangkatkan 2 dipasangkan dengan anggota B",
      "Setiap anggota A dibagi 2 dipasangkan dengan anggota B",
    ],
    jawaban: 1,
    pembahasan: "Dikali 2: 1→2, 2→4, 3→6, 4→8; semua hasil ada di B. Aturan lain menghasilkan nilai yang tidak seluruhnya ada di B.",
  },

  // ── OPERASI ALJABAR f ± g ────────────────────────────────────────────────────
  {
    id: 9,
    bab: "Fungsi",
    topik: "Operasi Aljabar f ± g",
    level: "C3",
    soal: "Diketahui f(x) = 3x + 2 dan g(x) = x² − 1. Nilai (f + g)(2) adalah …",
    opsi: ["9", "10", "11", "12", "13"],
    jawaban: 2,
    pembahasan: "(f + g)(2) = f(2) + g(2) = (6+2) + (4−1) = 8 + 3 = 11.",
  },
  {
    id: 10,
    bab: "Fungsi",
    topik: "Operasi Aljabar f ± g",
    level: "C3",
    soal: "Diketahui f(x) = 2x − 5 dan g(x) = x² + 3x. Nilai (g − f)(3) adalah …",
    opsi: ["15", "16", "17", "18", "19"],
    jawaban: 2,
    pembahasan: "g(3) − f(3) = (9 + 9) − (6 − 5) = 18 − 1 = 17.",
  },
  {
    id: 11,
    bab: "Fungsi",
    topik: "Operasi Aljabar f ± g",
    level: "C3",
    soal: "Diketahui f(x) = √(x + 1) dan g(x) = x − 2. Fungsi (f + g)(x) adalah …",
    opsi: [
      "√(x+1) + x − 2",
      "√(x+1) − x + 2",
      "√(x−1) + x + 2",
      "x − √(x+1) − 2",
      "√(x+2) + x − 1",
    ],
    jawaban: 0,
    pembahasan: "(f + g)(x) = √(x+1) + (x − 2) = √(x+1) + x − 2.",
  },
  {
    id: 12,
    bab: "Fungsi",
    topik: "Operasi Aljabar f ± g",
    level: "C3",
    soal: "Diketahui f(x) = x² + 2x dan g(x) = 3x − 1. Nilai (f − g)(2) adalah …",
    opsi: ["1", "2", "3", "4", "5"],
    jawaban: 2,
    pembahasan: "f(2) − g(2) = (4+4) − (6−1) = 8 − 5 = 3.",
  },

  // ── DOMAIN OPERASI f × g ──────────────────────────────────────────────────
  {
    id: 13,
    bab: "Fungsi",
    topik: "Daerah Asal (f × g)",
    level: "C3",
    soal: "Diketahui f(x) = √(x − 1) dan g(x) = √(4 − x). Daerah asal (f × g)(x) adalah …",
    opsi: [
      "{ x | x ≥ 1, x ∈ ℝ }",
      "{ x | x ≤ 4, x ∈ ℝ }",
      "{ x | 1 ≤ x ≤ 4, x ∈ ℝ }",
      "{ x | 1 < x < 4, x ∈ ℝ }",
      "{ x | x ≥ 4, x ∈ ℝ }",
    ],
    jawaban: 2,
    pembahasan: "x − 1 ≥ 0 ⟹ x ≥ 1 dan 4 − x ≥ 0 ⟹ x ≤ 4. Irisan: 1 ≤ x ≤ 4.",
  },
  {
    id: 14,
    bab: "Fungsi",
    topik: "Daerah Asal (f × g)",
    level: "C3",
    soal: "Diketahui f(x) = 1/(x − 2) dan g(x) = √(x + 3). Daerah asal (f × g)(x) adalah …",
    opsi: [
      "{ x | x ≥ −3, x ∈ ℝ }",
      "{ x | x ≥ −3 dan x ≠ 2, x ∈ ℝ }",
      "{ x | x > −3, x ∈ ℝ }",
      "{ x | x ≠ 2, x ∈ ℝ }",
      "{ x | x ≥ −3 atau x ≠ 2, x ∈ ℝ }",
    ],
    jawaban: 1,
    pembahasan: "x + 3 ≥ 0 ⟹ x ≥ −3 dan x − 2 ≠ 0 ⟹ x ≠ 2. Irisan: x ≥ −3 dan x ≠ 2.",
  },
  {
    id: 15,
    bab: "Fungsi",
    topik: "Daerah Asal (f × g)",
    level: "C3",
    soal: "Diketahui f(x) = √(2x − 6) dan g(x) = 1/(x − 5). Daerah asal (f × g)(x) adalah …",
    opsi: [
      "{ x | x ≥ 3, x ∈ ℝ }",
      "{ x | x > 3 dan x ≠ 5, x ∈ ℝ }",
      "{ x | x ≥ 3 dan x ≠ 5, x ∈ ℝ }",
      "{ x | x ≠ 5, x ∈ ℝ }",
      "{ x | x ≥ 5, x ∈ ℝ }",
    ],
    jawaban: 2,
    pembahasan: "2x − 6 ≥ 0 ⟹ x ≥ 3 dan x − 5 ≠ 0 ⟹ x ≠ 5. Irisan: x ≥ 3 dan x ≠ 5.",
  },

  // ── KOMPOSISI FUNGSI ──────────────────────────────────────────────────────────
  {
    id: 16,
    bab: "Komposisi Fungsi",
    topik: "Menentukan (f∘g)(x)",
    level: "C3",
    soal: "Diketahui f(x) = 2x + 1 dan g(x) = x² − 3. Nilai (f∘g)(2) adalah …",
    opsi: ["1", "2", "3", "4", "5"],
    jawaban: 2,
    pembahasan: "g(2) = 4 − 3 = 1, kemudian f(1) = 2(1) + 1 = 3.",
  },
  {
    id: 17,
    bab: "Komposisi Fungsi",
    topik: "Menentukan (f∘g)(x)",
    level: "C3",
    soal: "Diketahui f(x) = x + 4 dan g(x) = 3x − 2. Fungsi (f∘g)(x) adalah …",
    opsi: ["3x − 2", "3x + 2", "3x + 6", "3x − 6", "x + 6"],
    jawaban: 1,
    pembahasan: "(f∘g)(x) = f(3x−2) = (3x−2) + 4 = 3x + 2.",
  },
  {
    id: 18,
    bab: "Komposisi Fungsi",
    topik: "Menentukan (f∘g)(x)",
    level: "C3",
    soal: "Diketahui f(x) = x² + 1 dan g(x) = 2x − 3. Fungsi (g∘f)(x) adalah …",
    opsi: ["2x² + 1", "2x² − 1", "2x² + 2", "4x² − 1", "2x² − 3"],
    jawaban: 1,
    pembahasan: "(g∘f)(x) = g(x²+1) = 2(x²+1) − 3 = 2x² − 1.",
  },
  {
    id: 19,
    bab: "Komposisi Fungsi",
    topik: "Menentukan (f∘g)(x)",
    level: "C3",
    soal: "Diketahui f(x) = (x − 1)/2 dan g(x) = 3x + 5. Nilai (f∘g)(1) adalah …",
    opsi: ["3", "7/2", "4", "9/2", "5"],
    jawaban: 1,
    pembahasan: "g(1) = 3 + 5 = 8, kemudian f(8) = (8−1)/2 = 7/2.",
  },
  {
    id: 20,
    bab: "Komposisi Fungsi",
    topik: "Menentukan (f∘g)(x)",
    level: "C3",
    soal: "Diketahui f(x) = √(x + 2) dan g(x) = x² − 2. Fungsi (f∘g)(x) adalah …",
    opsi: ["√(x²+2)", "x²", "|x|", "√(x−2)", "x² − 2"],
    jawaban: 2,
    pembahasan: "(f∘g)(x) = f(x²−2) = √((x²−2)+2) = √(x²) = |x|.",
  },

  // ── MENENTUKAN f(x) DARI KOMPOSISI ───────────────────────────────────────────
  {
    id: 21,
    bab: "Komposisi Fungsi",
    topik: "Menentukan f(x) dari Komposisi",
    level: "C3",
    soal: "Diketahui g(x) = x + 3 dan (f∘g)(x) = 2x + 5. Fungsi f(x) adalah …",
    opsi: ["2x − 1", "2x + 1", "2x − 5", "2x + 5", "x − 1"],
    jawaban: 0,
    pembahasan: "Misal u = x+3, maka x = u−3. f(u) = 2(u−3)+5 = 2u − 1. Jadi f(x) = 2x − 1.",
  },
  {
    id: 22,
    bab: "Komposisi Fungsi",
    topik: "Menentukan f(x) dari Komposisi",
    level: "C3",
    soal: "Diketahui g(x) = 2x − 1 dan (f∘g)(x) = 4x² − 4x + 3. Fungsi f(x) adalah …",
    opsi: ["x² − 2", "x² + 2", "x² + 1", "2x² + 2", "x² − 1"],
    jawaban: 1,
    pembahasan: "Misal u = 2x−1, maka x = (u+1)/2. f(u) = (u+1)² − 2(u+1) + 3 = u² + 2. Jadi f(x) = x² + 2.",
  },
  {
    id: 23,
    bab: "Komposisi Fungsi",
    topik: "Menentukan f(x) dari Komposisi",
    level: "C3",
    soal: "Diketahui g(x) = x + 2 dan (f∘g)(x) = x² + 4x + 1. Fungsi f(x) adalah …",
    opsi: ["x² − 3", "x² + 3", "x² − 1", "x² + 1", "(x+2)² − 3"],
    jawaban: 0,
    pembahasan: "Misal u = x+2, maka x = u−2. f(u) = (u−2)² + 4(u−2) + 1 = u² − 3. Jadi f(x) = x² − 3.",
  },

  // ── HIMPUNAN PASANGAN BERURUTAN DARI KOMPOSISI ────────────────────────────────
  {
    id: 24,
    bab: "Komposisi Fungsi",
    topik: "Himpunan Pasangan Berurutan dari Komposisi",
    level: "C3",
    soal: "Diketahui f = {(1,3),(2,5),(3,7),(4,9)} dan g = {(3,2),(5,4),(7,6),(9,8)}. Himpunan pasangan berurutan dari (g∘f) adalah …",
    opsi: [
      "{ (1,2),(2,4),(3,6),(4,8) }",
      "{ (3,2),(5,4),(7,6),(9,8) }",
      "{ (1,3),(2,5),(3,7),(4,9) }",
      "{ (2,1),(4,2),(6,3),(8,4) }",
      "{ (1,6),(2,8),(3,10),(4,12) }",
    ],
    jawaban: 0,
    pembahasan:
      "g(f(1))=g(3)=2, g(f(2))=g(5)=4, g(f(3))=g(7)=6, g(f(4))=g(9)=8. Jadi (g∘f) = {(1,2),(2,4),(3,6),(4,8)}.",
  },
  {
    id: 25,
    bab: "Komposisi Fungsi",
    topik: "Himpunan Pasangan Berurutan dari Komposisi",
    level: "C3",
    soal: "Diketahui f = {(2,3),(3,4),(4,5)} dan g = {(1,2),(2,3),(3,4)}. Himpunan pasangan berurutan dari (f∘g) adalah …",
    opsi: [
      "{ (1,3),(2,4),(3,5) }",
      "{ (1,2),(2,3),(3,4) }",
      "{ (2,3),(3,4),(4,5) }",
      "{ (1,4),(2,5),(3,6) }",
      "{ (1,2),(2,4),(3,5) }",
    ],
    jawaban: 0,
    pembahasan:
      "f(g(1))=f(2)=3, f(g(2))=f(3)=4, f(g(3))=f(4)=5. Jadi (f∘g) = {(1,3),(2,4),(3,5)}.",
  },

  // ── MENENTUKAN NILAI a ────────────────────────────────────────────────────────
  {
    id: 26,
    bab: "Komposisi Fungsi",
    topik: "Menentukan Nilai a dari Komposisi",
    level: "C3",
    soal: "Diketahui f(x) = 3x − 1 dan g(x) = x + 4. Jika (f∘g)(a) = 14, nilai a adalah …",
    opsi: ["−1", "0", "1", "2", "3"],
    jawaban: 2,
    pembahasan: "(f∘g)(a) = f(a+4) = 3(a+4)−1 = 3a+11 = 14 ⟹ 3a = 3 ⟹ a = 1.",
  },
  {
    id: 27,
    bab: "Komposisi Fungsi",
    topik: "Menentukan Nilai a dari Komposisi",
    level: "C3",
    soal: "Diketahui f(x) = x² − 1 dan g(x) = 2x + 3. Jika (g∘f)(a) = 9, nilai a yang mungkin adalah …",
    opsi: [
      "a = 1 atau a = −1",
      "a = 2 atau a = −2",
      "a = 3 atau a = −3",
      "a = 4",
      "a = −4",
    ],
    jawaban: 1,
    pembahasan: "(g∘f)(a) = 2(a²−1)+3 = 2a²+1 = 9 ⟹ a² = 4 ⟹ a = ±2.",
  },
  {
    id: 28,
    bab: "Komposisi Fungsi",
    topik: "Menentukan Nilai a dari Komposisi",
    level: "C3",
    soal: "Diketahui f(x) = 2x + 1 dan g(x) = x − 3. Jika (f∘g)(a) = 5, nilai a adalah …",
    opsi: ["1", "2", "3", "4", "5"],
    jawaban: 4,
    pembahasan: "(f∘g)(a) = f(a−3) = 2(a−3)+1 = 2a−5 = 5 ⟹ 2a = 10 ⟹ a = 5.",
  },

  // ── INVERS FUNGSI ─────────────────────────────────────────────────────────────
  {
    id: 29,
    bab: "Invers Fungsi",
    topik: "Nilai f⁻¹(a)",
    level: "C3",
    soal: "Diketahui f(x) = 3x − 5. Nilai f⁻¹(7) adalah …",
    opsi: ["2", "3", "4", "5", "6"],
    jawaban: 2,
    pembahasan: "f(x) = 7 ⟹ 3x − 5 = 7 ⟹ x = 4.",
  },
  {
    id: 30,
    bab: "Invers Fungsi",
    topik: "Nilai f⁻¹(a)",
    level: "C3",
    soal: "Diketahui f(x) = (2x + 1)/(x − 3), x ≠ 3. Nilai f⁻¹(3) adalah …",
    opsi: ["5", "7", "8", "10", "12"],
    jawaban: 3,
    pembahasan:
      "f⁻¹(y) = (3y+1)/(y−2). f⁻¹(3) = (9+1)/(3−2) = 10.",
  },
  {
    id: 31,
    bab: "Invers Fungsi",
    topik: "Nilai f⁻¹(a)",
    level: "C3",
    soal: "Diketahui f(x) = (x + 4)/3. Fungsi invers f⁻¹(x) adalah …",
    opsi: ["3x + 4", "3x − 4", "(x−4)/3", "(x+4)/3", "3(x−4)"],
    jawaban: 1,
    pembahasan: "y = (x+4)/3 ⟹ x = 3y − 4. Jadi f⁻¹(x) = 3x − 4.",
  },
  {
    id: 32,
    bab: "Invers Fungsi",
    topik: "Nilai f⁻¹(a)",
    level: "C3",
    soal: "Diketahui f(x) = 2x − 3. Nilai f⁻¹(5) adalah …",
    opsi: ["1", "2", "3", "4", "5"],
    jawaban: 3,
    pembahasan: "f(x) = 5 ⟹ 2x − 3 = 5 ⟹ x = 4.",
  },

  // ── INVERS KOMPOSISI ───────────────────────────────────────────────────────────
  {
    id: 33,
    bab: "Invers Fungsi",
    topik: "Invers Komposisi",
    level: "C3",
    soal: "Diketahui f(x) = 2x + 1 dan g(x) = x − 3. Fungsi invers dari (f∘g)(x) adalah …",
    opsi: ["(x+5)/2", "(x−5)/2", "2x + 5", "2x − 5", "(x+3)/2"],
    jawaban: 0,
    pembahasan:
      "(f∘g)(x) = 2(x−3)+1 = 2x−5. Inversnya: y = 2x−5 ⟹ x = (y+5)/2. Jadi (f∘g)⁻¹(x) = (x+5)/2.",
  },
  {
    id: 34,
    bab: "Invers Fungsi",
    topik: "Invers Komposisi",
    level: "C3",
    soal: "Diketahui f(x) = x + 2 dan g(x) = 3x. Fungsi invers dari (g∘f)(x) adalah …",
    opsi: ["(x+6)/3", "(x−6)/3", "3x − 6", "3x + 6", "(x−2)/3"],
    jawaban: 1,
    pembahasan:
      "(g∘f)(x) = 3(x+2) = 3x+6. Inversnya: y = 3x+6 ⟹ x = (y−6)/3. Jadi (g∘f)⁻¹(x) = (x−6)/3.",
  },
  {
    id: 35,
    bab: "Invers Fungsi",
    topik: "Invers Komposisi",
    level: "C3",
    soal: "Diketahui f(x) = 4x − 1 dan g(x) = x + 2. Nilai [(f∘g)⁻¹](5) adalah …",
    opsi: ["−1", "−1/2", "0", "1/2", "1"],
    jawaban: 1,
    pembahasan:
      "(f∘g)(x) = 4(x+2)−1 = 4x+7. (f∘g)⁻¹(x) = (x−7)/4. Untuk x=5: (5−7)/4 = −1/2.",
  },

  // ── BUNGA MAJEMUK – TABUNGAN AKHIR ───────────────────────────────────────────
  {
    id: 36,
    bab: "Bunga Majemuk",
    topik: "Tabungan Akhir",
    level: "C3",
    soal: "Andi menabung Rp 10.000.000 dengan bunga majemuk 5% per tahun. Tabungan Andi setelah 2 tahun adalah … (gunakan (1,05)² = 1,1025)",
    opsi: [
      "Rp 11.000.000",
      "Rp 11.025.000",
      "Rp 11.050.000",
      "Rp 11.200.000",
      "Rp 11.500.000",
    ],
    jawaban: 1,
    pembahasan: "M₂ = 10.000.000 × (1,05)² = 10.000.000 × 1,1025 = Rp 11.025.000.",
  },
  {
    id: 37,
    bab: "Bunga Majemuk",
    topik: "Tabungan Akhir",
    level: "C3",
    soal: "Seseorang menginvestasikan Rp 5.000.000 dengan bunga majemuk 10% per tahun. Nilai investasi setelah 3 tahun adalah … (gunakan (1,1)³ = 1,331)",
    opsi: [
      "Rp 6.500.000",
      "Rp 6.550.000",
      "Rp 6.655.000",
      "Rp 6.700.000",
      "Rp 6.750.000",
    ],
    jawaban: 2,
    pembahasan: "M₃ = 5.000.000 × (1,1)³ = 5.000.000 × 1,331 = Rp 6.655.000.",
  },
  {
    id: 38,
    bab: "Bunga Majemuk",
    topik: "Tabungan Akhir",
    level: "C3",
    soal: "Budi menabung Rp 2.000.000 dengan bunga majemuk 6% per tahun. Tabungan setelah 1 tahun adalah …",
    opsi: [
      "Rp 2.060.000",
      "Rp 2.100.000",
      "Rp 2.120.000",
      "Rp 2.160.000",
      "Rp 2.200.000",
    ],
    jawaban: 2,
    pembahasan: "M₁ = 2.000.000 × 1,06 = Rp 2.120.000.",
  },
  {
    id: 39,
    bab: "Bunga Majemuk",
    topik: "Tabungan Akhir",
    level: "C3",
    soal: "Modal awal Rp 8.000.000 ditabung dengan bunga majemuk 5% per tahun. Besar modal setelah 2 tahun adalah … (gunakan (1,05)² = 1,1025)",
    opsi: [
      "Rp 8.400.000",
      "Rp 8.640.000",
      "Rp 8.800.000",
      "Rp 8.820.000",
      "Rp 9.000.000",
    ],
    jawaban: 3,
    pembahasan: "M₂ = 8.000.000 × 1,1025 = Rp 8.820.000.",
  },

  // ── BUNGA YANG DIPEROLEH ──────────────────────────────────────────────────────
  {
    id: 40,
    bab: "Bunga Majemuk",
    topik: "Besar Bunga",
    level: "C3",
    soal: "Rp 6.000.000 ditabung dengan bunga majemuk 4% per tahun. Besar bunga setelah 2 tahun adalah … (gunakan (1,04)² = 1,0816)",
    opsi: [
      "Rp 240.000",
      "Rp 480.000",
      "Rp 489.600",
      "Rp 500.000",
      "Rp 520.000",
    ],
    jawaban: 2,
    pembahasan:
      "M₂ = 6.000.000 × 1,0816 = 6.489.600. Bunga = 6.489.600 − 6.000.000 = Rp 489.600.",
  },
  {
    id: 41,
    bab: "Bunga Majemuk",
    topik: "Besar Bunga",
    level: "C3",
    soal: "Modal Rp 4.000.000 ditabung dengan bunga majemuk 5% per tahun. Besar bunga setelah 3 tahun adalah … (gunakan (1,05)³ = 1,157625)",
    opsi: [
      "Rp 600.000",
      "Rp 610.500",
      "Rp 620.500",
      "Rp 630.500",
      "Rp 640.500",
    ],
    jawaban: 3,
    pembahasan:
      "M₃ = 4.000.000 × 1,157625 = 4.630.500. Bunga = 4.630.500 − 4.000.000 = Rp 630.500.",
  },

  // ── CIRI BUNGA MAJEMUK ────────────────────────────────────────────────────────
  {
    id: 42,
    bab: "Bunga Majemuk",
    topik: "Ciri-ciri Bunga Majemuk",
    level: "C3",
    soal: "Perhatikan pernyataan berikut.\n(1) Bunga dihitung hanya dari modal awal saja.\n(2) Bunga periode sebelumnya ditambahkan ke modal untuk periode berikutnya.\n(3) Besar bunga setiap periode selalu sama.\n(4) Modal bertambah secara eksponensial seiring waktu.\nPernyataan yang BENAR tentang bunga majemuk adalah …",
    opsi: ["(1) dan (3)", "(2) dan (3)", "(1) dan (4)", "(2) dan (4)", "(1), (2), dan (3)"],
    jawaban: 3,
    pembahasan:
      "Ciri bunga majemuk: (2) bunga dihitung dari modal yang terus bertambah, dan (4) pertumbuhannya bersifat eksponensial (Mn = M₀(1+i)ⁿ).",
  },

  // ── MENENTUKAN PERSENTASE BUNGA ───────────────────────────────────────────────
  {
    id: 43,
    bab: "Bunga Majemuk",
    topik: "Menentukan Suku Bunga",
    level: "C4",
    soal: "Modal awal Rp 10.000.000 setelah 2 tahun (bunga majemuk) menjadi Rp 12.100.000. Besar suku bunga per tahun adalah …",
    opsi: ["5%", "8%", "10%", "12%", "15%"],
    jawaban: 2,
    pembahasan:
      "(1+i)² = 12.100.000 / 10.000.000 = 1,21 ⟹ 1+i = 1,1 ⟹ i = 10%.",
  },
  {
    id: 44,
    bab: "Bunga Majemuk",
    topik: "Menentukan Suku Bunga",
    level: "C4",
    soal: "Tabungan awal Rp 5.000.000 berkembang menjadi Rp 5.512.500 setelah 2 tahun (bunga majemuk). Besar suku bunga per tahun adalah …",
    opsi: ["3%", "4%", "5%", "6%", "7%"],
    jawaban: 2,
    pembahasan:
      "(1+i)² = 5.512.500 / 5.000.000 = 1,1025 ⟹ 1+i = 1,05 ⟹ i = 5%.",
  },

  // ── ANUITAS – MENENTUKAN ANUITAS ──────────────────────────────────────────────
  {
    id: 45,
    bab: "Anuitas",
    topik: "Menentukan Besar Anuitas",
    level: "C3",
    soal: "Diketahui bunga pada periode ke-3 sebesar Rp 50.000 dan angsuran pokok pada periode ke-3 sebesar Rp 200.000. Besar anuitas adalah …",
    opsi: [
      "Rp 150.000",
      "Rp 200.000",
      "Rp 250.000",
      "Rp 300.000",
      "Rp 350.000",
    ],
    jawaban: 2,
    pembahasan: "Anuitas = angsuran pokok + bunga = 200.000 + 50.000 = Rp 250.000.",
  },
  {
    id: 46,
    bab: "Anuitas",
    topik: "Menentukan Besar Anuitas",
    level: "C3",
    soal: "Pinjaman Rp 2.000.000 dengan bunga 2% per bulan. Bunga bulan pertama Rp 40.000 dan angsuran pokok bulan pertama Rp 160.000. Besar anuitas per bulan adalah …",
    opsi: [
      "Rp 160.000",
      "Rp 180.000",
      "Rp 200.000",
      "Rp 220.000",
      "Rp 240.000",
    ],
    jawaban: 2,
    pembahasan: "Anuitas = 160.000 + 40.000 = Rp 200.000.",
  },

  // ── ANUITAS – ANGSURAN POKOK ─────────────────────────────────────────────────
  {
    id: 47,
    bab: "Anuitas",
    topik: "Angsuran Pokok",
    level: "C3",
    soal: "Pinjaman Rp 1.000.000 dilunasi dengan anuitas Rp 300.000 per tahun, bunga 10% per tahun. Angsuran pokok pada periode pertama adalah …",
    opsi: [
      "Rp 100.000",
      "Rp 150.000",
      "Rp 200.000",
      "Rp 250.000",
      "Rp 300.000",
    ],
    jawaban: 2,
    pembahasan:
      "Bunga periode 1 = 1.000.000 × 10% = 100.000. Angsuran pokok = 300.000 − 100.000 = Rp 200.000.",
  },
  {
    id: 48,
    bab: "Anuitas",
    topik: "Angsuran Pokok",
    level: "C3",
    soal: "Pinjaman Rp 5.000.000 dilunasi dengan anuitas Rp 1.500.000 per tahun, bunga 5% per tahun. Angsuran pokok pada periode pertama adalah …",
    opsi: [
      "Rp 500.000",
      "Rp 750.000",
      "Rp 1.000.000",
      "Rp 1.250.000",
      "Rp 1.500.000",
    ],
    jawaban: 3,
    pembahasan:
      "Bunga periode 1 = 5.000.000 × 5% = 250.000. Angsuran pokok = 1.500.000 − 250.000 = Rp 1.250.000.",
  },

  // ── CIRI-CIRI ANUITAS ────────────────────────────────────────────────────────
  {
    id: 49,
    bab: "Anuitas",
    topik: "Ciri-ciri Anuitas",
    level: "C3",
    soal: "Perhatikan pernyataan berikut tentang anuitas.\n(1) Besar setiap angsuran sama untuk setiap periode.\n(2) Angsuran pokok setiap periode semakin besar.\n(3) Bunga yang dibayar setiap periode semakin besar.\n(4) Total anuitas berubah setiap periode.\nPernyataan yang BENAR adalah …",
    opsi: ["(1) dan (2)", "(1) dan (3)", "(2) dan (4)", "(1) dan (4)", "(3) dan (4)"],
    jawaban: 0,
    pembahasan:
      "Anuitas bersifat tetap (1), sedangkan angsuran pokok terus bertambah karena sisa pinjaman berkurang sehingga bunga mengecil (2). Pernyataan (3) dan (4) salah.",
  },
  {
    id: 50,
    bab: "Anuitas",
    topik: "Ciri-ciri Anuitas",
    level: "C3",
    soal: "Pernyataan berikut tentang anuitas:\n(i) Sisa pinjaman semakin berkurang setiap periode.\n(ii) Besar bunga setiap periode semakin kecil karena dihitung dari sisa pinjaman.\n(iii) Angsuran pokok setiap periode semakin besar.\n(iv) Besar anuitas berubah setiap bulan mengikuti suku bunga.\nPernyataan yang BENAR adalah …",
    opsi: [
      "(i), (ii), dan (iii)",
      "(ii) dan (iv)",
      "(i) dan (iv)",
      "(ii) dan (iii) saja",
      "(i) dan (ii) saja",
    ],
    jawaban: 0,
    pembahasan:
      "(i), (ii), dan (iii) benar. Anuitas tetap konstan (iv salah), sisa pinjaman terus berkurang, bunga mengecil, dan angsuran pokok membesar.",
  },
];

const LABEL = ["A", "B", "C", "D", "E"];

const babColor = {
  "Fungsi":          { bg: "#e8f5e9", accent: "#2e7d32", badge: "#81c784" },
  "Komposisi Fungsi":{ bg: "#e3f2fd", accent: "#1565c0", badge: "#64b5f6" },
  "Invers Fungsi":   { bg: "#f3e5f5", accent: "#6a1b9a", badge: "#ce93d8" },
  "Bunga Majemuk":   { bg: "#fff8e1", accent: "#e65100", badge: "#ffb74d" },
  "Anuitas":         { bg: "#fce4ec", accent: "#880e4f", badge: "#f48fb1" },
};

function SoalCard({ soal }) {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState(null);
  const { bg, accent, badge } = babColor[soal.bab] || babColor["Fungsi"];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      border: `1.5px solid ${bg}`,
      marginBottom: 20,
    }}>
      {/* header */}
      <div style={{ background: bg, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{
          background: accent, color: "#fff", borderRadius: 20,
          padding: "2px 12px", fontWeight: 700, fontSize: 13,
        }}>
          No. {soal.id}
        </span>
        <span style={{ background: badge, color: accent, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>
          {soal.bab}
        </span>
        <span style={{ color: accent, fontSize: 12, fontStyle: "italic" }}>{soal.topik}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, background: "#fff", color: accent, borderRadius: 12, padding: "2px 8px", fontWeight: 700 }}>
          {soal.level}
        </span>
      </div>

      {/* pertanyaan */}
      <div style={{ padding: "16px 20px 8px", fontSize: 14.5, lineHeight: 1.65, color: "#1a1a2e", whiteSpace: "pre-line" }}>
        {soal.soal}
      </div>

      {/* opsi */}
      <div style={{ padding: "4px 20px 12px" }}>
        {soal.opsi.map((opt, i) => {
          const isCorrect = i === soal.jawaban;
          const isSelected = selected === i;
          let bg2 = "#f7f8fa", border2 = "#e0e0e0", color2 = "#333";
          if (revealed) {
            if (isCorrect) { bg2 = "#e8f5e9"; border2 = "#2e7d32"; color2 = "#1b5e20"; }
            else if (isSelected) { bg2 = "#ffebee"; border2 = "#c62828"; color2 = "#b71c1c"; }
          } else if (isSelected) {
            bg2 = "#e8eaf6"; border2 = accent; color2 = accent;
          }
          return (
            <div key={i}
              onClick={() => { setSelected(i); }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: bg2, border: `1.5px solid ${border2}`,
                borderRadius: 10, padding: "8px 14px", marginBottom: 6,
                cursor: "pointer", transition: "all 0.15s", color: color2,
              }}
            >
              <span style={{ fontWeight: 700, minWidth: 18, fontSize: 13 }}>{LABEL[i]}.</span>
              <span style={{ fontSize: 13.5 }}>{opt}</span>
              {revealed && isCorrect && <span style={{ marginLeft: "auto", fontSize: 18 }}>✓</span>}
              {revealed && isSelected && !isCorrect && <span style={{ marginLeft: "auto", fontSize: 18 }}>✗</span>}
            </div>
          );
        })}
      </div>

      {/* tombol & pembahasan */}
      <div style={{ padding: "0 20px 16px" }}>
        <button
          onClick={() => setRevealed(!revealed)}
          style={{
            background: revealed ? "#546e7a" : accent,
            color: "#fff", border: "none", borderRadius: 8,
            padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >
          {revealed ? "Sembunyikan Jawaban" : "Lihat Jawaban"}
        </button>
        {revealed && (
          <div style={{
            marginTop: 10, background: "#f9fbe7", border: "1px solid #c5e1a5",
            borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#33691e", lineHeight: 1.6,
          }}>
            <strong>Jawaban: {LABEL[soal.jawaban]}</strong><br />
            <em>{soal.pembahasan}</em>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const babs = [...new Set(soalData.map(s => s.bab))];
  const [activeBab, setActiveBab] = useState("Semua");

  const filtered = activeBab === "Semua" ? soalData : soalData.filter(s => s.bab === activeBab);

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#f4f6f9", minHeight: "100vh" }}>
      {/* hero */}
      <div style={{
        background: "linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%)",
        padding: "36px 24px 28px", textAlign: "center", color: "#fff",
      }}>
        <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", opacity: 0.7, marginBottom: 8 }}>
          Soal Latihan Matematika
        </div>
        <h1 style={{ margin: 0, fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 700, letterSpacing: -0.5 }}>
          Fungsi, Bunga Majemuk & Anuitas
        </h1>
        <p style={{ margin: "10px 0 0", opacity: 0.8, fontSize: 14 }}>
          50 soal pilihan ganda · Kelas XI / XII · Klik opsi lalu "Lihat Jawaban"
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
          {["Semua", ...babs].map(b => (
            <button key={b} onClick={() => setActiveBab(b)}
              style={{
                background: activeBab === b ? "#fff" : "rgba(255,255,255,0.15)",
                color: activeBab === b ? "#1a237e" : "#fff",
                border: "none", borderRadius: 20, padding: "6px 16px",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              {b} {b === "Semua" ? `(${soalData.length})` : `(${soalData.filter(s=>s.bab===b).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* konten */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 16px 60px" }}>
        {babs
          .filter(b => activeBab === "Semua" || activeBab === b)
          .map(bab => {
            const soals = filtered.filter(s => s.bab === bab);
            if (!soals.length) return null;
            const { accent } = babColor[bab] || babColor["Fungsi"];
            return (
              <div key={bab} style={{ marginBottom: 10 }}>
                <div style={{
                  borderLeft: `5px solid ${accent}`, paddingLeft: 14,
                  marginBottom: 18, marginTop: 10,
                }}>
                  <h2 style={{ margin: 0, fontSize: 20, color: accent }}>{bab}</h2>
                  <span style={{ fontSize: 12, color: "#888" }}>{soals.length} soal</span>
                </div>
                {soals.map(s => <SoalCard key={s.id} soal={s} />)}
              </div>
            );
          })}
      </div>

      <div style={{ textAlign: "center", padding: "16px 0 32px", color: "#90a4ae", fontSize: 12 }}>
        50 soal · C3 & C4 · Pilihan Ganda
      </div>
    </div>
  );
}
