/// <reference types="chrome" />
import React, { useState, useEffect } from 'react';
import type { Achievement } from './achievements';
import { ACHIEVEMENTS, checkAchievements } from './achievements';
import type { GameStats } from './stats';

interface AchievementsTabProps {
  stats: GameStats | null;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ stats }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  useEffect(() => {
    // Initialize achievements if they don't exist
    chrome.storage.local.get(['achievements'], (data: any) => {
      if (!data.achievements || data.achievements.length === 0) {
        // Initialize with all achievements unlocked=false
        const initialAchievements = ACHIEVEMENTS.map(a => ({
          ...a,
          unlocked: false
        }));
        setAchievements(initialAchievements);
        chrome.storage.local.set({ achievements: initialAchievements });
      } else if (data.achievements) {
        setAchievements(data.achievements as Achievement[]);
      }
    });
  }, []);

  useEffect(() => {
    if (stats) {
      checkAchievements(stats, achievements).then((updated: Achievement[]) => {
        // Find newly unlocked achievements
        const newly = updated
          .filter((a: Achievement) => a.unlocked && !achievements.find((x) => x.id === a.id)?.unlocked)
          .map((a: Achievement) => a.id);

        if (newly.length > 0) {
          setNewAchievements(newly);
          setAchievements(updated);
          chrome.storage.local.set({ achievements: updated });
          
          // Play achievement sound
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const now = audioContext.currentTime;
            const playNote = (freq: number, time: number) => {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              osc.connect(gain);
              gain.connect(audioContext.destination);
              osc.frequency.setValueAtTime(freq, time);
              gain.gain.setValueAtTime(0.15, time);
              gain.gain.setValueAtTime(0, time + 0.3);
              osc.start(time);
              osc.stop(time + 0.3);
            };
            playNote(261.63, now);
            playNote(329.63, now);
            playNote(392.0, now);
          } catch (e) {
            console.error('Sound error:', e);
          }
        }
      });
    }
  }, [stats]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="achievements-section">
      <div className="achievements-header">
        <h2>🏆 Achievements</h2>
        <div className="achievement-progress">
          {unlockedCount}/{totalCount} Unlocked
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card ${
              achievement.unlocked ? 'unlocked' : 'locked'
            } ${newAchievements.includes(achievement.id) ? 'new' : ''}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-name">{achievement.name}</div>
            <div className="achievement-desc">{achievement.description}</div>
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="achievement-unlocked">
                🎉 {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
