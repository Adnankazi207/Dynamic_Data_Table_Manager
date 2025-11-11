'use client'

import React, { useRef, useState } from 'react'
import { Button, Snackbar, Alert } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'
import { parseCsvFile, exportToCsv } from '@/utils/csv'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { replaceAllRows } from '@/store/tableSlice'
import { v4 as uuidv4 } from 'uuid'
import type { Row } from '@/types'

export default function ImportExportButtons() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useAppDispatch()
  const rows = useAppSelector((s) => s.table.rows)
  const columns = useAppSelector((s) => s.table.columns)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  })

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false })

  // CSV Import
  async function handleImport(ev?: React.ChangeEvent<HTMLInputElement>) {
    const file = ev?.target?.files?.[0]
    if (!file) return

    try {
      const parsed = await parseCsvFile(file)
      const normalized: Row[] = parsed.map((r: any) => ({
        id: r.id ?? uuidv4(),
        ...r,
      }))

      dispatch(replaceAllRows(normalized))
      setSnackbar({ open: true, message: '✅ CSV imported successfully!', severity: 'success' })
    } catch (err) {
      console.error('CSV parse error', err)
      setSnackbar({ open: true, message: '❌ Error parsing CSV. Please check your file format.', severity: 'error' })
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  // CSV Export
  function handleExport() {
    try {
      exportToCsv(rows, columns)
      setSnackbar({ open: true, message: '📁 CSV exported successfully!', severity: 'success' })
    } catch (err) {
      console.error('Export error', err)
      setSnackbar({ open: true, message: '❌ Failed to export CSV.', severity: 'error' })
    }
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleImport}
        />

        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={() => inputRef.current?.click()}
        >
          Import CSV
        </Button>

        {/* Export Button */}
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </div>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
