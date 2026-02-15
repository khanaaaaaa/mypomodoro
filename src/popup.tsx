/// <reference types="chrome" />
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import './popup.css';
import { recordTransformation, DEFAULT_STATS } from './stats';
import { playTransformSound, playSuccessSound } from './soundEffects';

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
  { id: 'kawaii', name: 'Kawaii Dreamscape', icon: '🌸', description: 'Light pink background & cute anime vibes' }
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

  useEffect(() => {
    // Initialize all missing data in storage
    const initializeStorage = async () => {
      chrome.storage.local.get(null, (allData: any) => {
        const toSet: any = {};

        // Ensure stats exists
        if (!allData.stats) {
          toSet.stats = DEFAULT_STATS;
        }

        // Ensure achievements array exists
        if (!allData.achievements) {
          toSet.achievements = [];
        }

        // Ensure dailyChallenge exists  
        if (!allData.dailyChallenge) {
          toSet.dailyChallenge = null;
        }

        // Ensure customThemes array exists
        if (!allData.customThemes) {
          toSet.customThemes = [];
        }

        // Ensure basic fields exist
        if (allData.points === undefined) {
          toSet.points = 0;
        }
        if (!allData.currentEra) {
          toSet.currentEra = 'medieval';
        }
        if (!allData.currentMood) {
          toSet.currentMood = 'adventurous';
        }

        // Set all missing values at once
        if (Object.keys(toSet).length > 0) {
          chrome.storage.local.set(toSet);
        }

        // Load current state
        chrome.storage.local.get(['currentEra', 'currentMood'], (data: any) => {
          if (data.currentEra) setSelectedEra(data.currentEra);
          if (data.currentMood) setSelectedMood(data.currentMood);
          updatePopupTheme(data.currentEra);
        });
      });
    };

    initializeStorage();

    // Listen for storage changes and update UI
    const handleStorageChange = (changes: any, area: string) => {
      if (area === 'local') {
        if (changes.currentEra) {
          setSelectedEra(changes.currentEra.newValue || 'medieval');
          updatePopupTheme(changes.currentEra.newValue);
        }
        if (changes.currentMood) setSelectedMood(changes.currentMood.newValue || 'adventurous');
      }
    };
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Set up keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') { setCurrentTab('pomodoro'); e.preventDefault(); }
        if (e.key === '2') { setCurrentTab('transform'); e.preventDefault(); }
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    // Listen for messages
    const handleMessage = (message: any) => {
      if (message.action === 'updatePoints') {
        // No-op
      }
    };
    
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      chrome.runtime.onMessage.removeListener(handleMessage);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const updatePopupTheme = (era: string) => {
    const container = document.querySelector('.popup-container');
    if (container) {
      container.classList.remove('theme-medieval', 'theme-kawaii');
      if (era) container.classList.add(`theme-${era}`);
    }
  };

  const applyEra = async (era: string, mood: string) => {
    try {
      playTransformSound();
    } catch (e) {
      console.error('Sound error:', e);
    }

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
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
      await new Promise(r => setTimeout(r, 150));
      await chrome.tabs.sendMessage(tab.id, { action: 'applyEra', era, mood });
    }

    try {
      await recordTransformation(era, mood, 0);
    } catch (e) {
      console.error('Stats error:', e);
    }

    const eraName = ERAS.find(e => e.id === era)?.name || era;
    setStatus(`Transformed into ${eraName}!`);

    try {
      playSuccessSound();
    } catch (e) {
      console.error('Sound error:', e);
    }
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
      setStatus('Please select an era first!');
    }
  };

  const handleRandomClick = async () => {
    const randomEra = pickRandom(ERAS);
    const randomMood = pickRandom(MOODS);
    setSelectedEra(randomEra.id);
    setSelectedMood(randomMood.id);
    await applyEra(randomEra.id, randomMood.id);
    await chrome.storage.local.set({ randomMode: true });
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

    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'stopEffects' });
    } catch {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
      await new Promise(r => setTimeout(r, 150));
      await chrome.tabs.sendMessage(tab.id, { action: 'stopEffects' });
    }

    setSelectedEra('');
    setSelectedMood('');
    setStatus('All effects stopped');
    await chrome.storage.local.set({ currentEra: '', currentMood: '', randomMode: false });
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
            Timer
          </button>
          <button
            className={`tab-btn ${currentTab === 'transform' ? 'active' : ''}`}
            onClick={() => setCurrentTab('transform')}
            title="Ctrl+2"
          >
            Transform
          </button>
        </div>

        <div className="tab-content">
          {currentTab === 'transform' && (
            <>
              <div className="mood-section">
                <div className="section-title">Select Thy Mood</div>
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

              <div className="section-title">Choose Thine Era</div>
              <div className="era-buttons">
                {ERAS.map(era => (
                  <button
                    key={era.id}
                    className={`era-btn ${selectedEra === era.id ? 'active' : ''}`}
                    onClick={() => handleEraClick(era.id)}
                  >
                    <span className="era-icon">{era.icon}</span>
                    <div className="era-content">
                      <div className="era-title">{era.name}</div>
                      <div className="era-desc">{era.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="random-btn" style={{ flex: 1, margin: 0 }} onClick={handleRandomClick}>
                  Random Adventure
                </button>

                <button className="stop-btn" style={{ flex: 1, margin: 0 }} onClick={handleStopEffects}>
                  Stop All Effects
                </button>
              </div>

              <div className="status">{status}</div>
            </>
          )}

          {currentTab === 'pomodoro' && (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '20px' }}>
              <h3 className="timer-title">Pomodoro Timer</h3>
              <div className="timer-display">
                {formatTime(pomodoroTime)}
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                {!pomodoroRunning ? (
                  <button className="btn-primary" style={{ padding: '10px 20px' }} onClick={startPomodoro}>
                    Start
                  </button>
                ) : (
                  <button className="btn-secondary" style={{ padding: '10px 20px' }} onClick={pausePomodoro}>
                    Pause
                  </button>
                )}
                <button className="btn-secondary" style={{ padding: '10px 20px' }} onClick={resetPomodoro}>
                  Reset
                </button>
              </div>
              <button 
                className="btn-primary" 
                style={{ width: '100%' }}
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
                Pop Out to Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
