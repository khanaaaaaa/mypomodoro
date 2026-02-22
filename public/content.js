let currentEra = null;
let currentMood = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.action === 'applyEra') {
    applyEraTransformation(message.era, message.mood);
    sendResponse({ success: true });
  }
  if (message && message.action === 'stopEffects') {
    stopAllEffects();
    sendResponse({ success: true });
  }
  if (message && message.action === 'showPomodoro') {
    showProductivityWidget();
    sendResponse({ success: true });
  }
  return true;
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTransformation);
} else {
  initializeTransformation();
}

function initializeTransformation() {
  chrome.storage.local.get(['currentEra', 'currentMood'], (data) => {
    if (chrome.runtime.lastError) {
      console.error('Storage error:', chrome.runtime.lastError);
      return;
    }
    
    try {
      if (data && data.currentEra) {
        applyEraTransformation(data.currentEra, data.currentMood || '');
      }
    } catch (error) {
      console.error('Error initializing content script:', error);
    }
  });
}

function applyEraTransformation(era, mood) {
  if (window.location.href.includes('chrome-extension://')) return;
  
  document.body.classList.remove('flavortown-medieval', 'flavortown-kawaii', 'flavortown-nature');
  document.body.classList.remove('flavortown-mood-adventurous', 'flavortown-mood-nostalgic', 'flavortown-mood-mysterious', 'flavortown-mood-energetic');
  removeExistingElements();
  
  currentEra = era;
  currentMood = mood;
  
  document.body.classList.add(`flavortown-${era}`);
  
  if (mood) {
    document.body.classList.add(`flavortown-mood-${mood}`);
  }
  
  const existingWidget = document.querySelector('.productivity-widget');
  if (existingWidget) {
    existingWidget.className = 'productivity-widget';
    if (era) existingWidget.classList.add(`theme-${era}`);
  }
  
  switch(era) {
    case 'medieval':
      applyMedievalTheme(mood);
      break;
    case 'kawaii':
      applyKawaiTheme(mood);
      break;
    case 'nature':
      applyNatureTheme(mood);
      break;
  }
  
  addFlavorAura(era);
}

function applyMedievalTheme(mood) {
  const headings = document.querySelectorAll('h1, h2, h3');
  headings.forEach(h => {
    if (!h.getAttribute('data-original')) {
      h.setAttribute('data-original', h.textContent);
      h.textContent = `⚔️ ${h.textContent} ⚔️`;
    }
  });
  
  const medievalWords = ['kingly', 'feast', 'noble', 'valiant', 'decree', 'kingdom'];
  injectRandomWords(medievalWords, '🏰');
}

function applyKawaiTheme(mood) {
  const kawaiEmojis = ['✨', '🌸', '🎀', '💖', '🌟', '🧡', '🍭', '🍩'];
  injectRandomEmojis(kawaiEmojis);
  
  const headings = document.querySelectorAll('h1, h2, h3');
  headings.forEach(h => {
    if (!h.getAttribute('data-original')) {
      h.setAttribute('data-original', h.textContent);
      h.textContent = `✨ ${h.textContent} ✨`;
    }
  });
}

function applyNatureTheme(mood) {
  const natureEmojis = ['🌿', '🌱', '🌻', '🌺', '🌳', '🌾', '🍀', '🍂'];
  injectRandomEmojis(natureEmojis);
  
  const headings = document.querySelectorAll('h1, h2, h3');
  headings.forEach(h => {
    if (!h.getAttribute('data-original')) {
      h.setAttribute('data-original', h.textContent);
      h.textContent = `🌿 ${h.textContent} 🌿`;
    }
  });
}

function addFlavorAura(era) {
  const aura = document.createElement('div');
  aura.className = 'flavortown-aura';
  aura.id = 'flavortown-aura';
  document.body.appendChild(aura);
}

function injectRandomWords(words, emoji) {
  const paragraphs = document.querySelectorAll('p');
  const count = Math.min(5, paragraphs.length);
  
  for (let i = 0; i < count; i++) {
    const randomP = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    if (randomP && !randomP.getAttribute('data-flavored')) {
      randomP.innerHTML += ` <span class="flavor-word">${emoji} ${randomWord}</span>`;
      randomP.setAttribute('data-flavored', 'true');
    }
  }
}

function injectRandomEmojis(emojis) {
  const elements = document.querySelectorAll('h1, h2, h3, p, a');
  const count = Math.min(10, elements.length);
  
  for (let i = 0; i < count; i++) {
    const randomEl = elements[Math.floor(Math.random() * elements.length)];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    if (randomEl && !randomEl.getAttribute('data-emoji-added')) {
      const span = document.createElement('span');
      span.className = 'flavor-emoji';
      span.textContent = randomEmoji;
      randomEl.appendChild(span);
      randomEl.setAttribute('data-emoji-added', 'true');
    }
  }
}

