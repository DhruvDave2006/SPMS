import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1);

  const renderPages = [];
  let prev = null;
  for (const p of visible) {
    if (prev !== null && p - prev > 1) renderPages.push('...');
    renderPages.push(p);
    prev = p;
  }

  const navBtn = 'p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navBtn}
        style={{ color: 'var(--page-btn-text)' }}
      >
        <ChevronLeft size={16} />
      </button>

      {renderPages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm" style={{ color: 'var(--text-faint)' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
              p === currentPage
                ? 'bg-brass-500 text-navy-900 font-bold shadow-glow-gold'
                : ''
            }`}
            style={p !== currentPage ? {
              color: 'var(--page-btn-text)',
              background: 'transparent',
            } : {}}
            onMouseEnter={e => { if (p !== currentPage) e.currentTarget.style.background = 'var(--page-btn-hover-bg)'; }}
            onMouseLeave={e => { if (p !== currentPage) e.currentTarget.style.background = 'transparent'; }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={navBtn}
        style={{ color: 'var(--page-btn-text)' }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
