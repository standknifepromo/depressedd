const validCodes = Object.fromEntries(
  Array.from({ length: 250 }, (_, index) => {
    const randomPart = Array.from({ length: 6 }, (_, i) => {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return alphabet[Math.floor(Math.random() * alphabet.length)];
    }).join('');

    const code = `DEPRESSED_${randomPart}`;
    return [code, 5000 + index * 20];
  })
);

validCodes.DEPRESSED_123456 = 9000;
validCodes.DEPRESSED_777777 = 7500;
validCodes.DEPRESSED_999999 = 10000;

const storageKey = 'depressed_used_codes';
const input = document.getElementById('codeInput');
const button = document.getElementById('checkButton');
const statusMessage = document.getElementById('statusMessage');
const modal = document.getElementById('rewardModal');
const rewardText = document.getElementById('rewardText');
const closeModal = document.getElementById('closeModal');

function parseCode(rawValue) {
  const cleaned = rawValue.trim();
  if (!cleaned) return '';

  const normalized = cleaned.replace(/\s+/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!normalized) return '';

  if (normalized.startsWith('DEPRESSED')) {
    const suffix = normalized.slice('DEPRESSED'.length).replace(/^_*/, '');
    return suffix ? `DEPRESSED_${suffix}` : 'DEPRESSED_';
  }

  return `DEPRESSED_${normalized}`;
}

function setStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message visible ${type}`;
}

function clearStatus() {
  statusMessage.textContent = '';
  statusMessage.className = 'status-message';
}

function readUsedCodes() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    return [];
  }
}

function writeUsedCodes(codes) {
  localStorage.setItem(storageKey, JSON.stringify(codes));
}

function showReward(amount) {
  rewardText.innerHTML = `Вы выиграли ${amount} голды<br><br>Telegram: <a href="https://t.me/destroid21" target="_blank" rel="noopener noreferrer">@destroid21</a>`;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeReward() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

button.addEventListener('click', () => {
  const code = parseCode(input.value);

  if (!code || code === 'DEPRESSED_') {
    setStatus('Промо начинается на DEPRESSED_XXXXXX', 'error');
    return;
  }

  const usedCodes = readUsedCodes();

  if (usedCodes.includes(code)) {
    setStatus('Промокод уже был активирован', 'error');
    return;
  }

  if (Object.prototype.hasOwnProperty.call(validCodes, code)) {
    usedCodes.push(code);
    writeUsedCodes(usedCodes);
    clearStatus();
    showReward(validCodes[code]);
    input.value = '';
    return;
  }

  setStatus('Промокод неверный', 'error');
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    button.click();
  }
});

closeModal.addEventListener('click', closeReward);
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeReward();
  }
});
