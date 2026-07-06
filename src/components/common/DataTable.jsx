import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Trash2, Eye } from 'lucide-react';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

export default function DataTable({
  columns = [],
  data = [],
  actions = {},
  filters = [],
  loading = false,
  pageSize = 10,
  searchKeys = [],
  emptyTitle = 'No records found',
  emptyMessage = '',
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search.trim() && searchKeys.length > 0) {
      const q = search.toLowerCase();
      rows = rows.filter(row => searchKeys.some(k => String(row[k] ?? '').toLowerCase().includes(q)));
    }
    Object.entries(activeFilters).forEach(([key, val]) => {
      if (val) rows = rows.filter(row => String(row[key]) === String(val));
    });
    return rows;
  }, [data, search, searchKeys, activeFilters]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };
  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ChevronsUpDown size={13} style={{ color: 'var(--text-faint)' }} />;
    return sortDir === 'asc'
      ? <ChevronUp size={13} className="text-brass-500" />
      : <ChevronDown size={13} className="text-brass-500" />;
  };

  const hasActions = actions.onView || actions.onEdit || actions.onDelete || (actions.extra?.length > 0);

  return (
    <div className="glass-card overflow-hidden">
      {/* Toolbar */}
      <div
        className="px-4 py-3 flex flex-wrap gap-3 items-center"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        {searchKeys.length > 0 && (
          <div
            className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs px-3 py-2 rounded-lg"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
            }}
          >
            <Search size={14} style={{ color: 'var(--text-faint)' }} className="flex-shrink-0" />
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search…"
              className="bg-transparent text-sm outline-none flex-1 font-sans"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        )}

        {filters.map(f => (
          <select
            key={f.key}
            value={activeFilters[f.key] || ''}
            onChange={e => { setActiveFilters(prev => ({ ...prev, [f.key]: e.target.value })); setPage(1); }}
            className="px-3 py-2 text-sm rounded-lg outline-none cursor-pointer"
            style={{
              background: 'var(--select-bg)',
              border: '1px solid var(--select-border)',
              color: 'var(--select-text)',
            }}
          >
            <option value="">{f.label}</option>
            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}

        <span className="ml-auto text-xs font-mono whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : paginated.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={col.sortable ? 'cursor-pointer select-none transition-colors' : ''}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col} />
                    </span>
                  </th>
                ))}
                {hasActions && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, i) => (
                <tr key={i}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  {hasActions && (
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        {actions.onView && (
                          <button
                            onClick={() => actions.onView(row)}
                            title="View"
                            className="p-1.5 rounded-lg transition-colors hover:text-teal-400 hover:bg-teal-600/10"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <Eye size={15} />
                          </button>
                        )}
                        {actions.onEdit && (
                          <button
                            onClick={() => actions.onEdit(row)}
                            title="Edit"
                            className="p-1.5 rounded-lg transition-colors hover:text-brass-400 hover:bg-brass-500/10"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                        {actions.extra?.map((ex, ei) => (
                          <button
                            key={ei}
                            onClick={() => ex.onClick(row)}
                            title={ex.label}
                            className={`p-1.5 rounded-lg transition-colors ${ex.color || ''}`}
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {typeof ex.icon === 'function' ? ex.icon(row) : ex.icon}
                          </button>
                        ))}
                        {actions.onDelete && (
                          <button
                            onClick={() => actions.onDelete(row)}
                            title="Delete"
                            className="p-1.5 rounded-lg transition-colors hover:text-brick-400 hover:bg-brick-600/10"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
