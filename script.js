const PASSKEY = '1819';
const BIRTH_DATE = '2008-09-19'; 
const icons = ['✨', '🎉', '💖', '🥳', '⭐', '🎈', '🎊', '🎂'];

let pin = '', wrong = 0, unlocked = false;
const lock = document.getElementById('lock');
const dots = [...document.querySelectorAll('.dot')];
const keys = document.getElementById('keys');
const intro = document.getElementById('intro');
const gift = document.getElementById('gift');
const gate = document.getElementById('gate');
const giftModal = document.getElementById('giftModal');
const wrongModal = document.getElementById('wrongModal');
const wrongText = document.getElementById('wrongText');
const tryAgain = document.getElementById('tryAgain');

// Web Audio API (SFX Synthesizer)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSFX(freq, type, duration) {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// Toggle Music
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isPlaying = false;

musicToggle.onclick = () => {
  if (isPlaying) {
    bgMusic.pause();
    musicToggle.textContent = '🎵';
  } else {
    bgMusic.play();
    musicToggle.textContent = '⏸️';
  }
  isPlaying = !isPlaying;
};

const layout = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Batal', '0', 'Hapus'];
layout.forEach((v) => {
  let b = document.createElement('button');
  b.className = 'key' + (isNaN(v) ? ' action' : '');
  b.textContent = v;
  b.onclick = () => {
    flashKey(b);
    press(v);
  };
  keys.appendChild(b);
});

function paint() {
  dots.forEach((d, i) => d.classList.toggle('on', i < pin.length));
}

function flashKey(button) {
  button.classList.add('pressed');
  setTimeout(() => button.classList.remove('pressed'), 130);
}

function press(v) {
  playSFX(400, 'sine', 0.1);
  if (v === 'Batal') {
    pin = '';
    paint();
    return;
  }
  if (v === 'Hapus') {
    pin = pin.slice(0, -1);
    paint();
    return;
  }
  if (pin.length < 4) {
    pin += v;
    paint();
  }
  if (pin.length === 4) setTimeout(check, 120);
}

const hints = [
  'Hmm... bukan itu kuncinya sayang 👀 coba sekali lagi yaa.',
  'Masih salah? 🤏 Hint pertama: umur kamu saat ini',
  'Sayang... yang bener ajaa 😭 Hint kedua: tanggal lahir kamu '
];

function showWrongPopup() {
  playSFX(150, 'sawtooth', 0.3);
  wrongText.textContent = hints[Math.min(wrong, hints.length - 1)];
  wrong++;
  wrongModal.classList.add('show');
  if (navigator.vibrate) navigator.vibrate([45, 30, 45]);
}

function closeWrongPopup() {
  wrongModal.classList.remove('show');
  pin = '';
  paint();
}

function check() {
  if (pin === PASSKEY) {
    playSFX(800, 'sine', 0.2);
    unlocked = true;
    if (navigator.vibrate) navigator.vibrate([35, 25, 60]);
    setTimeout(() => {
      gate.style.display = 'none';
      intro.style.display = 'flex';
      intro.classList.remove('hide');
      document.querySelector('.gift-title').textContent = 'Nahhh, sekarang boleh dibuka 😌✨';
      document.querySelector('.gift-sub').textContent = 'Kuncinya cocok. siap-siap ya sayangg…';
      document.querySelector('.tap').textContent = 'UNLOCKED ✦';
      setTimeout(openGift, 650);
    }, 700);
  } else {
    lock.classList.add('shake');
    setTimeout(() => lock.classList.remove('shake'), 350);
    showWrongPopup();
  }
}

function openGift() {
  if (!unlocked) {
    askForKey();
    return;
  }
  if (gift.classList.contains('open')) return;

  gift.classList.add('open');
  playSFX(600, 'triangle', 0.4);

  const rect = gift.getBoundingClientRect();
  createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

  bgMusic
    .play()
    .then(() => {
      isPlaying = true;
      musicToggle.textContent = '⏸️';
    })
    .catch(() => {});

  party();

  setTimeout(() => intro.classList.add('hide'), 1450);
  setTimeout(() => {
    intro.style.display = 'none';
    let b = document.getElementById('birthday');
    b.style.display = 'block';
    requestAnimationFrame(() => (b.style.opacity = 1));

    typeWriter('Happy\nBirthday, Sayang!', 'typewriter', 80);
    calculateAge();
  }, 2050);
}

