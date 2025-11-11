import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import type { Row, Column } from '@/types'

export function exportToCsv(rows: Row[], columns: Column[], filename = 'table-export.csv') {
  
  const visibleCols = columns.filter(c => c.visible)
  const header = visibleCols.map(c => c.label)
  const data = rows.map(r => visibleCols.map(c => r[c.key] ?? ''))

  
  const csv = Papa.unparse({
    fields: visibleCols.map(c => c.key),
    data: data,
  })

  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, filename)
}

export function parseCsvFile(file: File): Promise<Row[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,         
      skipEmptyLines: true, 
      complete: (results: Papa.ParseResult<any>) => {
        if (results.errors && results.errors.length) {
          reject(results.errors)
        } else {
          const rows = (results.data as any[]).map((r) => ({
            id: r.id ?? undefined, 
            ...r
          }))
          resolve(rows)
        }
      },
      error: (err) => reject(err),
    })
  })
}
