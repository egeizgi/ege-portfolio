// /api/analyze.js
// Vercel Serverless Function — CV'yi Google Gemini API ile analiz eder.
// GEMINI_API_KEY ortam değişkeni Vercel proje ayarlarından girilmelidir.
// (Vercel Dashboard > Project > Settings > Environment Variables)
// Ücretsiz key için: https://aistudio.google.com/apikey
//
// MALİYET GÜVENLİĞİ (ÖNEMLİ):
// Bu key'in bağlı olduğu Google Cloud / AI Studio projesinde billing (kredi kartı)
// KAPALI olduğu sürece bu API'den asla ücret kesilmez — ücretsiz günlük/dakikalık
// kota dolunca sadece 429 hatası döner, otomatik ücretlendirme YAPILMAZ.
// Billing açılırsa bu koruma tamamen ortadan kalkar ve her istek ücretli hale gelir.
// Bu yüzden: (1) o projede billing'i asla açma, (2) aşağıdaki günlük limit ekstra
// bir güvenlik katmanı olarak, ücretsiz kotanın tek seferde tüketilmesini önler.

const GEMINI_MODEL = 'gemini-3.5-flash'; // Free tier: ~15 istek/dk, 1500 istek/gün (Temmuz 2026 itibarıyla)
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Vercel'in varsayılan fonksiyon süresi bazı planlarda 10sn olabiliyor; Gemini'nin
// tam JSON analiz üretmesi bazen bunu aşabiliyor ve bu da istemcide "sunucuya
// ulaşılamadı" gibi görünen bir zaman aşımına yol açıyor. Süreyi güvenli tarafta tutuyoruz.
export const config = {
  maxDuration: 30,
};

// Ücretsiz kotanın çok altında, isteğe göre Vercel env değişkeniyle ayarlanabilir günlük limit.
// Not: Serverless fonksiyon her "cold start"ta sıfırlanır; bu yüzden kesin değil, ekstra
// bir tampon katmandır — asıl garanti billing'in kapalı olmasıdır.
const MAX_DAILY_REQUESTS = parseInt(process.env.MAX_DAILY_REQUESTS || '200', 10);

// Modül seviyesinde (warm instance ömrü boyunca) basit sayaç.
const usageState = globalThis.__cvAnalizUsage || (globalThis.__cvAnalizUsage = {
  day: null,
  totalCount: 0,
});

function getUtcDayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function resetIfNewDay() {
  const today = getUtcDayKey();
  if (usageState.day !== today) {
    usageState.day = today;
    usageState.totalCount = 0;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST isteği kabul edilir.' });
  }

  const { cvText, jobPosting } = req.body || {};

  // --- Maliyet/kota güvenlik katmanı ---
  // Ücretsiz kotayı tüketmemek için basit bir günlük toplam istek limiti.
  resetIfNewDay();
  if (usageState.totalCount >= MAX_DAILY_REQUESTS) {
    return res.status(429).json({ error: 'Günlük analiz limitine ulaşıldı. Lütfen yarın tekrar deneyin.' });
  }

  if (!cvText || cvText.trim().length < 50) {
    return res.status(400).json({ error: 'CV metni çok kısa veya okunamadı. Lütfen tekrar deneyin.' });
  }

  if (cvText.length > 20000) {
    return res.status(400).json({ error: 'CV metni çok uzun. Lütfen daha kısa bir CV yükleyin.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY tanımlı değil.');
    return res.status(500).json({ error: 'Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.' });
  }

  const systemPrompt = `Sen 15 yıllık deneyime sahip bir İK uzmanı ve kariyer danışmanısın. Türkiye'deki üniversite öğrencileri ve yeni mezunların CV'lerini değerlendiriyorsun. Aday genelde teknik (mühendislik, bilgisayar bilimi vb.) alanlardan.

Kullanıcının CV metnini ve (varsa) hedeflediği iş ilanını analiz et. Dürüst, yapıcı ve somut ol — genel geçer laflar etme, CV'deki gerçek içeriğe atıfta bulun.

Yanıtını SADECE aşağıdaki JSON formatında ver. Başka hiçbir metin veya açıklama ekleme:

{
  "ats_skoru": <0-100 arası tam sayı, ATS (Applicant Tracking System) uyumluluğu>,
  "genel_degerlendirme": "<2-3 cümlelik özet değerlendirme>",
  "guclu_yonler": ["<madde>", "<madde>", "..."],
  "eksik_yonler": ["<madde>", "<madde>", "..."],
  "ats_sorunlari": ["<format, anahtar kelime veya yapı ile ilgili somut sorun>", "..."],
  "iyilestirme_onerileri": ["<uygulanabilir, somut öneri>", "..."],
  "ilan_uyum_analizi": <iş ilanı/meslek alanı verildiyse aşağıdaki kurala göre string, verilmediyse null>
}

"ilan_uyum_analizi" alanı için kurallar:
- Girilen "hedef iş ilanı/meslek" anlamlı ve gerçekçi bir rol veya iş ilanı ise (örn. "Backend Developer", "Finans Analisti", tam bir ilan metni vb.), CV'nin bu role uygunluğunu 2-3 cümlede ciddi ve somut şekilde değerlendir.
- Girilen metin anlamsız, saçma veya gerçekçi olmayan bir "meslek" ise (örn. "astronot", "padişah", "büyücü", rastgele kelime/karakterler, şaka amaçlı bir şey), bunu ciddi bir uyum analiziymiş gibi sunma. Bunun yerine 1-2 cümlede esprili ama kaba olmayan bir dille bunun gerçekçi bir hedef olmadığını belirt, sonra CV'deki içeriğe bakarak adaya gerçekçi ve uygun bir rol/alan öner.
- Alan tamamen boş bırakıldıysa bu alanı null yap.

Her listede 3-6 madde olsun. Maddeler kısa ve net cümleler olsun.`;

  const userMessage = jobPosting && jobPosting.trim().length > 1
    ? `CV METNİ:\n"""\n${cvText}\n"""\n\nHEDEF İŞ İLANI / MESLEK:\n"""\n${jobPosting}\n"""\n\nBu CV'yi hem genel olarak hem de bu hedefe göre analiz et. Hedefin gerçekçi bir iş ilanı/meslek mi yoksa saçma/anlamsız bir girdi mi olduğuna dikkat ederek "ilan_uyum_analizi" kurallarını uygula.`
    : `CV METNİ:\n"""\n${cvText}\n"""\n\nBu CV'yi genel olarak analiz et (spesifik bir iş ilanı verilmedi, ilan_uyum_analizi alanını null bırak).`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          { role: 'user', parts: [{ text: userMessage }] },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API hatası:', response.status, errText);
      if (response.status === 429) {
        return res.status(429).json({ error: 'Günlük ücretsiz kullanım limitine ulaşıldı. Lütfen birazdan tekrar deneyin.' });
      }
      return res.status(502).json({ error: 'AI servisi şu anda yanıt vermiyor. Lütfen birazdan tekrar deneyin.' });
    }

    const data = await response.json();
    const candidate = data.candidates && data.candidates[0];
    const raw = candidate?.content?.parts?.map(p => p.text).join('') || '{}';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('JSON parse hatası. Ham çıktı:', raw);
      return res.status(502).json({ error: 'Analiz sonucu işlenemedi. Lütfen tekrar deneyin.' });
    }

    // Sadece başarılı (gerçekten Gemini'ye giden) istekleri say.
    usageState.totalCount += 1;

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Sunucu hatası:', err);
    return res.status(500).json({ error: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' });
  }
}
