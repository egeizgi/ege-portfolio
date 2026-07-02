const API_URL = '/api/quiz';

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('notes-file');
const fileOk = document.getElementById('file-ok');
const generateBtn = document.getElementById('generate-btn');
const errorBox = document.getElementById('error-box');
const formCard = document.getElementById('form-card');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const countOptions = document.getElementById('count-options');

let extractedNotesText = '';
let selectedCount = 8;
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

countOptions.addEventListener('click', (e) => {
  const btn = e.target.closest('.count-btn');
  if (!btn) return;
  selectedCount = parseInt(btn.dataset.count, 10);
  countOptions.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});

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
  extractedNotesText = '';
  generateBtn.disabled = true;

  try {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      if (!(await ensurePdfWorker())) {
        showError('PDF okuyucu yüklenemedi. Sayfayı yenileyip tekrar dener misin? Sorun devam ederse .txt dosyası deneyebilirsin.');
        return;
      }
      extractedNotesText = await extractPdfText(file);
    } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      extractedNotesText = await file.text();
    } else {
      showError('Sadece PDF veya .txt dosyaları destekleniyor.');
      return;
    }

    if (extractedNotesText.trim().length < 50) {
      showError('Metin okunamadı ya da çok kısa. Dosyanın metin içerdiğinden emin ol (taranmış görsel PDF desteklenmiyor).');
      return;
    }

    fileOk.textContent = `✓ ${file.name} okundu (${extractedNotesText.trim().length} karakter)`;
    generateBtn.disabled = false;
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

generateBtn.addEventListener('click', async () => {
  showError(null);
  if (!extractedNotesText || extractedNotesText.trim().length < 50) {
    showError('Önce geçerli bir ders notu yükle.');
    return;
  }

  formCard.style.display = 'none';
  loading.style.display = 'block';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notesText: extractedNotesText,
        questionCount: selectedCount,
      }),
    });

    const rawBody = await res.text();
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (parseErr) {
      console.error('Sunucudan JSON olmayan yanıt:', res.status, rawBody.slice(0, 300));
      loading.style.display = 'none';
      formCard.style.display = 'block';
      showError(`Sunucu beklenmedik bir yanıt döndürdü (durum: ${res.status}). Muhtemelen zaman aşımı, lütfen tekrar dene.`);
      return;
    }

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
  document.getElementById('konu-ozeti').textContent = data.konu_ozeti || '';

  const list = document.getElementById('questions-list');
  list.innerHTML = '';
  (data.sorular || []).forEach((q, i) => {
    const item = document.createElement('div');
    item.className = 'q-item';

    const num = document.createElement('span');
    num.className = 'q-num';
    num.textContent = `Soru ${i + 1} — ${q.tip === 'coktan_secmeli' ? 'Çoktan Seçmeli' : 'Açık Uçlu'}`;
    item.appendChild(num);

    const qText = document.createElement('p');
    qText.className = 'q-text';
    qText.textContent = q.soru || '';
    item.appendChild(qText);

    const explain = document.createElement('div');
    explain.className = 'explain';
    explain.innerHTML = `<strong>Açıklama:</strong> ${escapeHtml(q.aciklama || '')}`;

    if (q.tip === 'coktan_secmeli' && Array.isArray(q.secenekler)) {
      q.secenekler.forEach((opt, optIdx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          const buttons = item.querySelectorAll('.option-btn');
          buttons.forEach(b => { b.disabled = true; });
          if (optIdx === q.dogru_cevap_index) {
            btn.classList.add('correct');
          } else {
            btn.classList.add('incorrect');
            const correctBtn = buttons[q.dogru_cevap_index];
            if (correctBtn) correctBtn.classList.add('correct');
          }
          explain.classList.add('show');
        });
        item.appendChild(btn);
      });
    } else {
      const revealBtn = document.createElement('button');
      revealBtn.type = 'button';
      revealBtn.className = 'reveal-btn';
      revealBtn.textContent = 'Örnek cevabı göster';
      const answerP = document.createElement('p');
      answerP.style.marginTop = '10px';
      answerP.style.fontSize = '14px';
      answerP.style.display = 'none';
      answerP.textContent = q.ornek_cevap || '';
      revealBtn.addEventListener('click', () => {
        answerP.style.display = 'block';
        explain.classList.add('show');
        revealBtn.disabled = true;
      });
      item.appendChild(revealBtn);
      item.appendChild(answerP);
    }

    item.appendChild(explain);
    list.appendChild(item);
  });

  const flashGrid = document.getElementById('flashcards-list');
  flashGrid.innerHTML = '';
  (data.flashcardlar || []).forEach((card) => {
    const el = document.createElement('div');
    el.className = 'flashcard';
    el.innerHTML = `
      <div class="term">${escapeHtml(card.terim || '')}</div>
      <div class="def">${escapeHtml(card.tanim || '')}</div>
      <div class="hint">tıkla ve gör</div>
    `;
    el.addEventListener('click', () => el.classList.toggle('flipped'));
    flashGrid.appendChild(el);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById('again-btn').addEventListener('click', () => {
  results.style.display = 'none';
  formCard.style.display = 'block';
  fileInput.value = '';
  fileOk.textContent = '';
  extractedNotesText = '';
  generateBtn.disabled = true;
  window.scrollTo({ top: formCard.offsetTop - 40, behavior: 'smooth' });
});

function showError(msg) {
  if (!msg) { errorBox.style.display = 'none'; return; }
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
}
