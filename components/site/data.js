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
    "Başkent Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Büyük bir merak ve istekle alanımda kendimi geliştirmeye çalışıyorum. C ile düşük seviye araçlar, Python ile veri/ML projeleri ve Gemini API ile yapay zeka destekli web araçları geliştiriyorum.",
  about:
    "Teknoloji ve yazılım dünyasındaki yenilikleri takip etmeyi seviyorum. Kod dışında basketbol oynuyor ve muay thai yapıyorum.",
};

export const NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/projeler", label: "Projeler" },
  { href: "/ozgecmis", label: "Özgeçmiş" },
  { href: "/iletisim", label: "İletişim" },
];

export const PROJECTS = [
  {
    slug: "cv-analiz",
    title: "CV Analiz",
    tagline: "Yapay zeka destekli CV ve iş ilanı uyum analizi",
    href: "/projeler/cv-analiz",
    icon: "description",
    category: "ai",
    status: "live",
    description:
      "Yüklenen CV'yi ve hedeflenen iş ilanını Gemini AI ile analiz edip güçlü/zayıf yönler, eksikler ve somut iyileştirme önerileri sunan araç.",
    tags: ["Next.js", "Gemini API", "PDF Parsing"],
    highlights: ["CV + iş ilanı karşılaştırması", "Güçlü / zayıf yön raporu", "Somut iyileştirme önerileri"],
  },
  {
    slug: "mulakat-simulatoru",
    title: "Mülakat Simülatörü",
    tagline: "CV'ne ve pozisyona özel yapay zeka mülakatı",
    href: "/projeler/mulakat-simulatoru",
    icon: "record_voice_over",
    category: "ai",
    status: "live",
    description:
      "CV'ni ve hedeflediğin pozisyonu esas alıp yapay zekanın gerçekçi mülakat soruları sorduğu, her cevaba anında geri bildirim verdiği ve sonunda genel bir performans raporu sunduğu araç.",
    tags: ["Next.js", "Gemini API", "Multi-turn AI"],
    highlights: ["Pozisyona özel sorular", "Cevap başına anlık geri bildirim", "Genel performans raporu"],
  },
  {
    slug: "sinav-hazirlik",
    title: "Sınav Hazırlık",
    tagline: "Ders notundan soru ve flashcard üretimi",
    href: "/projeler/sinav-hazirlik",
    icon: "school",
    category: "ai",
    status: "live",
    description:
      "Yüklenen ders notundan yapay zekanın konuya özel çoktan seçmeli ve açık uçlu pratik sorular ile flashcard'lar ürettiği çalışma aracı.",
    tags: ["Next.js", "Gemini API", "PDF Parsing"],
    highlights: ["Çoktan seçmeli ve açık uçlu sorular", "Otomatik flashcard'lar", "Konuya özel içerik"],
  },
  {
    slug: "prguard-ai",
    title: "PRGuard AI",
    tagline: "Küçük ekipler için AI code review",
    href: "/projects/prguard-ai",
    icon: "shield",
    category: "dev",
    status: "wip",
    description:
      "Küçük ekipler için pull request'leri merge öncesi inceleyen; hataları, güvenlik risklerini ve eksik testleri yakalamaya odaklanan AI code review aracı.",
    tags: ["GitHub App", "LLM", "Code Review"],
    highlights: ["PR diff analizi", "Bug ve güvenlik riski işaretleme", "Eksik test önerileri"],
  },
];

export const STATUS_LABEL = {
  live: "Canlı",
  wip: "Geliştiriliyor",
};

export const FOCUS_AREAS = [
  {
    icon: "neurology",
    title: "Yapay Zeka & LLM",
    text: "Gemini API ile çok adımlı sohbet, belge analizi ve içerik üretimi yapan, gerçek bir problemi çözen araçlar.",
    tags: ["#Gemini", "#Prompting"],
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
  {
    icon: "web",
    title: "Web Geliştirme",
    text: "Next.js ve Tailwind CSS ile hızlı, sade ve herkesin kullanabileceği web arayüzleri ve API uçları.",
    tags: ["#Next.js", "#Tailwind"],
  },
];

export const SKILLS = [
  { group: "Programlama Dilleri", items: ["C", "Python", "JavaScript"], strong: ["C", "Python"] },
  { group: "Web & Arayüz", items: ["Next.js", "React", "Tailwind CSS", "HTML / CSS"], strong: ["Next.js"] },
  { group: "Yapay Zeka", items: ["Gemini API", "Prompt Tasarımı", "PDF Parsing", "Multi-turn AI"], strong: ["Gemini API"] },
  { group: "Araçlar", items: ["Git", "GitHub", "Vercel"], strong: [] },
];

export const INTERESTS = ["Yapay Zeka", "Makine Öğrenmesi", "Veri Bilimi"];
export const HOBBIES = ["Basketbol", "Muay Thai", "Teknoloji takibi"];
