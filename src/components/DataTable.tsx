'use client'

import React, { useMemo, useState } from 'react'
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel,
  IconButton, TextField, Paper, Box, TableContainer, useMediaQuery, useTheme
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  setSort, updateRow, deleteRow, startEditingRow, stopEditingRow
} from '@/store/tableSlice'
import type { Row } from '@/types'
import PaginationControls from './PaginationControls'

function compare(a: any, b: any, direction: 'asc' | 'desc') {
  if (a == null) a = ''
  if (b == null) b = ''
  if (!isNaN(Number(a)) && !isNaN(Number(b))) {
    a = Number(a); b = Number(b)
  }
  if (a < b) return direction === 'asc' ? -1 : 1
  if (a > b) return direction === 'asc' ? 1 : -1
  return 0
}

export default function DataTable() {
  const dispatch = useAppDispatch()
  const rows = useAppSelector(s => s.table.rows)
  const columns = useAppSelector(s => s.table.columns)
  const sort = useAppSelector(s => s.table.sort)
  const searchQuery = useAppSelector(s => s.table.searchQuery)
  const editingRowIds = useAppSelector(s => s.table.editingRowIds)

  const [page, setPage] = useState(0)
  const rowsPerPage = 10
  const [edits, setEdits] = useState<Record<string, Partial<Row>>>({})

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const visibleCols = columns.filter(c => c.visible)

  const processedRows = useMemo(() => {
    let list = [...rows]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(r => visibleCols.some(c => String(r[c.key] ?? '').toLowerCase().includes(q)))
    }
    if (sort.key) {
      list.sort((a, b) => compare(a[sort.key!], b[sort.key!], sort.direction!))
    }
    return list
  }, [rows, searchQuery, sort, visibleCols])

  const pageCount = Math.ceil(processedRows.length / rowsPerPage)
  const paginatedRows = processedRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage)

  function handleSort(key: string) {
    let dir: 'asc' | 'desc' = 'asc'
    if (sort.key === key && sort.direction === 'asc') dir = 'desc'
    dispatch(setSort({ key, direction: dir }))
  }

  function onStartEdit(id: string) {
    dispatch(startEditingRow(id))
    setEdits(prev => ({ ...prev, [id]: { ...rows.find(r => r.id === id) } }))
  }

  function onCancelEdit(id: string) {
    dispatch(stopEditingRow(id))
    setEdits(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  function onSaveEdit(id: string) {
    const changes = edits[id] || {}
    dispatch(updateRow({ id, changes }))
    dispatch(stopEditingRow(id))
    setEdits(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  function onChangeEdit(id: string, key: string, value: any) {
    setEdits(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [key]: value } }))
  }

  function onDelete(id: string) {
    if (confirm('Delete this row?')) dispatch(deleteRow(id))
  }

  return (
    <Paper sx={{
      p: isMobile ? 1 : 2,
      width: '100%',
      overflow: 'hidden',
      borderRadius: 2,
      boxShadow: 2
    }}>
      <TableContainer sx={{
        overflowX: 'auto',
        maxHeight: isMobile ? 500 : 'none',
      }}>
        <Table
          stickyHeader
          size={isMobile ? 'small' : 'medium'}
          sx={{ minWidth: 600, whiteSpace: 'nowrap' }}
        >
          <TableHead>
            <TableRow>
              {visibleCols.map(col => (
                <TableCell key={col.key} sx={{ fontWeight: 600 }}>
                  {col.sortable ? (
                    <TableSortLabel
                      active={sort.key === col.key}
                      direction={sort.direction ?? 'asc'}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : col.label}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map(row => {
              const isEditing = editingRowIds.includes(row.id)
              return (
                <TableRow key={row.id} hover>
                  {visibleCols.map(col => (
                    <TableCell key={col.key} sx={{ py: isMobile ? 0.5 : 1 }}>
                      {isEditing ? (
                        <TextField
                          size="small"
                          variant="outlined"
                          value={(edits[row.id]?.[col.key] ?? row[col.key]) ?? ''}
                          onChange={(e) => onChangeEdit(row.id, col.key, e.target.value)}
                          sx={{ minWidth: isMobile ? 80 : 120 }}
                        />
                      ) : (
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: isMobile ? 90 : 150,
                          }}
                        >
                          {String(row[col.key] ?? '')}
                        </Box>
                      )}
                    </TableCell>
                  ))}

                  <TableCell>
                    {isEditing ? (
                      <>
                        <IconButton size="small" onClick={() => onSaveEdit(row.id)} title="Save"><SaveIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => onCancelEdit(row.id)} title="Cancel"><CancelIcon fontSize="small" /></IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton size="small" onClick={() => onStartEdit(row.id)} title="Edit"><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => onDelete(row.id)} title="Delete"><DeleteIcon fontSize="small" /></IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 1 : 0,
        }}
      >
        <Box sx={{ fontSize: '0.85rem', color: 'text.secondary', textAlign: isMobile ? 'center' : 'left' }}>
          Showing {processedRows.length} results
        </Box>
        <PaginationControls page={page} setPage={setPage} pageCount={pageCount} />
      </Box>
    </Paper>
  )
}
