// /api/interview.js
// Vercel Serverless Function — AI destekli mülakat simülasyonu.
// /api/analyze (CV Analiz) ile aynı GEMINI_API_KEY ve maliyet güvenlik prensiplerini kullanır.
//
// STATELESS TASARIM: Sunucuda oturum/DB yok. Konuşma geçmişi (history) her istekte
// istemciden tam olarak gönderilir, sunucu her seferinde tüm transkripti Gemini'ye
// bağlam olarak verir ve bir sonraki soruyu/geri bildirimi üretir.
//
// MALİYET GÜVENLİĞİ: /api/analyze ile aynı prensip — GEMINI_API_KEY'in bağlı olduğu
// Google Cloud / AI Studio projesinde billing KAPALI olduğu sürece ücret kesilmez,
// kota dolunca sadece 429 döner. Ayrıca aşağıdaki günlük limit ekstra bir tampon.

const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const TOTAL_QUESTIONS = 5;

export const config = {
  maxDuration: 30,
};

const MAX_DAILY_REQUESTS = parseInt(process.env.MAX_DAILY_REQUESTS_INTERVIEW || '200', 10);

const usageState = globalThis.__mulakatUsage || (globalThis.__mulakatUsage = {
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
    return res.status(429).json({ error: 'Günlük mülakat limitine ulaşıldı. Lütfen yarın tekrar deneyin.' });
  }

  const { cvText, jobTarget, history, lastQuestion, currentAnswer } = req.body || {};

  if (!cvText || cvText.trim().length < 50) {
    return res.status(400).json({ error: 'CV metni çok kısa veya okunamadı. Lütfen tekrar deneyin.' });
  }
  if (cvText.length > 20000) {
    return res.status(400).json({ error: 'CV metni çok uzun. Lütfen daha kısa bir CV yükleyin.' });
  }

  const safeHistory = Array.isArray(history)
    ? history.filter(h => h && typeof h.question === 'string' && typeof h.answer === 'string').slice(0, TOTAL_QUESTIONS)
    : [];

  const isAnswering = typeof lastQuestion === 'string' && lastQuestion.trim().length > 0
    && typeof currentAnswer === 'string' && currentAnswer.trim().length > 0;

  if (isAnswering && currentAnswer.length > 6000) {
    return res.status(400).json({ error: 'Cevap çok uzun. Lütfen daha kısa yazın.' });
  }

  const completedCount = safeHistory.length + (isAnswering ? 1 : 0);
  const isFinalTurn = completedCount >= TOTAL_QUESTIONS;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY tanımlı değil.');
    return res.status(500).json({ error: 'Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.' });
  }

  const systemPrompt = `Sen deneyimli bir İK / teknik mülakat uzmanısın. Türkiye'deki üniversite öğrencileri ve yeni mezunlarla, hedeflediği pozisyona yönelik gerçekçi bir iş mülakatı simüle ediyorsun. Adayın CV'sini bağlam olarak kullan, sorularını CV'deki gerçek deneyime ve hedef pozisyona göre şekillendir.

Kurallar:
- Bir seferde sadece TEK soru sorarsın. Sorular davranışsal (STAR yöntemine uygun cevap gerektiren) ve role özgü teknik soruların karışımı olsun, sırayla zorlaşabilir.
- Hedef pozisyon anlamsız/gerçekçi olmayan bir şeyse (örn. "padişah", "astronot", rastgele kelime), bunu ilk soruda kısaca esprili bir dille belirt, sonra CV'deki içeriğe uygun gerçekçi bir alan için mülakat yapmaya devam et.
- Toplam mülakat ${TOTAL_QUESTIONS} sorudan oluşur. Bu istek, adayın ${completedCount}. sorusuna (varsa) verdiği cevaptan sonraki adımı istiyor.
- Adayın bir önceki soruya verdiği cevap varsa, ona SADECE 1-2 cümlelik kısa, yapıcı, somut bir geri bildirim ver (ne iyiydi, ne eksikti).
- ${isFinalTurn ? `Bu SON turdur (${TOTAL_QUESTIONS}/${TOTAL_QUESTIONS} tamamlandı). "next_question" alanını null bırak, "interview_done" true olsun ve "final_report" alanını doldur.` : `Mülakat devam ediyor. Son cevaba (varsa) kısa geri bildirim verdikten sonra "next_question" alanına sıradaki soruyu yaz, "interview_done" false olsun, "final_report" null olsun.`}

Yanıtını SADECE aşağıdaki JSON formatında ver, başka hiçbir metin ekleme:

{
  "feedback": "<son cevaba dair 1-2 cümlelik geri bildirim, ilk soru isteniyorsa null>",
  "next_question": "<sıradaki mülakat sorusu, mülakat bittiyse null>",
  "interview_done": <boolean>,
  "final_report": {
    "skor": <0-100 arası tam sayı, genel mülakat performansı>,
    "genel_degerlendirme": "<2-3 cümlelik özet>",
    "guclu_yonler": ["<madde>", "<madde>", "..."],
    "gelisim_alanlari": ["<madde>", "<madde>", "..."]
  }
}

"final_report" sadece "interview_done" true iken dolu olsun, aksi halde null olsun. guclu_yonler ve gelisim_alanlari listelerinde 3-5 madde olsun.`;

  let transcript = `ADAYIN CV METNİ:\n"""\n${cvText}\n"""\n\nHEDEF POZİSYON:\n"""\n${jobTarget && jobTarget.trim() ? jobTarget.trim() : '(belirtilmedi, CV\'ye göre uygun genel bir pozisyon varsay)'}\n"""\n\n`;

  if (safeHistory.length > 0) {
    transcript += 'MÜLAKATTA ŞU ANA KADAR SORULAN VE CEVAPLANAN SORULAR:\n';
    safeHistory.forEach((h, i) => {
      transcript += `Soru ${i + 1}: ${h.question}\nCevap ${i + 1}: ${h.answer}\n\n`;
    });
  }

  if (isAnswering) {
    transcript += `SON SORULAN SORU (Soru ${completedCount}): ${lastQuestion}\nADAYIN CEVABI: ${currentAnswer}\n\n`;
    transcript += isFinalTurn
      ? 'Bu son soruydu. Bu cevaba kısa geri bildirim ver ve mülakatı final_report ile bitir.'
      : `Bu cevaba kısa geri bildirim ver, ardından Soru ${completedCount + 1}'i sor.`;
  } else {
    transcript += `Mülakatı başlat: Soru 1'i sor (feedback null olsun).`;
  }

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          { role: 'user', parts: [{ text: transcript }] },
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 2048,
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
      return res.status(502).json({ error: 'Mülakat yanıtı işlenemedi. Lütfen tekrar deneyin.' });
    }

    usageState.totalCount += 1;

    return res.status(200).json({
      feedback: parsed.feedback ?? null,
      next_question: parsed.next_question ?? null,
      interview_done: Boolean(parsed.interview_done),
      final_report: parsed.final_report ?? null,
      progress: { current: completedCount, total: TOTAL_QUESTIONS },
    });
  } catch (err) {
    console.error('Sunucu hatası:', err);
    return res.status(500).json({ error: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.' });
  }
}
