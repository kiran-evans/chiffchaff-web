import { Box, Typography } from '@mui/material'
import React from 'react'

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex", flex: 1 }}>
      <Box sx={{ flex: 1, backgroundColor: "background.paper" }}>
        Chats
      </Box>
      <Box sx={{ flex: 2 }}>
        Messages
      </Box>
    </Box>
  )
}
