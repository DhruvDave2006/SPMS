import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, showLabel = true, size = 'md', color = 'brass' }) {
  const clamped = Math.min(100, Math.max(0, value));

  const sizeMap = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
  const colorMap = {
    brass:  'from-brass-600 to-brass-400',
    teal:   'from-teal-600 to-teal-400',
    sage:   'from-sage-600 to-sage-500',
    brick:  'from-brick-600 to-brick-500',
    amber:  'from-amber-600 to-amber-400',
  };

  const barColor = clamped === 100
    ? colorMap.sage
    : clamped > 60
    ? colorMap.teal
    : clamped > 30
    ? colorMap.brass
    : colorMap.amber;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-2xs text-navy-400 font-mono">Progress</span>
          <span className="text-2xs font-bold text-white font-mono">{clamped}%</span>
        </div>
      )}
      <div className={`w-full ${sizeMap[size]} bg-navy-700 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
        />
      </div>
    </div>
  );
}