function party() {
  for (let i = 0; i < 90; i++) {
    let c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.animationDuration = 2 + Math.random() * 3 + 's';
    c.style.animationDelay = Math.random() * 0.8 + 's';
    c.style.opacity = 0.7 + Math.random() * 0.3;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }
}

function createBurst(x, y) {
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('div');
    el.className = 'burst';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];

    const angle = Math.random() * Math.PI * 2;
    const dist = 70 + Math.random() * 90;
    const tx = Math.cos(angle) * dist + 'px';
    const ty = Math.sin(angle) * dist + 'px';
    const rot = (Math.random() - 0.5) * 360 + 'deg';

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--x', tx);
    el.style.setProperty('--y', ty);
    el.style.setProperty('--r', rot);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

function askForKey() {
  if (unlocked) {
    openGift();
    return;
  }
  giftModal.classList.add('show');
  if (navigator.vibrate) navigator.vibrate(25);
}

gift.onclick = openGift;

document.getElementById('findKey').onclick = () => {
  giftModal.classList.remove('show');
  intro.classList.add('hide');
  setTimeout(() => {
    intro.style.display = 'none';
    gate.style.display = 'grid';
  }, 500);
};

giftModal.addEventListener('click', (e) => {
  if (e.target === giftModal) giftModal.classList.remove('show');
});
tryAgain.addEventListener('click', closeWrongPopup);
wrongModal.addEventListener('click', (e) => {
  if (e.target === wrongModal) closeWrongPopup();
});

