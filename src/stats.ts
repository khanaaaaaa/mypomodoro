// Statistics and progress tracking for Flavortown
export interface GameStats {
  points: number;
  totalTransformations: number;
  eraUsage: {
    medieval: number;
    diner: number;
    space: number;
  };
  moodUsage: {
    adventurous: number;
    nostalgic: number;
    mysterious: number;
    energetic: number;
  };
  uniqueCombos: number;
  lastPlayDate: number;
  currentStreak: number;
  longestStreak: number;
  dailyChallengesCompleted: number;
  totalFriesCollected: number;
  sessionStartTime: number;
  transformationsInSession: number;
}

export const DEFAULT_STATS: GameStats = {
  points: 0,
  totalTransformations: 0,
  eraUsage: {
    medieval: 0,
    diner: 0,
    space: 0,
  },
  moodUsage: {
    adventurous: 0,
    nostalgic: 0,
    mysterious: 0,
    energetic: 0,
  },
  uniqueCombos: 0,
  lastPlayDate: 0,
  currentStreak: 0,
  longestStreak: 0,
  dailyChallengesCompleted: 0,
  totalFriesCollected: 0,
  sessionStartTime: Date.now(),
  transformationsInSession: 0,
};

export async function getStats(): Promise<GameStats> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['stats'], (data) => {
      resolve((data.stats as GameStats) || DEFAULT_STATS);
    });
  });
}

export async function updateStats(stats: GameStats): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ stats }, resolve);
  });
}

export function calculateMultiplier(stats: GameStats): number {
  // Multiplier based on streak and transformations in session
  const streakBonus = Math.min(stats.currentStreak * 0.1, 1); // Max 1.0x bonus
  const sessionBonus = Math.floor(stats.transformationsInSession / 5) * 0.15; // Bonus every 5 transformations

  return 1 + streakBonus + sessionBonus;
}

export function calculateStreakBonus(points: number, multiplier: number): number {
  return Math.floor(points * multiplier);
}

export async function recordTransformation(
  era: string,
  mood: string,
  bonusPoints: number = 0
): Promise<void> {
  const stats = await getStats();

  // Update era usage
  stats.eraUsage[era as keyof typeof stats.eraUsage]++;

  // Update mood usage
  stats.moodUsage[mood as keyof typeof stats.moodUsage]++;

  // Increment transformations
  stats.totalTransformations++;
  stats.transformationsInSession++;

  // Calculate combo uniqueness
  const combo = `${era}-${mood}`;
  const comboKey = `combo_${combo}`;
  chrome.storage.local.get([comboKey], (data) => {
    if (!data[comboKey]) {
      stats.uniqueCombos++;
      chrome.storage.local.set({ [comboKey]: true });
    }
  });

  // Calculate points with multiplier
  const multiplier = calculateMultiplier(stats);
  const earnedPoints = calculateStreakBonus(10 + bonusPoints, multiplier); // Base 10 points + bonus
  stats.points += earnedPoints;
  stats.totalFriesCollected += earnedPoints;

  // Check and update streak
  const today = new Date().toDateString();
  const lastPlayDateStr =
    new Date(stats.lastPlayDate).toDateString();
  const daysDiff = Math.floor((Date.now() - stats.lastPlayDate) / (1000 * 60 * 60 * 24));

  if (today !== lastPlayDateStr) {
    if (daysDiff === 1) {
      stats.currentStreak++;
    } else if (daysDiff > 1) {
      stats.currentStreak = 1;
    }
    stats.lastPlayDate = Date.now();
  }

  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }

  await updateStats(stats);
}
