'use client'
import React from 'react'
import { IconButton, Button, ButtonGroup } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function PaginationControls({ page, setPage, pageCount }:
  { page: number; setPage: (p: number) => void; pageCount: number }) {

  return (
    <div>
      <ButtonGroup variant="outlined" size="small">
        <IconButton onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}><ArrowBackIcon /></IconButton>
        <Button disabled>{page + 1} / {Math.max(1, pageCount)}</Button>
        <IconButton onClick={() => setPage(Math.min(pageCount - 1, page + 1))} disabled={page >= pageCount - 1}><ArrowForwardIcon /></IconButton>
      </ButtonGroup>
    </div>
  )
}
