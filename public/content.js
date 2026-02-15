let currentEra = null;
let currentMood = null;
let goldenFriesFound = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
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
  } catch (error) {
    console.error('Error processing message:', error);
    sendResponse({ success: false, error: String(error) });
  }
  return true;
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTransformation);
} else {
  initializeTransformation();
}

function initializeTransformation() {
  chrome.storage.local.get(['currentEra', 'currentMood', 'randomMode'], (data) => {
    if (chrome.runtime.lastError) {
      console.error('Storage error:', chrome.runtime.lastError);
      return;
    }
    
    try {
      if (data && data.randomMode) {
        const eras = ['medieval', 'kawaii'];
        const randomEra = eras[Math.floor(Math.random() * eras.length)];
        applyEraTransformation(randomEra, data.currentMood || '');
      } else if (data && data.currentEra) {
        applyEraTransformation(data.currentEra, data.currentMood || '');
      }
      
      showProductivityWidget();
    } catch (error) {
      console.error('Error initializing content script:', error);
    }
  });
}

function applyEraTransformation(era, mood) {
  document.body.classList.remove('flavortown-medieval', 'flavortown-kawaii');
  document.body.classList.remove('flavortown-mood-adventurous', 'flavortown-mood-nostalgic', 'flavortown-mood-mysterious', 'flavortown-mood-energetic');
  removeExistingElements();
  
  currentEra = era;
  currentMood = mood;
  
  document.body.classList.add(`flavortown-${era}`);
  
  if (mood) {
    document.body.classList.add(`flavortown-mood-${mood}`);
  }
  
  switch(era) {
    case 'medieval':
      applyMedievalTheme(mood);
      break;
    case 'kawaii':
      applyKawaiTheme(mood);
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
  document.body.classList.remove('flavortown-medieval', 'flavortown-kawaii');
  document.body.classList.remove('flavortown-mood-adventurous', 'flavortown-mood-nostalgic', 'flavortown-mood-mysterious', 'flavortown-mood-energetic');
  
  removeExistingElements();
  
  const widget = document.querySelector('.productivity-widget');
  if (widget) widget.remove();
  
  document.querySelectorAll('a, img').forEach(el => {
    el.style.textShadow = '';
    el.style.filter = '';
    el.style.transition = '';
    el.style.transform = '';
  });
  
  currentEra = null;
  currentMood = null;
  
  chrome.storage.local.set({ currentEra: '', currentMood: '' });
}

function showProductivityWidget() {
  if (document.querySelector('.productivity-widget')) return;
  
  const goals = [
    'Take a 2-minute stretch break',
    'Drink a glass of water',
    'Write down 3 things you\'re grateful for',
    'Complete one small task',
    'Take 5 deep breaths',
    'Look away from screen for 20 seconds',
    'Check and clear 5 notifications',
    'Organize one folder on your desktop'
  ];
  
  const randomGoal = goals[Math.floor(Math.random() * goals.length)];
  
  const widget = document.createElement('div');
  widget.className = 'productivity-widget';
  widget.innerHTML = `
    <button class="popout-btn" title="Pop Out">⛶</button>
    <button class="minimize-btn" title="Minimize">−</button>
    <button class="close-btn" title="Close">×</button>
    <div class="widget-content">
      <h3>Productivity Boost</h3>
      <div class="goal">${randomGoal}</div>
      <div class="timer" id="pomodoro-timer">25:00</div>
      <div style="text-align: center; font-size: 12px; color: #666; margin-bottom: 10px;">Pomodoro Timer</div>
      <div class="controls">
        <button class="control-btn" id="start-btn">Start</button>
        <button class="control-btn" id="stop-btn" style="display:none;">Pause</button>
        <button class="control-btn" id="reset-btn">Reset</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(widget);
  
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  
  widget.addEventListener('mousedown', (e) => {
    if (e.target === widget || e.target === widget.querySelector('h3')) {
      isDragging = true;
      initialX = e.clientX - widget.offsetLeft;
      initialY = e.clientY - widget.offsetTop;
    }
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
  let interval = null;
  let isRunning = false;
  
  const timerEl = widget.querySelector('#pomodoro-timer');
  const startBtn = widget.querySelector('#start-btn');
  const stopBtn = widget.querySelector('#stop-btn');
  const resetBtn = widget.querySelector('#reset-btn');
  
  function updateTimer() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
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
          timerEl.textContent = 'Done!';
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
    timeLeft = 25 * 60;
    updateTimer();
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
  });
  
  widget.querySelector('.minimize-btn').addEventListener('click', () => {
    widget.classList.toggle('minimized');
  });
  
  widget.querySelector('.popout-btn').addEventListener('click', () => {
    if (interval) clearInterval(interval);
    widget.remove();
    chrome.storage.local.set({ 
      pomodoroState: { timeLeft, isRunning, goal: randomGoal }
    });
  });
  
  widget.querySelector('.close-btn').addEventListener('click', () => {
    if (interval) clearInterval(interval);
    widget.remove();
  });
}