function removeExistingElements() {
  document.querySelectorAll('.flavortown-aura, .floating-icon, .flavor-word, .flavor-emoji').forEach(el => el.remove());
  
  document.querySelectorAll('[data-original]').forEach(el => {
    el.textContent = el.getAttribute('data-original');
    el.removeAttribute('data-original');
  });
  
  document.querySelectorAll('[data-flavored], [data-emoji-added]').forEach(el => {
    el.removeAttribute('data-flavored');
    el.removeAttribute('data-emoji-added');
  });
}

function stopAllEffects() {
  document.body.classList.remove('flavortown-medieval', 'flavortown-kawaii', 'flavortown-nature');
  document.body.classList.remove('flavortown-mood-adventurous', 'flavortown-mood-nostalgic', 'flavortown-mood-mysterious', 'flavortown-mood-energetic');
  
  removeExistingElements();
  
  document.querySelectorAll('.productivity-widget').forEach(w => w.remove());
  document.querySelectorAll('.flavortown-aura').forEach(a => a.remove());
  
  currentEra = null;
  currentMood = null;
  
  chrome.storage.local.set({ currentEra: '', currentMood: '' });
}

function showProductivityWidget() {
  if (document.querySelector('.productivity-widget')) return;
  
  const widget = document.createElement('div');
  widget.className = 'productivity-widget';
  if (currentEra) widget.classList.add(`theme-${currentEra}`);
  widget.innerHTML = `
    <div class="widget-header">Pomodoro Timer</div>
    <button class="close-btn" title="Close">×</button>
    <div class="widget-content">
      <div class="session-info">Session <span id="session-count">1</span> | <span id="mode-label">Focus</span></div>
      <div class="timer" id="pomodoro-timer">25:00</div>
      <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
      <div class="controls">
        <button class="control-btn" id="start-btn">Start</button>
        <button class="control-btn" id="stop-btn" style="display:none;">Pause</button>
        <button class="control-btn" id="reset-btn">Reset</button>
        <button class="control-btn" id="skip-btn">Skip</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(widget);
  
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  
  const widgetHeader = widget.querySelector('.widget-header');
  
  widgetHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    initialX = e.clientX - widget.offsetLeft;
    initialY = e.clientY - widget.offsetTop;
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      widget.style.left = currentX + 'px';
      widget.style.top = currentY + 'px';
      widget.style.right = 'auto';
    }
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  let timeLeft = 25 * 60;
  let totalTime = 25 * 60;
  let interval = null;
  let isRunning = false;
  let sessionCount = 1;
  let isBreak = false;
  
  const timerEl = widget.querySelector('#pomodoro-timer');
  const startBtn = widget.querySelector('#start-btn');
  const stopBtn = widget.querySelector('#stop-btn');
  const resetBtn = widget.querySelector('#reset-btn');
  const skipBtn = widget.querySelector('#skip-btn');
  const sessionEl = widget.querySelector('#session-count');
  const modeEl = widget.querySelector('#mode-label');
  const progressFill = widget.querySelector('#progress-fill');
  
  function updateTimer() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    progressFill.style.width = progress + '%';
  }
  
  function playSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2CBhku+zooVARC0yl4fG5ZRwFNo3V7859KQUofsz');
    audio.play().catch(() => {});
  }
  
  function startBreak() {
    isBreak = true;
    timeLeft = 5 * 60;
    totalTime = 5 * 60;
    modeEl.textContent = 'Break';
    updateTimer();
    playSound();
  }
  
  function startFocus() {
    isBreak = false;
    timeLeft = 25 * 60;
    totalTime = 25 * 60;
    modeEl.textContent = 'Focus';
    sessionCount++;
    sessionEl.textContent = sessionCount;
    updateTimer();
    playSound();
  }
  
  startBtn.addEventListener('click', () => {
    if (!isRunning) {
      isRunning = true;
      startBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';
      
      interval = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
          clearInterval(interval);
          isRunning = false;
          if (isBreak) {
            startFocus();
          } else {
            startBreak();
          }
          startBtn.style.display = 'inline-block';
          stopBtn.style.display = 'none';
        }
      }, 1000);
    }
  });
  
  stopBtn.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(interval);
      isRunning = false;
      startBtn.style.display = 'inline-block';
      stopBtn.style.display = 'none';
    }
  });
  
  resetBtn.addEventListener('click', () => {
    clearInterval(interval);
    isRunning = false;
    isBreak = false;
    sessionCount = 1;
    timeLeft = 25 * 60;
    totalTime = 25 * 60;
    modeEl.textContent = 'Focus';
    sessionEl.textContent = sessionCount;
    updateTimer();
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
  });
  
  skipBtn.addEventListener('click', () => {
    clearInterval(interval);
    isRunning = false;
    if (isBreak) {
      startFocus();
    } else {
      startBreak();
    }
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
  });
  
  const closeBtn = widget.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    if (interval) clearInterval(interval);
    widget.remove();
  });
}
