/// <reference types="chrome" />
import React, { useEffect, useState } from 'react';
import type { DailyChallenge } from './dailyChallenge';
import { getTodayChallenge, completeDailyChallenge, getChallengeDisplayName } from './dailyChallenge';

interface DailyChallengeTabProps {
  onChallengeCompleted: (bonusPoints: number) => void;
}

export const DailyChallengeTab: React.FC<DailyChallengeTabProps> = ({ onChallengeCompleted }) => {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    getTodayChallenge().then((c: DailyChallenge) => {
      setChallenge(c);
      setCompleted(c.completed);
    });
  }, []);

  const handleCompleteChallenge = async () => {
    const bonus = await completeDailyChallenge();
    if (bonus > 0) {
      setCompleted(true);
      onChallengeCompleted(bonus);
    }
  };

  if (!challenge) {
    return <div className="daily-challenge-section">Loading challenge...</div>;
  }

  return (
    <div className="daily-challenge-section">
      <h2>🎯 Daily Challenge</h2>

      <div className={`challenge-card ${completed ? 'completed' : ''}`}>
        <div className="challenge-banner">
          <div className="challenge-title">Today's Challenge</div>
          {completed && <div className="challenge-completed-badge">✅ COMPLETED!</div>}
        </div>

        <div className="challenge-content">
          <div className="challenge-display-name">
            {getChallengeDisplayName(challenge.era, challenge.mood)}
          </div>

          <div className="challenge-instructions">
            <p>Transform the web into:</p>
            <div className="challenge-combination">
              <div className="combo-item">
                <div className="combo-label">Era</div>
                <div className="combo-value">
                  {challenge.era === 'medieval' && '🏰 Medieval'}
                  {challenge.era === 'diner' && '🍔 Retro Diner'}
                  {challenge.era === 'space' && '🚀 Space'}
                </div>
              </div>
              <div className="combo-item">
                <div className="combo-label">Mood</div>
                <div className="combo-value">
                  {challenge.mood === 'adventurous' && '⚔️ Adventurous'}
                  {challenge.mood === 'nostalgic' && '🕰️ Nostalgic'}
                  {challenge.mood === 'mysterious' && '🔮 Mysterious'}
                  {challenge.mood === 'energetic' && '⚡ Energetic'}
                </div>
              </div>
            </div>
          </div>

          <div className="challenge-reward">
            <div className="reward-icon">🎁</div>
            <div className="reward-text">
              Bonus Reward: <strong>+{challenge.bonusPoints} 🍟</strong>
            </div>
          </div>

          {!completed ? (
            <button className="challenge-complete-btn" onClick={handleCompleteChallenge}>
              ✨ Complete Challenge
            </button>
          ) : (
            <div className="challenge-completed-message">
              Great job! Come back tomorrow for a new challenge!
            </div>
          )}
        </div>
      </div>

      <div className="challenge-tip">
        💡 Tip: Complete daily challenges to earn bonus points and build your streak!
      </div>
    </div>
  );
};
