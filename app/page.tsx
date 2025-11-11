'use client'

import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Container,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/hooks'
import { addRow } from '@/store/tableSlice'
import type { Row } from '@/types'

import DataTable from '@/components/DataTable'
import SearchBar from '@/components/SearchBar'
import ImportExportButtons from '@/components/ImportExportButtons'
import ManageColumnsModal from '@/components/ManageColumnsModal'

export default function Page() {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState<Omit<Row, 'id'>>({
    name: '',
    email: '',
    age: null,
    role: '',
  })

  const handleAdd = () => {
    if (!formData.name || !formData.email) {
      alert('Name and Email are required!')
      return
    }

    const newRow: Row = {
      id: uuidv4(),
      name: formData.name,
      email: formData.email,
      age: formData.age ? Number(formData.age) : null,
      role: formData.role || '',
    }

    dispatch(addRow(newRow))
    setFormData({ name: '', email: '', age: null, role: '' })
    setOpen(false)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* ===== Toolbar Section ===== */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={isMobile ? 1.5 : 2}
        alignItems={isMobile ? 'stretch' : 'center'}
        justifyContent="space-between"
        mb={3}
      >
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={isMobile ? 1.5 : 2}
          alignItems={isMobile ? 'stretch' : 'center'}
          flexWrap="wrap"
          width="100%"
        >
          <SearchBar />
          <Button variant="outlined" onClick={() => setOpen(true)} fullWidth={isMobile}>
            + Add Row
          </Button>
          <ImportExportButtons />
          <ManageColumnsModal />
        </Stack>
      </Stack>

      {/* ===== Data Table ===== */}
      <Box
        sx={{
          overflowX: 'auto',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          p: 1,
        }}
      >
        <DataTable />
      </Box>

      {/* ===== Add Row Dialog ===== */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={isMobile ? 'xs' : 'sm'}
      >
        <DialogTitle>Add New Row</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Age"
              type="number"
              value={formData.age ?? ''}
              onChange={(e) => setFormData({ ...formData, age: e.target.value ? Number(e.target.value) : null })}
              fullWidth
            />
            <TextField
              label="Role"
              value={formData.role ?? ''}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
