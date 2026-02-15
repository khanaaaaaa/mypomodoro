/// <reference types="chrome" />
import React, { useEffect, useState } from 'react';
import type { GameStats } from './stats';

interface StatsTabProps {
  stats: GameStats | null;
}

export const StatsTab: React.FC<StatsTabProps> = ({ stats }) => {
  const [timePlayedToday, setTimePlayedToday] = useState<string>('0m');

  useEffect(() => {
    if (stats) {
      const elapsedMs = Date.now() - stats.sessionStartTime;
      const minutes = Math.floor(elapsedMs / 60000);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        setTimePlayedToday(`${hours}h ${minutes % 60}m`);
      } else {
        setTimePlayedToday(`${minutes}m`);
      }
    }
  }, [stats]);

  if (!stats) {
    return <div className="stats-section">Loading stats...</div>;
  }

  const eraPercentages = {
    medieval:
      stats.totalTransformations > 0
        ? ((stats.eraUsage.medieval / stats.totalTransformations) * 100).toFixed(0)
        : '0',
    diner:
      stats.totalTransformations > 0
        ? ((stats.eraUsage.diner / stats.totalTransformations) * 100).toFixed(0)
        : '0',
    space:
      stats.totalTransformations > 0
        ? ((stats.eraUsage.space / stats.totalTransformations) * 100).toFixed(0)
        : '0',
  };

  return (
    <div className="stats-section">
      <h2>📊 Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">🍟 Total Fries</div>
          <div className="stat-value">{stats.points.toLocaleString()}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">🔄 Transformations</div>
          <div className="stat-value">{stats.totalTransformations}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">🔥 Current Streak</div>
          <div className="stat-value">{stats.currentStreak} days</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">⭐ Longest Streak</div>
          <div className="stat-value">{stats.longestStreak} days</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">🎯 Daily Challenges</div>
          <div className="stat-value">{stats.dailyChallengesCompleted}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">🎨 Unique Combos</div>
          <div className="stat-value">{stats.uniqueCombos}</div>
        </div>
      </div>

      <div className="era-usage">
        <h3>Era Popularity</h3>
        <div className="usage-chart">
          <div className="usage-item">
            <div className="usage-label">🏰 Medieval</div>
            <div className="usage-bar-container">
              <div
                className="usage-bar medieval"
                style={{
                  width: `${eraPercentages.medieval}%`,
                }}
              />
            </div>
            <div className="usage-count">
              {stats.eraUsage.medieval} ({eraPercentages.medieval}%)
            </div>
          </div>

          <div className="usage-item">
            <div className="usage-label">🍔 Diner</div>
            <div className="usage-bar-container">
              <div
                className="usage-bar diner"
                style={{
                  width: `${eraPercentages.diner}%`,
                }}
              />
            </div>
            <div className="usage-count">
              {stats.eraUsage.diner} ({eraPercentages.diner}%)
            </div>
          </div>

          <div className="usage-item">
            <div className="usage-label">🚀 Space</div>
            <div className="usage-bar-container">
              <div
                className="usage-bar space"
                style={{
                  width: `${eraPercentages.space}%`,
                }}
              />
            </div>
            <div className="usage-count">
              {stats.eraUsage.space} ({eraPercentages.space}%)
            </div>
          </div>
        </div>
      </div>

      <div className="session-info">
        <h3>Session Info</h3>
        <div className="session-stats">
          <div className="session-item">
            <span>Time Played Today:</span>
            <strong>{timePlayedToday}</strong>
          </div>
          <div className="session-item">
            <span>Transformations Today:</span>
            <strong>{stats.transformationsInSession}</strong>
          </div>
          <div className="session-item">
            <span>Points This Session:</span>
            <strong>{stats.points.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
