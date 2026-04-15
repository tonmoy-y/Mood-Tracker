export const getInsightMessage = (weeklySummary) => {
  const { total, positiveRatio, counts, dominantMood } = weeklySummary

  if (!total) {
    return 'No mood entries yet this week. A quick check-in today can start your pattern.'
  }

  if (positiveRatio >= 60) {
    return 'You have had a mostly steady or positive week. Keep supporting what is working for you.'
  }

  if (counts.sad + counts.angry >= counts.happy + counts.neutral) {
    return 'This week looks emotionally heavy. Consider slowing down and reaching out to someone you trust.'
  }

  if (dominantMood === 'neutral') {
    return 'Your week has looked balanced. Try one small uplifting activity to nudge your energy.'
  }

  return 'Your mood pattern is mixed this week. Staying consistent with short check-ins can help.'
}
