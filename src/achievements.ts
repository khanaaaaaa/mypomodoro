// Achievement system for Flavortown
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'medieval_master',
    name: 'Medieval Master',
    description: 'Use Medieval Era 10 times',
    icon: '🏰',
    unlocked: false,
  },
  {
    id: 'diner_devotee',
    name: 'Diner Devotee',
    description: 'Use Retro Diner 10 times',
    icon: '🍔',
    unlocked: false,
  },
  {
    id: 'space_explorer',
    name: 'Space Explorer',
    description: 'Use Futuristic Space 10 times',
    icon: '🚀',
    unlocked: false,
  },
  {
    id: 'mood_master',
    name: 'Mood Master',
    description: 'Try all 4 moods in one session',
    icon: '🎭',
    unlocked: false,
  },
  {
    id: 'fries_collector',
    name: 'Golden Fries Collector',
    description: 'Collect 500 golden fries',
    icon: '🍟',
    unlocked: false,
  },
  {
    id: 'speedster',
    name: 'Speedster',
    description: 'Apply 5 transformations in 5 minutes',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'combo_king',
    name: 'Combo King',
    description: 'Try 10 different era/mood combinations',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'daily_champion',
    name: 'Daily Champion',
    description: 'Complete daily challenge 5 times',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'rainbow_explorer',
    name: 'Rainbow Explorer',
    description: 'Achieve 7-day streak',
    icon: '🌈',
    unlocked: false,
  },
  {
    id: 'fries_king',
    name: 'Fries King',
    description: 'Collect 2000 golden fries',
    icon: '🍟👑',
    unlocked: false,
  },
];

export async function checkAchievements(
  stats: any,
  currentAchievements: Achievement[]
): Promise<Achievement[]> {
  const updated = [...currentAchievements];

  // Medieval Master
  if (
    stats.eraUsage?.medieval >= 10 &&
    !updated.find((a) => a.id === 'medieval_master')?.unlocked
  ) {
    const idx = updated.findIndex((a) => a.id === 'medieval_master');
    if (idx >= 0) {
      updated[idx].unlocked = true;
      updated[idx].unlockedAt = Date.now();
    }
  }

  // Diner Devotee
  if (
    stats.eraUsage?.diner >= 10 &&
    !updated.find((a) => a.id === 'diner_devotee')?.unlocked
  ) {
    const idx = updated.findIndex((a) => a.id === 'diner_devotee');
    if (idx >= 0) {
      updated[idx].unlocked = true;
      updated[idx].unlockedAt = Date.now();
    }
  }

  // Space Explorer
  if (
    stats.eraUsage?.space >= 10 &&
    !updated.find((a) => a.id === 'space_explorer')?.unlocked
  ) {
    const idx = updated.findIndex((a) => a.id === 'space_explorer');
    if (idx >= 0) {
      updated[idx].unlocked = true;
      updated[idx].unlockedAt = Date.now();
    }
  }

  // Fries Collector
  if (
    stats.points >= 500 &&
    !updated.find((a) => a.id === 'fries_collector')?.unlocked
  ) {
    const idx = updated.findIndex((a) => a.id === 'fries_collector');
    if (idx >= 0) {
      updated[idx].unlocked = true;
      updated[idx].unlockedAt = Date.now();
    }
  }

  // Fries King
  if (
    stats.points >= 2000 &&
    !updated.find((a) => a.id === 'fries_king')?.unlocked
  ) {
    const idx = updated.findIndex((a) => a.id === 'fries_king');
    if (idx >= 0) {
      updated[idx].unlocked = true;
      updated[idx].unlockedAt = Date.now();
    }
  }

  // Combo King
  if (
    stats.uniqueCombos >= 10 &&
    !updated.find((a) => a.id === 'combo_king')?.unlocked
  ) {
    const idx = updated.findIndex((a) => a.id === 'combo_king');
    if (idx >= 0) {
      updated[idx].unlocked = true;
      updated[idx].unlockedAt = Date.now();
    }
  }

  // Rainbow Explorer (7-day streak)
  if (
    stats.currentStreak >= 7 &&
    !updated.find((a) => a.id === 'rainbow_explorer')?.unlocked
  ) {
    const idx = updated.findIndex((a) => a.id === 'rainbow_explorer');
    if (idx >= 0) {
      updated[idx].unlocked = true;
      updated[idx].unlockedAt = Date.now();
    }
  }

  return updated;
}
