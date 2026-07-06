// Status / Priority Badge driven by CssClass field from the DB
const CLASS_MAP = {
  // Status classes
  'status-pending':    'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'status-inprogress': 'bg-teal-600/15 text-teal-400 border-teal-600/30',
  'status-completed':  'bg-sage-600/15 text-sage-500 border-sage-600/30',
  'status-rejected':   'bg-brick-600/15 text-brick-500 border-brick-600/30',
  'status-onhold':     'bg-navy-600/30 text-navy-300 border-navy-600/40',
  // Priority classes
  'priority-high':     'bg-brick-600/15 text-brick-400 border-brick-600/30',
  'priority-medium':   'bg-amber-600/15 text-amber-500 border-amber-600/30',
  'priority-low':      'bg-teal-600/15 text-teal-400 border-teal-600/30',
};

const DOT_MAP = {
  'status-pending':    'bg-amber-400',
  'status-inprogress': 'bg-teal-400',
  'status-completed':  'bg-sage-500',
  'status-rejected':   'bg-brick-500',
  'status-onhold':     'bg-navy-400',
  'priority-high':     'bg-brick-400',
  'priority-medium':   'bg-amber-500',
  'priority-low':      'bg-teal-400',
};

export default function Badge({ cssClass, label, showDot = true }) {
  const cls = CLASS_MAP[cssClass] || 'bg-navy-700 text-navy-300 border-navy-600';
  const dot = DOT_MAP[cssClass] || 'bg-navy-400';

  return (
    <span className={`badge border ${cls}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />}
      {label}
    </span>
  );
}
