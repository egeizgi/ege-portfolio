// Sitenin tüm içeriği tek yerde. Sayfalar buradan okur.

export const PROFILE = {
  name: "Ege İzgi",
  initials: "Eİ",
  title: "Bilgisayar Mühendisliği Öğrencisi",
  school: "Başkent Üniversitesi",
  department: "Bilgisayar Mühendisliği",
  year: "3. sınıf",
  location: "Ankara, Türkiye",
  timezone: "Europe/Istanbul (GMT+3)",
  email: "egeizgi10@gmail.com",
  github: "https://github.com/egeizgi",
  githubHandle: "egeizgi",
  bio:
    "Başkent Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Büyük bir merak ve istekle alanımda kendimi geliştirmeye çalışıyorum. C ile düşük seviye araçlar, Python ile veri/ML projeleri geliştiriyorum.",
  about:
    "Teknoloji ve yazılım dünyasındaki yenilikleri takip etmeyi seviyorum. Kod dışında basketbol oynuyor ve muay thai yapıyorum.",
};

export const NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/ozgecmis", label: "Özgeçmiş" },
  { href: "/iletisim", label: "İletişim" },
];

export const EXPERIENCE = [
  {
    company: "HAVELSAN",
    role: "Stajyer – Yapay Zeka / Görüntü İşleme",
    period: "Tem 2026 — Ağu 2026",
    duration: "2 ay",
    location: "Ankara · Yerinde",
    bullets: [
      "Off-road resim ve video segmentasyonu yaptım.",
      "Farklı veri setleri üzerinde model (SAM, SegFormer) pipeline'ları kurdum ve değerlendirdim.",
    ],
    tags: ["Python", "PyTorch", "OpenCV", "Hugging Face Transformers", "Bilgisayarla Görme", "Deep Learning"],
  },
  {
    company: "Sisoft Healthcare Information Systems",
    role: "AI/ML Stajyeri",
    period: "Kas 2025 — Haz 2026",
    duration: "8 ay",
    location: "Ankara · Yerinde",
    bullets: [
      "Veri analizi ve keşifsel veri analizi süreçlerini yürüttüm.",
      "RAG sistemleri üzerine deneyler yaptım.",
      "FAISS ve ChromaDB ile semantik arama algoritmaları üzerinde çalıştım.",
    ],
    tags: ["Python", "NLP", "RAG", "FAISS", "ChromaDB"],
  },
];

export const FOCUS_AREAS = [
  {
    icon: "neurology",
    title: "Yapay Zeka",
    text: "Görüntü segmentasyonu (SAM, SegFormer) ve RAG tabanlı semantik arama gibi alanlarda stajlarda edindiğim deneyimi derinleştirmek.",
    tags: ["#ComputerVision", "#NLP"],
  },
  {
    icon: "monitoring",
    title: "Veri Bilimi & ML",
    text: "Python ile veri işleme, analiz ve makine öğrenmesi projeleri; modelleri anlamaya ve doğru değerlendirmeye odaklı.",
    tags: ["#Python", "#ML"],
  },
  {
    icon: "memory",
    title: "Düşük Seviye Programlama",
    text: "C ile bellek ve performansın önemli olduğu araçlar; bilgisayarın altında ne olduğunu anlamaya yönelik çalışmalar.",
    tags: ["#C", "#Systems"],
  },
];

export const SKILLS = [
  { group: "Programlama Dilleri", items: ["C", "Python", "JavaScript"], strong: ["C", "Python"] },
  { group: "Derin Öğrenme & Görüntü İşleme", items: ["PyTorch", "Hugging Face Transformers", "OpenCV", "SAM", "SegFormer"], strong: ["PyTorch"] },
  { group: "NLP & Semantik Arama", items: ["RAG", "FAISS", "ChromaDB"], strong: ["RAG"] },
  { group: "Araçlar", items: ["Git", "GitHub"], strong: [] },
];

export const INTERESTS = ["Yapay Zeka", "Makine Öğrenmesi", "Veri Bilimi"];
export const HOBBIES = ["Basketbol", "Muay Thai", "Teknoloji takibi"];
