'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getMilestoneThreshold, getMilestoneReward } from './milestoneUtils'
import type { MilestoneType } from './milestoneUtils'

export type { MilestoneType }

// difficultyName: the actual value stored in task.task_difficulty (null = count all difficulties)
export async function claimMilestoneReward(
  milestoneType: MilestoneType,
  milestoneIndex: number,
  difficultyName: string | null
): Promise<{ success?: boolean; reward?: number; error?: string }> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('task_milestone_claimed')
    .select('id')
    .eq('user_id', user.id)
    .eq('milestone_type', milestoneType)
    .eq('milestone_index', milestoneIndex)
    .maybeSingle()

  if (existing) return { error: 'Already claimed' }

  const threshold = getMilestoneThreshold(milestoneType, milestoneIndex)

  let countQuery = supabase
    .from('task')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_complete', true)

  if (difficultyName) {
    countQuery = countQuery.eq('task_difficulty', difficultyName)
  }

  const { count } = await countQuery
  if ((count ?? 0) < threshold) return { error: 'Not enough completed tasks' }

  const reward = getMilestoneReward(milestoneType, milestoneIndex)

  const { data: profile } = await supabase
    .from('profile')
    .select('exp_amount')
    .eq('user_id', user.id)
    .single()

  const currentExp = profile?.exp_amount ?? 0

  const [expResult, claimResult] = await Promise.all([
    supabase
      .from('profile')
      .update({ exp_amount: currentExp + reward })
      .eq('user_id', user.id),
    supabase
      .from('task_milestone_claimed')
      .insert({ user_id: user.id, milestone_type: milestoneType, milestone_index: milestoneIndex }),
  ])

  if (expResult.error || claimResult.error) return { error: 'Failed to claim reward' }

  revalidatePath('/milestone')
  return { success: true, reward }
}
