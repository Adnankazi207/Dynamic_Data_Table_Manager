'use client'

import React, { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControlLabel, Checkbox, TextField, Box
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { toggleColumnVisibility, addColumn } from '@/store/tableSlice'
import { Column } from '../types'
import { v4 as uuidv4 } from 'uuid'

export default function ManageColumnsModal() {
  const [open, setOpen] = useState(false)
  const columns = useAppSelector(s => s.table.columns)
  const dispatch = useAppDispatch()
  const { register, handleSubmit, reset } = useForm<{ key: string; label: string }>()

  function onToggle(key: string, checked: boolean) {
    dispatch(toggleColumnVisibility({ key, visible: checked }))
  }

  function onAdd(data: { key: string; label: string }) {
    const key = data.key.trim()
    if (!key) return
    const newCol: Column = { key, label: data.label || data.key, visible: true, sortable: true }
    dispatch(addColumn(newCol))
    reset()
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Manage Columns
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Manage Columns</DialogTitle>
        <DialogContent>
          {columns.map((c) => (
            <FormControlLabel
              key={c.key}
              control={<Checkbox checked={c.visible} onChange={(e) => onToggle(c.key, e.target.checked)} />}
              label={`${c.label} (${c.key})`}
            />
          ))}
          <Box
            component="form"
            onSubmit={handleSubmit(onAdd)}
            sx={{ mt: 2, display: 'flex', gap: 1 }}
          >
            <TextField
              {...register('key', { required: true })}
              size="small"
              placeholder="field key (eg: department)"
            />
            <TextField
              {...register('label')}
              size="small"
              placeholder="label (eg: Department)"
            />
            <Button type="submit" variant="contained">
              Add
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
