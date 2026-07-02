// /api/quiz.js
// Vercel Serverless Function — Ders notundan AI ile pratik sınav soruları ve flashcard üretir.
// /api/analyze (CV Analiz) ile aynı GEMINI_API_KEY ve maliyet güvenlik prensiplerini kullanır.
//
// MALİYET GÜVENLİĞİ: GEMINI_API_KEY'in bağlı olduğu Google Cloud / AI Studio projesinde
// billing KAPALI olduğu sürece ücret kesilmez, ücretsiz kota dolunca sadece 429 döner.
// Aşağıdaki günlük limit ekstra bir tampon katmanıdır.

const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const ALLOWED_QUESTION_COUNTS = [5, 8, 12];
const FLASHCARD_COUNT = 5;

export const config = {
  maxDuration: 30,
};

const MAX_DAILY_REQUESTS = parseInt(process.env.MAX_DAILY_REQUESTS_QUIZ || '200', 10);

const usageState = globalThis.__sinavUsage || (globalThis.__sinavUsage = {
  day: null,
  totalCount: 0,
});

function getUtcDayKey() {
  return new Date().toISOString().slice(0, 10);
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

  resetIfNewDay();
  if (usageState.totalCount >= MAX_DAILY_REQUESTS) {
    return res.status(429).json({ error: 'Günlük soru üretme limitine ulaşıldı. Lütfen yarın tekrar deneyin.' });
  }

  const { notesText } = req.body || {};
  let { questionCount } = req.body || {};
  questionCount = ALLOWED_QUESTION_COUNTS.includes(Number(questionCount)) ? Number(questionCount) : 8;

  if (!notesText || notesText.trim().length < 50) {
    return res.status(400).json({ error: 'Ders notu metni çok kısa veya okunamadı. Lütfen tekrar deneyin.' });
  }
  if (notesText.length > 25000) {
    return res.status(400).json({ error: 'Ders notu çok uzun. Lütfen daha kısa bir bölüm yükleyin.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY tanımlı değil.');
    return res.status(500).json({ error: 'Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.' });
  }

  const mcCount = Math.ceil(questionCount * 0.6);
  const openCount = questionCount - mcCount;

  const systemPrompt = `Sen üniversite öğrencileri için sınav hazırlık materyali oluşturan deneyimli bir eğitmensin. Sana verilen ders notu/metne dayanarak pratik sınav soruları ve flashcard'lar üretiyorsun.

Kurallar:
- SADECE verilen metindeki bilgiye dayan. Metinde geçmeyen bilgi uydurma.
- Toplam ${questionCount} soru üret: ${mcCount} tanesi çoktan seçmeli (4 seçenekli, tek doğru cevap), ${openCount} tanesi açık uçlu.
- Ayrıca metindeki ${FLASHCARD_COUNT} önemli terim/kavram için flashcard (terim + kısa tanım) üret.
- Sorular metnin farklı bölümlerini/kavramlarını kapsasın, birbirini tekrar etmesin.
- Çoktan seçmeli sorularda yanlış seçenekler makul ama açıkça yanlış olsun (çeldirici kalitesi önemli).
- Her soru için kısa bir "aciklama" yaz: doğru cevabın neden doğru olduğunu 1 cümlede açıkla.

Yanıtını SADECE aşağıdaki JSON formatında ver, başka hiçbir metin ekleme:

{
  "konu_ozeti": "<notların içeriğini 1-2 cümlede özetle>",
  "sorular": [
    {
      "tip": "coktan_secmeli",
      "soru": "<soru metni>",
      "secenekler": ["<A>", "<B>", "<C>", "<D>"],
      "dogru_cevap_index": <0-3 arası tam sayı>,
      "aciklama": "<kısa açıklama>"
    },
    {
      "tip": "acik_uclu",
      "soru": "<soru metni>",
      "ornek_cevap": "<ideal/örnek cevap>",
      "aciklama": "<kısa açıklama>"
    }
  ],
  "flashcardlar": [
    { "terim": "<terim>", "tanim": "<kısa tanım>" }
  ]
}

"sorular" dizisinde toplam ${questionCount} öğe, "flashcardlar" dizisinde ${FLASHCARD_COUNT} öğe olsun.`;

  const userMessage = `DERS NOTU:\n"""\n${notesText}\n"""\n\nYukarıdaki kurallara göre soruları ve flashcard'ları üret.`;

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
          temperature: 0.5,
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
      return res.status(502).json({ error: 'Sorular işlenemedi. Lütfen tekrar deneyin.' });
    }

    usageState.totalCount += 1;

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Sunucu hatası:', err);
    return res.status(500).json({ error: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' });
  }
}
