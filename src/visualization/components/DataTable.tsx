import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@/styles/design-tokens';

const TableContainer = styled('div', {
  width: '100%',
  backgroundColor: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',
  overflow: 'hidden',
});

const TableWrapper = styled('div', {
  overflowX: 'auto',
  overflowY: 'auto',
  maxHeight: '600px',
  
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  
  '&::-webkit-scrollbar-track': {
    background: '$bgElevated',
  },
  
  '&::-webkit-scrollbar-thumb': {
    background: '$border',
    borderRadius: '$sm',
    
    '&:hover': {
      background: '$borderAccent',
    },
  },
});

const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '$sm',
});

const TableHead = styled('thead', {
  position: 'sticky',
  top: 0,
  backgroundColor: '$bgElevated',
  zIndex: 10,
  
  '&::after': {
    content: '',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    backgroundColor: '$border',
  },
});

const TableBody = styled('tbody', {});

const TableRow = styled(motion.tr, {
  transition: 'background-color 0.2s',
  
  '&:hover': {
    backgroundColor: 'rgba(0, 209, 255, 0.05)',
  },
  
  '&:not(:last-child)': {
    borderBottom: '1px solid $border',
  },
});

const TableHeader = styled('th', {
  padding: '$3 $4',
  textAlign: 'left',
  fontWeight: '$semibold',
  color: '$text',
  userSelect: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  
  '&:hover': {
    backgroundColor: 'rgba(0, 209, 255, 0.08)',
  },
  
  variants: {
    sortable: {
      true: {
        cursor: 'pointer',
      },
      false: {
        cursor: 'default',
      },
    },
    sorted: {
      true: {
        color: '$accent',
      },
    },
  },
});

const TableCell = styled('td', {
  padding: '$3 $4',
  color: '$textMuted',
  
  variants: {
    numeric: {
      true: {
        textAlign: 'right',
        fontFamily: '$mono',
      },
    },
    highlight: {
      true: {
        color: '$accent',
        fontWeight: '$semibold',
      },
    },
  },
});

const SortIndicator = styled('span', {
  marginLeft: '$2',
  fontSize: '$xs',
  color: '$accent',
});

const FilterInput = styled('input', {
  width: '100%',
  padding: '$2 $3',
  backgroundColor: '$bgElevated',
  border: '1px solid $border',
  borderRadius: '$sm',
  color: '$text',
  fontSize: '$sm',
  
  '&:focus': {
    outline: 'none',
    borderColor: '$accent',
  },
  
  '&::placeholder': {
    color: '$textDim',
  },
});

const Toolbar = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$4',
  borderBottom: '1px solid $border',
  gap: '$4',
});

const ToolbarSection = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
});

const Pagination = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  padding: '$4',
  borderTop: '1px solid $border',
});

const PaginationButton = styled('button', {
  padding: '$2 $3',
  backgroundColor: 'transparent',
  border: '1px solid $border',
  borderRadius: '$sm',
  color: '$text',
  fontSize: '$xs',
  cursor: 'pointer',
  transition: 'all 0.2s',
  
  '&:hover': {
    backgroundColor: '$bgElevated',
    borderColor: '$accent',
  },
  
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  
  variants: {
    active: {
      true: {
        backgroundColor: '$accent',
        borderColor: '$accent',
        color: '$bg',
      },
    },
  },
});

const Badge = styled('span', {
  padding: '$1 $2',
  borderRadius: '$sm',
  fontSize: '$xs',
  fontWeight: '$semibold',
  
  variants: {
    variant: {
      success: {
        backgroundColor: 'rgba(46, 230, 166, 0.15)',
        color: '$success',
      },
      warning: {
        backgroundColor: 'rgba(255, 181, 71, 0.15)',
        color: '$warning',
      },
      danger: {
        backgroundColor: 'rgba(255, 107, 107, 0.15)',
        color: '$danger',
      },
      info: {
        backgroundColor: 'rgba(0, 209, 255, 0.15)',
        color: '$accent',
      },
    },
  },
});

