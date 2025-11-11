import React from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useAppDispatch, useAppSelector } from '@/hooks' 
import { setSearchQuery } from '@/store/tableSlice'

export default function SearchBar() {
  const dispatch = useAppDispatch()
  const query = useAppSelector((s) => s.table.searchQuery)

  return (
    <TextField
      value={query}
      placeholder="Search all fields..."
      size="small"
      onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: query ? (
          <InputAdornment position="end">
            <IconButton onClick={() => dispatch(setSearchQuery(''))} size="small">
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : null
      }}
    />
  )
}
