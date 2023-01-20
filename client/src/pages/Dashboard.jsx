import { Box } from '@mui/material'
import React from 'react'
import ContactsBar from './components/ContactsBar'

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex", flex: 1 }}>
      <Box sx={{ flex: 1, backgroundColor: "background.paper" }}>
        <ContactsBar />
      </Box>
      <Box sx={{ flex: 2 }}>
        Messages
      </Box>
    </Box>
  )
}
