/// <reference types="chrome" />
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import './popup.css';
import './popup-compact.css';

interface EraConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface MoodConfig {
  id: string;
  name: string;
  icon: string;
}

const ERAS: EraConfig[] = [
  { id: 'medieval', name: 'Medieval Feast', icon: '🏰', description: 'Parchment scrolls & royal proclamations' },
  { id: 'kawaii', name: 'Kawaii Dreamscape', icon: '🌸', description: 'Light pink background & cute anime vibes' },
  { id: 'nature', name: 'Nature Forest', icon: '🌿', description: 'Green tones & calming leaf patterns' }
];

const MOODS: MoodConfig[] = [
  { id: 'adventurous', name: 'Adventurous', icon: '' },
  { id: 'nostalgic', name: 'Nostalgic', icon: '' },
  { id: 'mysterious', name: 'Mysterious', icon: '' },
  { id: 'energetic', name: 'Energetic', icon: '' }
];

type TabType = 'transform' | 'pomodoro';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const Popup: React.FC = () => {
  const [selectedEra, setSelectedEra] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [status, setStatus] = useState<string>('Select an era to begin thy journey...');
  const [currentTab, setCurrentTab] = useState<TabType>('pomodoro');
  const [pomodoroTime, setPomodoroTime] = useState<number>(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState<boolean>(false);
  const [pomodoroInterval, setPomodoroInterval] = useState<number | null>(null);
  const [breakTime, setBreakTime] = useState<number>(5 * 60);
  const [isBreak, setIsBreak] = useState<boolean>(false);

  useEffect(() => {
    const initializeStorage = async () => {
      chrome.storage.local.get(['currentEra', 'currentMood'], (data: any) => {
        if (data.currentEra) {
          setSelectedEra(data.currentEra);
          updatePopupTheme(data.currentEra);
        }
        if (data.currentMood) {
          setSelectedMood(data.currentMood);
        }
      });
    };

    initializeStorage();

    const handleStorageChange = (changes: any, area: string) => {
      if (area === 'local') {
        if (changes.currentEra) {
          const newEra = changes.currentEra.newValue || '';
          setSelectedEra(newEra);
          updatePopupTheme(newEra);
        }
        if (changes.currentMood) {
          setSelectedMood(changes.currentMood.newValue || '');
        }
      }
    };
    chrome.storage.onChanged.addListener(handleStorageChange);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') { setCurrentTab('pomodoro'); e.preventDefault(); }
        if (e.key === '2') { setCurrentTab('transform'); e.preventDefault(); }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const updatePopupTheme = (era: string) => {
    const container = document.querySelector('.popup-container');
    if (container) {
      container.classList.remove('theme-medieval', 'theme-kawaii', 'theme-nature');
      if (era) container.classList.add(`theme-${era}`);
    }
  };

  const applyEra = async (era: string, mood: string) => {
    const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, resolve);
    });

    const tab = tabs[0];
    if (!tab?.id) {
      setStatus('No active tab found');
      return;
    }

    await chrome.storage.local.set({ currentEra: era, currentMood: mood });

    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'applyEra', era, mood });
    } catch {
      try {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
        await new Promise(r => setTimeout(r, 100));
        await chrome.tabs.sendMessage(tab.id, { action: 'applyEra', era, mood });
      } catch (e) {
        console.error('Failed to apply theme:', e);
        setStatus('Error applying theme');
        return;
      }
    }

    const eraName = ERAS.find(e => e.id === era)?.name || era;
    setStatus(`Transformed into ${eraName}!`);
  };

  const handleEraClick = async (eraId: string) => {
    setSelectedEra(eraId);
    await applyEra(eraId, selectedMood || MOODS[0].id);
  };

  const handleMoodClick = async (moodId: string) => {
    setSelectedMood(moodId);
    if (selectedEra) {
      await chrome.storage.local.set({ currentMood: moodId });
      await applyEra(selectedEra, moodId);
    } else {
      const randomEra = pickRandom(ERAS);
      setSelectedEra(randomEra.id);
      await applyEra(randomEra.id, moodId);
    }
  };

  const handleRandomClick = async () => {
    const randomEra = pickRandom(ERAS);
    const randomMood = pickRandom(MOODS);
    setSelectedEra(randomEra.id);
    setSelectedMood(randomMood.id);
    await applyEra(randomEra.id, randomMood.id);
  };

  const handleStopEffects = async () => {
    const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, resolve);
    });

    const tab = tabs[0];
    if (!tab?.id) {
      setStatus('No active tab found');
      return;
    }

    setSelectedEra('');
    setSelectedMood('');
    await chrome.storage.local.set({ currentEra: '', currentMood: '' });
    updatePopupTheme('');

    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'stopEffects' });
      setStatus('All effects stopped');
    } catch {
      try {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
        await new Promise(r => setTimeout(r, 100));
        await chrome.tabs.sendMessage(tab.id, { action: 'stopEffects' });
        setStatus('All effects stopped');
      } catch (e) {
        console.error('Failed to stop effects:', e);
        setStatus('Error stopping effects');
      }
    }
  };



  const startPomodoro = () => {
    if (!pomodoroRunning) {
      setPomodoroRunning(true);
      const interval = window.setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            window.clearInterval(interval);
            setPomodoroRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setPomodoroInterval(interval);
    }
  };

  const pausePomodoro = () => {
    if (pomodoroInterval) {
      window.clearInterval(pomodoroInterval);
      setPomodoroInterval(null);
      setPomodoroRunning(false);
    }
  };

  const resetPomodoro = () => {
    if (pomodoroInterval) {
      window.clearInterval(pomodoroInterval);
      setPomodoroInterval(null);
    }
    setPomodoroRunning(false);
    setPomodoroTime(25 * 60);
    setIsBreak(false);
  };

  const startBreak = () => {
    setIsBreak(true);
    setBreakTime(5 * 60);
    const interval = window.setInterval(() => {
      setBreakTime(prev => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setIsBreak(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setPomodoroInterval(interval);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="popup-container">
      <div className="container">
        <div className="header">
          <div className="header-main">
            <h1>Pasta's Pomodoro</h1>
          </div>
        </div>

        <div className="tab-navigation">
          <button
            className={`tab-btn ${currentTab === 'pomodoro' ? 'active' : ''}`}
            onClick={() => setCurrentTab('pomodoro')}
            title="Ctrl+1"
          >
            ⏱️ Timer
          </button>
          <button
            className={`tab-btn ${currentTab === 'transform' ? 'active' : ''}`}
            onClick={() => setCurrentTab('transform')}
            title="Ctrl+2"
          >
            ✨ Transform
          </button>
        </div>

        <div className="tab-content">
          {currentTab === 'transform' && (
            <>
              <div className="mood-section">
                <div className="section-title">Mood</div>
                <div className="mood-buttons">
                  {MOODS.map(mood => (
                    <button
                      key={mood.id}
                      className={`mood-btn ${selectedMood === mood.id ? 'active' : ''}`}
                      onClick={() => handleMoodClick(mood.id)}
                    >
                      {mood.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="section-title">Theme</div>
              <div className="theme-grid">
                {ERAS.map(era => (
                  <button
                    key={era.id}
                    className={`theme-card ${selectedEra === era.id ? 'active' : ''}`}
                    onClick={() => handleEraClick(era.id)}
                  >
                    <div className="theme-icon">{era.icon}</div>
                    <div className="theme-name">{era.name}</div>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button className="random-btn" style={{ flex: 1, margin: 0 }} onClick={handleRandomClick}>
                  🎲 Random
                </button>
                <button className="stop-btn" style={{ flex: 1, margin: 0 }} onClick={handleStopEffects}>
                  ⛔ Stop
                </button>
              </div>

              <div className="status">{status}</div>
            </>
          )}

          {currentTab === 'pomodoro' && (
            <div className="pomodoro-container">
              <div className="pomodoro-content">
                <div className="pomodoro-main">
                  <h3 className="timer-title">{isBreak ? '☕ Break' : '⏱️ Focus'}</h3>
                  <div className="timer-display">
                    {formatTime(isBreak ? breakTime : pomodoroTime)}
                  </div>
                  <div className="timer-controls">
                    {!pomodoroRunning && !isBreak ? (
                      <button className="btn-primary" onClick={startPomodoro}>▶ Start</button>
                    ) : !isBreak ? (
                      <button className="btn-secondary" onClick={pausePomodoro}>⏸ Pause</button>
                    ) : null}
                    <button className="btn-secondary" onClick={resetPomodoro}>↻ Reset</button>
                    {!isBreak && pomodoroTime === 0 && (
                      <button className="btn-primary" onClick={startBreak}>☕ Break</button>
                    )}
                  </div>
                  <button 
                    className="btn-popout" 
                    onClick={async () => {
                      try {
                        const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) => {
                          chrome.tabs.query({ active: true, currentWindow: true }, resolve);
                        });
                        if (tabs[0]?.id) {
                          try {
                            await chrome.tabs.sendMessage(tabs[0].id, { action: 'showPomodoro' });
                          } catch {
                            await chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['content.js'] });
                            await new Promise(r => setTimeout(r, 150));
                            await chrome.tabs.sendMessage(tabs[0].id, { action: 'showPomodoro' });
                          }
                        }
                      } catch (error) {
                        console.error('Error showing pomodoro:', error);
                      }
                    }}
                  >
                    📌 Pop Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
