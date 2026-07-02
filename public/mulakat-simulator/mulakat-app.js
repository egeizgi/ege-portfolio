const API_URL = '/api/interview';

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('cv-file');
const fileOk = document.getElementById('file-ok');
const startBtn = document.getElementById('start-btn');
const errorBox = document.getElementById('error-box');
const formCard = document.getElementById('form-card');
const thinking = document.getElementById('thinking');
const interviewRoom = document.getElementById('interview-room');
const finalReportEl = document.getElementById('final-report');
const jobTargetEl = document.getElementById('job-target');

const progressLabel = document.getElementById('progress-label');
const progressFill = document.getElementById('progress-fill');
const feedbackBox = document.getElementById('feedback-box');
const feedbackText = document.getElementById('feedback-text');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const answerBtn = document.getElementById('answer-btn');

let extractedCvText = '';
let pdfjsLibRef = null;
let pdfWorkerReady = false;

// Aynı pdf.js vendor dosyaları cv-analiz sayfasıyla paylaşılıyor (dış CDN'e bağımlı değil).
async function ensurePdfWorker() {
  if (pdfWorkerReady && pdfjsLibRef) return true;
  try {
    pdfjsLibRef = await import('/cv-analiz/vendor/pdf.min.mjs');
    pdfjsLibRef.GlobalWorkerOptions.workerSrc = '/cv-analiz/vendor/pdf.worker.min.mjs';
    pdfWorkerReady = true;
    return true;
  } catch (e) {
    console.error('pdf.js yüklenemedi:', e);
    return false;
  }
}

fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag');
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

async function handleFile(file) {
  if (!file) return;
  showError(null);
  fileOk.textContent = '';
  extractedCvText = '';
  startBtn.disabled = true;

  try {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      if (!(await ensurePdfWorker())) {
        showError('PDF okuyucu yüklenemedi. Sayfayı yenileyip tekrar dener misin? Sorun devam ederse .txt dosyası deneyebilirsin.');
        return;
      }
      extractedCvText = await extractPdfText(file);
    } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      extractedCvText = await file.text();
    } else {
      showError('Sadece PDF veya .txt dosyaları destekleniyor.');
      return;
    }

    if (extractedCvText.trim().length < 50) {
      showError('CV metni okunamadı ya da çok kısa. Dosyanın metin içerdiğinden emin ol (taranmış görsel PDF desteklenmiyor).');
      return;
    }

    fileOk.textContent = `✓ ${file.name} okundu (${extractedCvText.trim().length} karakter)`;
    startBtn.disabled = false;
  } catch (err) {
    console.error(err);
    showError('Dosya okunurken bir hata oluştu. Farklı bir dosya deneyebilir misin?');
  }
}

async function extractPdfText(file) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLibRef.getDocument({ data: buf }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(it => it.str).join(' ') + '\n';
  }
  return text;
}

// --- Mülakat durumu ---
let history = [];      // [{question, answer}, ...] tamamlanmış turlar
let lastQuestion = null;
let totalQuestions = 5;

async function callInterviewApi(currentAnswer) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cvText: extractedCvText,
      jobTarget: jobTargetEl.value,
      history,
      lastQuestion,
      currentAnswer: currentAnswer || null,
    }),
  });

  const rawBody = await res.text();
  let data;
  try {
    data = JSON.parse(rawBody);
  } catch (parseErr) {
    console.error('Sunucudan JSON olmayan yanıt:', res.status, rawBody.slice(0, 300));
    throw new Error(`Sunucu beklenmedik bir yanıt döndürdü (durum: ${res.status}). Muhtemelen zaman aşımı, lütfen tekrar dene.`);
  }

  if (!res.ok) {
    throw new Error(data.error || 'Bir hata oluştu, lütfen tekrar dene.');
  }
  return data;
}

startBtn.addEventListener('click', async () => {
  showError(null);
  if (!extractedCvText || extractedCvText.trim().length < 50) {
    showError('Önce geçerli bir CV yükle.');
    return;
  }

  history = [];
  lastQuestion = null;

  formCard.style.display = 'none';
  thinking.style.display = 'block';

  try {
    const data = await callInterviewApi(null);
    thinking.style.display = 'none';
    applyInterviewResponse(data);
  } catch (err) {
    console.error(err);
    thinking.style.display = 'none';
    formCard.style.display = 'block';
    showError(err.message || 'Sunucuya ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.');
  }
});

answerBtn.addEventListener('click', async () => {
  const answer = answerInput.value.trim();
  if (!answer) {
    showError('Göndermeden önce bir cevap yaz.');
    return;
  }
  showError(null);

  const questionJustAnswered = lastQuestion;
  interviewRoom.style.display = 'none';
  thinking.style.display = 'block';

  try {
    const data = await callInterviewApi(answer);
    // Bu turu geçmişe ekle
    history.push({ question: questionJustAnswered, answer });
    thinking.style.display = 'none';
    applyInterviewResponse(data);
  } catch (err) {
    console.error(err);
    thinking.style.display = 'none';
    interviewRoom.style.display = 'block';
    showError(err.message || 'Sunucuya ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.');
  }
});

function applyInterviewResponse(data) {
  totalQuestions = (data.progress && data.progress.total) || totalQuestions;

  if (data.interview_done && data.final_report) {
    renderFinalReport(data.final_report);
    return;
  }

  lastQuestion = data.next_question;
  answerInput.value = '';

  const current = (data.progress && data.progress.current) || history.length;
  const questionNumber = Math.min(current + 1, totalQuestions);
  progressLabel.textContent = `Soru ${questionNumber} / ${totalQuestions}`;
  progressFill.style.width = `${Math.round((current / totalQuestions) * 100)}%`;

  if (data.feedback) {
    feedbackText.textContent = data.feedback;
    feedbackBox.style.display = 'block';
  } else {
    feedbackBox.style.display = 'none';
  }

  questionText.textContent = data.next_question || '—';
  interviewRoom.style.display = 'block';
  interviewRoom.scrollIntoView({ behavior: 'smooth' });
}

function renderFinalReport(report) {
  const score = report.skor ?? 0;
  document.getElementById('score-num').textContent = score;
  const gauge = document.getElementById('score-gauge');
  const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)';
  gauge.style.borderColor = color;
  document.getElementById('score-num').style.color = color;

  document.getElementById('genel-degerlendirme').textContent = report.genel_degerlendirme || '';

  fillList('guclu-yonler', report.guclu_yonler);
  fillList('gelisim-alanlari', report.gelisim_alanlari);

  finalReportEl.style.display = 'block';
  finalReportEl.scrollIntoView({ behavior: 'smooth' });
}

function fillList(id, items) {
  const el = document.getElementById(id);
  el.innerHTML = '';
  (items || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    el.appendChild(li);
  });
}

document.getElementById('again-btn').addEventListener('click', () => {
  finalReportEl.style.display = 'none';
  formCard.style.display = 'block';
  fileInput.value = '';
  fileOk.textContent = '';
  jobTargetEl.value = '';
  extractedCvText = '';
  history = [];
  lastQuestion = null;
  startBtn.disabled = true;
  window.scrollTo({ top: formCard.offsetTop - 40, behavior: 'smooth' });
});

function showError(msg) {
  if (!msg) { errorBox.style.display = 'none'; return; }
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
}