function typeWriter(text, elementId, speed) {
  let i = 0;
  const elem = document.getElementById(elementId);
  if (!elem) return;
  elem.innerHTML = '';
  function type() {
    if (i < text.length) {
      elem.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function calculateAge() {
  const birth = new Date(BIRTH_DATE);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const ageElem = document.getElementById('ageCounter');
  if (ageElem) {
    if (months === 0 && days === 0) {
      ageElem.textContent = `Officially ${years} Years Old Today! 🎉`;
    } else if (months === 0) {
      ageElem.textContent = `Officially ${years} Years & ${days} Days Old! ✨`;
    } else {
      ageElem.textContent = `Officially ${years} Years, ${months} Months & ${days} Days Old! ✨`;
    }
  }
}

// Variabel Poin dan Pesan Counter Responsif
let openCount = 0;
let lastWishIndex = -1;

const normalWishes = [
  "Semoga hal yang selama ini diem-diem kamu harapin, akhirnya punya jalan buat jadi nyata. 🪄🤍",
  "Semoga tahun ini kamu ketemu lebih banyak alasan buat bilang: ‘ternyata hidup nggak buruk-buruk amat ya.’ 🥹✨",
  "Semoga dompet kamu makin tebel. Ini penting soalnya 😔☝🏻💸",
  "Semoga kamu selalu dikelilingi orang yang bikin kamu merasa dihargai dan disayang. You deserve that. 🫂🤍",
  "Semoga hari-hari berat kamu nggak pernah lebih banyak dari hari-hari bahagianya. 🌙✨",
  "Semoga apa pun yang sekarang lagi kamu perjuangin, suatu hari bisa kamu lihat sambil bilang: ‘oh, ternyata worth it.’ 🤍",
  "Semoga makin ganteng. Kalau bisa sih... soalnya sekarang aja udh ganteng 😔☝🏻",
  "Semoga kamu nggak pernah kehilangan versi diri kamu yang aku suka—eh maksudnya... yang baik 😭🤏🏻",
  "Semoga kita masih punya banyak obrolan random dan cerita nggak penting di tahun-tahun berikutnya. 🫵🏻🤍"
];

const rareWish = "Semoga salah satu wish kamu tahun ini... ada aku di dalamnya. EH HAHAH 😭🏃🏻‍♀️💨";

function openBottle() {
  playSFX(700, 'sine', 0.15);

  const wrapper = document.getElementById('bottleWrapper');
  const cork = document.getElementById('cork');
  const paper = document.getElementById('wishPaper');
  const wishText = document.getElementById('wishText');
  const wishHeader = document.getElementById('wishHeader');
  const triggerText = document.getElementById('bottleTriggerText');
  const counterElem = document.getElementById('counterText');

  // 1. Animasi Botol Shake & Gabus POP
  if (wrapper) wrapper.classList.add('shake-bottle');
  if (cork) cork.classList.add('pop');

  setTimeout(() => {
    if (wrapper) {
      wrapper.classList.remove('shake-bottle');
      wrapper.classList.add('pushed-back');
    }
  }, 350);

  // 2. Logika Rare Wish vs Normal Wish
  const isRare = Math.random() < 0.12;
  let selectedText = '';

  if (isRare) {
    selectedText = rareWish;
    if (paper) paper.classList.add('is-rare');
    if (wishHeader) wishHeader.innerHTML = '✦ RARE WISH ✦';
    createBurst(window.innerWidth / 2, window.innerHeight / 2);
  } else {
    if (paper) paper.classList.remove('is-rare');
    if (wishHeader) wishHeader.innerHTML = 'you got a little wish ✦';
    
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * normalWishes.length);
    } while (randomIndex === lastWishIndex && normalWishes.length > 1);

    lastWishIndex = randomIndex;
    selectedText = normalWishes[randomIndex];
  }

  if (wishText) wishText.innerHTML = selectedText;

  // 3. Terbangkan Kertas Keluar
  setTimeout(() => {
    if (paper) paper.classList.add('show');
  }, 200);

  // 4. Update Teks Petunjuk
  if (triggerText) {
    triggerText.textContent = '[ ambil wish lagi? 🔄 ]';
  }

  // 5. Update Counter
  openCount++;
  updateCounterText(counterElem);

  if (navigator.vibrate) navigator.vibrate(35);
}

function updateCounterText(elem) {
  if (!elem) return;
  
  if (openCount < 5) {
    elem.innerHTML = `you've opened <span id="openCount">${openCount}</span> little wishes ✦`;
  } else if (openCount < 10) {
    elem.innerHTML = `kok dibuka terus... kurang banyak aku doain ya? 🥹💖 (${openCount}x)`;
  } else if (openCount < 15) {
    elem.innerHTML = `KAI??? botolnya capek tau 🤖 (${openCount}x)`;
  } else {
    elem.innerHTML = `oke fix kamu ketagihan didoain 😭✨ (${openCount}x)`;
  }
}

// Logika Modal Surat
let currentPage = 0;
const pages = document.querySelectorAll('.letter-page');

function openLetter() {
  document.getElementById('letterModal').classList.add('show');
  showPage(0);
}

function closeLetter() {
  document.getElementById('letterModal').classList.remove('show');
}

function showPage(index) {
  pages.forEach((p, i) => p.classList.toggle('active', i === index));
  currentPage = index;

  document.getElementById('prevPageBtn').disabled = currentPage === 0;
  document.getElementById('nextPageBtn').disabled = currentPage === pages.length - 1;
}

function changePage(step) {
  const newIndex = currentPage + step;
  if (newIndex >= 0 && newIndex < pages.length) {
    showPage(newIndex);
  }
}

document.getElementById('letterModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('letterModal')) closeLetter();
});

function revealFavPhoto() {
  const overlay = document.getElementById('favOverlay');
  const caption = document.getElementById('favCaption');

  if (overlay && !overlay.classList.contains('hidden')) {
    overlay.classList.add('hidden');
    caption.classList.add('show');

    playSFX(650, 'sine', 0.2);
    if (navigator.vibrate) navigator.vibrate(30);
  }
}

function addToWishlist() {
  const btn = document.getElementById('wishlistBtn');
  const successBox = document.getElementById('wishlistSuccess');

  if (btn) {
    btn.style.display = 'none';
    successBox.classList.add('show');

    playSFX(750, 'sine', 0.2);
    if (navigator.vibrate) navigator.vibrate([30, 20, 50]);
  }
}