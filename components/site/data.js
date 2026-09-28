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

export const FOCUS_AREAS = [
  {
    icon: "neurology",
    title: "Yapay Zeka",
    text: "Yapay zeka modellerinin nasıl çalıştığını öğrenmek ve onları gerçek problemlere nasıl uygulayabileceğimi keşfetmek.",
    tags: ["#AI", "#Python"],
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
  { group: "Araçlar", items: ["Git", "GitHub"], strong: [] },
];

export const INTERESTS = ["Yapay Zeka", "Makine Öğrenmesi", "Veri Bilimi"];
export const HOBBIES = ["Basketbol", "Muay Thai", "Teknoloji takibi"];
