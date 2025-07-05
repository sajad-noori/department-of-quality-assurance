// List of bad words in Persian, Pashto, and English (expand as needed)
const badWords = [
  // Persian
  'کثافت', 'لعنتی', 'حرامزاده', 'بی‌ناموس', 'احمق', 'خر', 'گاو',
  // Pashto
  'خر', 'سپي', 'حرامزاده', 'لعنتي', 'بې غيرته',
  // English
  'fuck', 'shit', 'bitch', 'bastard', 'asshole', 'idiot', 'dumb', 'stupid', 'moron', 'jerk',
];

export function containsBadWords(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return badWords.some(word => lowerText.includes(word));
} 