export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  numeric?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  pageSize?: number;
  searchable?: boolean;
  exportable?: boolean;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  pageSize = 10,
  searchable = true,
  exportable = false,
  selectable = false,
  onRowClick,
  onSelectionChange,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<any>>(new Set());

  const handleSort = useCallback((columnKey: string) => {
    if (sortKey === columnKey) {
      setSortDirection(prev => {
        if (prev === 'asc') return 'desc';
        if (prev === 'desc') return null;
        return 'asc';
      });
    } else {
      setSortKey(columnKey);
      setSortDirection('asc');
    }
  }, [sortKey]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (filterText) {
      const searchLower = filterText.toLowerCase();
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal === bVal) return 0;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, columns, filterText, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const handleRowSelect = useCallback((rowKey: any) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowKey)) {
        newSet.delete(rowKey);
      } else {
        newSet.add(rowKey);
      }
      
      if (onSelectionChange) {
        const selected = data.filter(row => newSet.has(row[keyField]));
        onSelectionChange(selected);
      }
      
      return newSet;
    });
  }, [data, keyField, onSelectionChange]);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    } else {
      const allKeys = new Set(paginatedData.map(row => row[keyField]));
      setSelectedRows(allKeys);
      if (onSelectionChange) onSelectionChange(paginatedData);
    }
  }, [paginatedData, selectedRows.size, keyField, onSelectionChange]);

  const exportToCSV = useCallback(() => {
    const headers = columns.map(col => col.label).join(',');
    const rows = filteredAndSortedData.map(row =>
      columns.map(col => {
        const value = row[col.key];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'export.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [columns, filteredAndSortedData]);

  return (
    <TableContainer>
      <Toolbar>
        <ToolbarSection>
          {searchable && (
            <FilterInput
              type="text"
              placeholder="Search..."
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
            />
          )}
          
          {selectedRows.size > 0 && (
            <Badge variant="info">
              {selectedRows.size} selected
            </Badge>
          )}
        </ToolbarSection>

        <ToolbarSection>
          {exportable && (
            <PaginationButton onClick={exportToCSV}>
              Export CSV
            </PaginationButton>
          )}
          
          <span style={{ fontSize: '12px', color: '#9AA4B2' }}>
            {filteredAndSortedData.length} rows
          </span>
        </ToolbarSection>
      </Toolbar>

      <TableWrapper>
        <Table>
          <TableHead>
            <tr>
              {selectable && (
                <TableHeader style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableHeader>
              )}
              
              {columns.map(column => (
                <TableHeader
                  key={column.key}
                  sortable={column.sortable !== false}
                  sorted={sortKey === column.key}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  {column.label}
                  {sortKey === column.key && sortDirection && (
                    <SortIndicator>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </SortIndicator>
                  )}
                </TableHeader>
              ))}
            </tr>
          </TableHead>

          <TableBody>
            <AnimatePresence mode="wait">
              {paginatedData.map((row, index) => {
                const rowKey = row[keyField];
                const isSelected = selectedRows.has(rowKey);

                return (
                  <TableRow
                    key={String(rowKey)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => onRowClick?.(row)}
                    style={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      backgroundColor: isSelected ? 'rgba(0, 209, 255, 0.1)' : undefined,
                    }}
                  >
                    {selectable && (
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleRowSelect(rowKey)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    
                    {columns.map(column => (
                      <TableCell
                        key={column.key}
                        numeric={column.numeric}
                      >
                        {column.render 
                          ? column.render(row[column.key], row)
                          : row[column.key]
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableWrapper>

      {totalPages > 1 && (
        <Pagination>
          <PaginationButton
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </PaginationButton>
          
          <PaginationButton
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationButton>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <PaginationButton
                key={pageNum}
                active={currentPage === pageNum}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </PaginationButton>
            );
          })}

          <PaginationButton
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationButton>
          
          <PaginationButton
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </PaginationButton>

          <span style={{ marginLeft: '16px', fontSize: '12px', color: '#9AA4B2' }}>
            Page {currentPage} of {totalPages}
          </span>
        </Pagination>
      )}
    </TableContainer>
  );
}