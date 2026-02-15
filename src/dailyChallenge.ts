// Daily Challenge system for Flavortown
export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  era: string;
  mood: string;
  completed: boolean;
  bonusPoints: number;
}

const CHALLENGE_PRESETS = [
  { era: 'medieval', mood: 'adventurous', name: '⚔️ Medieval Adventure' },
  { era: 'diner', mood: 'nostalgic', name: '🕰️ Retro Nostalgia' },
  { era: 'space', mood: 'energetic', name: '⚡ Cosmic Energy' },
  { era: 'medieval', mood: 'mysterious', name: '🔮 Medieval Mystery' },
  { era: 'diner', mood: 'adventurous', name: '🍔 Brave New Diner' },
  { era: 'space', mood: 'mysterious', name: '🌌 Space Secrets' },
  { era: 'medieval', mood: 'nostalgic', name: '📜 Ancient Memories' },
  { era: 'diner', mood: 'energetic', name: '⚡ Diner Lightning' },
];

export async function getTodayChallenge(): Promise<DailyChallenge> {
  return new Promise((resolve) => {
    const today = new Date().toISOString().split('T')[0];
    chrome.storage.local.get(['dailyChallenge'], (data) => {
      const stored = data.dailyChallenge as DailyChallenge | undefined;

      // If we already have today's challenge, return it
      if (stored && stored.date === today) {
        resolve(stored);
        return;
      }

      // Generate new daily challenge
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const preset = CHALLENGE_PRESETS[dayOfYear % CHALLENGE_PRESETS.length];

      const challenge: DailyChallenge = {
        date: today,
        era: preset.era,
        mood: preset.mood,
        completed: false,
        bonusPoints: 50, // Bonus for completing daily challenge
      };

      chrome.storage.local.set({ dailyChallenge: challenge });
      resolve(challenge);
    });
  });
}

export async function completeDailyChallenge(): Promise<number> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['dailyChallenge', 'stats'], (data: any) => {
      const challenge = data.dailyChallenge as DailyChallenge | undefined;
      const stats = (data.stats || {}) as any;

      if (challenge && !challenge.completed) {
        challenge.completed = true;
        stats.dailyChallengesCompleted = (stats.dailyChallengesCompleted || 0) + 1;
        chrome.storage.local.set({
          dailyChallenge: challenge,
          stats: stats,
        });
        resolve(challenge.bonusPoints);
      } else {
        resolve(0);
      }
    });
  });
}

export function getChallengeDisplayName(era: string, mood: string): string {
  const preset = CHALLENGE_PRESETS.find((p) => p.era === era && p.mood === mood);
  return preset?.name || `${era} - ${mood}`;
}
