export type MilestoneType = 'general' | 'easy' | 'medium' | 'hard'

const DIFFICULTY_THRESHOLDS = [10, 30, 50, 70, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]

export function getMilestoneThreshold(type: MilestoneType, index: number): number {
  if (type === 'general') return (index + 1) * 20
  if (index < DIFFICULTY_THRESHOLDS.length) return DIFFICULTY_THRESHOLDS[index]
  return 1000 + (index - (DIFFICULTY_THRESHOLDS.length - 1)) * 100
}

export function getMilestoneReward(type: MilestoneType, index: number): number {
  if (type === 'general') return 1000 + index * 250
  if (type === 'easy') {
    if (index === 0) return 500
    if (index === 1) return 1000
    return 2000
  }
  if (type === 'medium') {
    if (index === 0) return 1000
    if (index === 1) return 2000
    return 3000
  }
  if (index === 0) return 2000
  if (index === 1) return 3000
  return 5000
}
