import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Row, Column } from '../types'
import { v4 as uuidv4 } from 'uuid'

type TableState = {
  rows: Row[]
  columns: Column[]
  sort: { key: string | null; direction: 'asc' | 'desc' | null }
  searchQuery: string
  editingRowIds: string[] 
}

const initialColumns: Column[] = [
  { key: 'name', label: 'Name', visible: true, sortable: true },
  { key: 'email', label: 'Email', visible: true, sortable: true },
  { key: 'age', label: 'Age', visible: true, sortable: true },
  { key: 'role', label: 'Role', visible: true, sortable: true },
]

const initialState: TableState = {
  rows: [
    { id: uuidv4(), name: 'Alice', email: 'alice@example.com', age: 28, role: 'Student' },
    { id: uuidv4(), name: 'Bob', email: 'bob@example.com', age: 32, role: 'Teacher' },
  ],
  columns: initialColumns,
  sort: { key: null, direction: null },
  searchQuery: '',
  editingRowIds: [],
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<Row[]>) {
      state.rows = action.payload
    },
    addRow(state, action: PayloadAction<Row>) {
      state.rows.unshift(action.payload)
    },
    updateRow(state, action: PayloadAction<{ id: string; changes: Partial<Row> }>) {
      const idx = state.rows.findIndex((r) => r.id === action.payload.id)
      if (idx >= 0) state.rows[idx] = { ...state.rows[idx], ...action.payload.changes }
    },
    deleteRow(state, action: PayloadAction<string>) {
      state.rows = state.rows.filter((r) => r.id !== action.payload)
    },
    setColumns(state, action: PayloadAction<Column[]>) {
      state.columns = action.payload
    },
    toggleColumnVisibility(state, action: PayloadAction<{ key: string; visible: boolean }>) {
      const col = state.columns.find((c) => c.key === action.payload.key)
      if (col) col.visible = action.payload.visible
    },
    addColumn(state, action: PayloadAction<Column>) {
      state.columns.push(action.payload)
    },
    setSort(state, action: PayloadAction<{ key: string | null; direction: 'asc' | 'desc' | null }>) {
      state.sort = action.payload
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    startEditingRow(state, action: PayloadAction<string>) {
      if (!state.editingRowIds.includes(action.payload)) state.editingRowIds.push(action.payload)
    },
    stopEditingRow(state, action: PayloadAction<string>) {
      state.editingRowIds = state.editingRowIds.filter((id) => id !== action.payload)
    },
    clearAllEdits(state) {
      state.editingRowIds = []
    },
    replaceAllRows(state, action: PayloadAction<Row[]>) {
      state.rows = action.payload
    }
  }
})

export const {
  setRows, addRow, updateRow, deleteRow, setColumns, toggleColumnVisibility, addColumn,
  setSort, setSearchQuery, startEditingRow, stopEditingRow, clearAllEdits, replaceAllRows
} = tableSlice.actions

export default tableSlice.reducer
