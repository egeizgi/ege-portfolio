const API_URL = '/api/analyze'; // aynı domain altında Vercel serverless function

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('cv-file');
const fileOk = document.getElementById('file-ok');
const analyzeBtn = document.getElementById('analyze-btn');
const errorBox = document.getElementById('error-box');
const formCard = document.getElementById('form-card');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const jobPostingEl = document.getElementById('job-posting');
const accessCodeEl = document.getElementById('access-code');

let extractedCvText = '';
let pdfjsLibRef = null;
let pdfWorkerReady = false;

// pdf.js artık kendi sunucumuzdaki vendor/ klasöründen yükleniyor.
// Dış CDN'e (cdnjs, jsdelivr vb.) bağımlı değil — bu bazı ağlarda/eklentilerde
// (ör. reklam engelleyiciler, ORB engellemesi) sorun çıkarıyordu.
async function ensurePdfWorker() {
  if (pdfWorkerReady && pdfjsLibRef) return true;
  try {
    pdfjsLibRef = await import('./vendor/pdf.min.mjs');
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
  analyzeBtn.disabled = true;

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
    analyzeBtn.disabled = false;
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

analyzeBtn.addEventListener('click', async () => {
  showError(null);
  if (!extractedCvText || extractedCvText.trim().length < 50) {
    showError('Önce geçerli bir CV yükle.');
    return;
  }

  formCard.style.display = 'none';
  loading.style.display = 'block';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cvText: extractedCvText,
        jobPosting: jobPostingEl.value,
        accessCode: accessCodeEl.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      loading.style.display = 'none';
      formCard.style.display = 'block';
      showError(data.error || 'Bir hata oluştu, lütfen tekrar dene.');
      return;
    }

    renderResults(data);
    loading.style.display = 'none';
    results.style.display = 'block';
    results.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    console.error(err);
    loading.style.display = 'none';
    formCard.style.display = 'block';
    showError('Sunucuya ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.');
  }
});

function renderResults(data) {
  const score = data.ats_skoru ?? 0;
  document.getElementById('score-num').textContent = score;
  const gauge = document.getElementById('score-gauge');
  const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)';
  gauge.style.borderColor = color;
  document.getElementById('score-num').style.color = color;

  document.getElementById('genel-degerlendirme').textContent = data.genel_degerlendirme || '';

  fillList('guclu-yonler', data.guclu_yonler);
  fillList('eksik-yonler', data.eksik_yonler);
  fillList('ats-sorunlari', data.ats_sorunlari);
  fillList('oneriler', data.iyilestirme_onerileri);

  const matchBox = document.getElementById('match-box');
  if (data.ilan_uyum_analizi) {
    document.getElementById('ilan-uyum').textContent = data.ilan_uyum_analizi;
    matchBox.style.display = 'block';
  } else {
    matchBox.style.display = 'none';
  }
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
  results.style.display = 'none';
  formCard.style.display = 'block';
  fileInput.value = '';
  fileOk.textContent = '';
  jobPostingEl.value = '';
  extractedCvText = '';
  analyzeBtn.disabled = true;
  window.scrollTo({ top: formCard.offsetTop - 40, behavior: 'smooth' });
});

function showError(msg) {
  if (!msg) { errorBox.style.display = 'none'; return; }
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
}
