// /api/analyze.js
// Vercel Serverless Function — CV'yi Google Gemini API ile analiz eder.
// GEMINI_API_KEY ortam değişkeni Vercel proje ayarlarından girilmelidir.
// (Vercel Dashboard > Project > Settings > Environment Variables)
// Ücretsiz key için: https://aistudio.google.com/apikey

const GEMINI_MODEL = 'gemini-3.5-flash'; // Free tier: ~15 istek/dk, 1500 istek/gün (Temmuz 2026 itibarıyla)
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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

  const { cvText, jobPosting, accessCode } = req.body || {};

  // --- Basit erişim kontrolü (MVP) ---
  // Gerçek ödeme entegrasyonu (iyzico) eklenene kadar geçici kod sistemi.
  const validCodes = (process.env.ACCESS_CODES || '').split(',').map(c => c.trim()).filter(Boolean);
  const requireCode = validCodes.length > 0;
  if (requireCode && (!accessCode || !validCodes.includes(accessCode.trim()))) {
    return res.status(402).json({ error: 'Geçersiz veya eksik erişim kodu.' });
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
  "ilan_uyum_analizi": <iş ilanı verildiyse 2-3 cümlelik uyum değerlendirmesi (string), verilmediyse null>
}

Her listede 3-6 madde olsun. Maddeler kısa ve net cümleler olsun.`;

  const userMessage = jobPosting && jobPosting.trim().length > 20
    ? `CV METNİ:\n"""\n${cvText}\n"""\n\nHEDEF İŞ İLANI:\n"""\n${jobPosting}\n"""\n\nBu CV'yi hem genel olarak hem de bu ilana göre analiz et.`
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

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Sunucu hatası:', err);
    return res.status(500).json({ error: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' });
  }
}
