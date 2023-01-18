import { AppBar, Box, Typography } from '@mui/material'
import { AccountCircle, Logout } from '@mui/icons-material'
import React from 'react'

export default function Header() {
  return (
    <AppBar enableColorOnDark position='sticky' sx={{ width: "100vw", display: "flex", flexDirection: "row" }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h3">Chiffchaff</Typography>
      </Box>
      <Box sx={{ flex: 2, alignSelf: "center", display: "flex", justifyContent: "flex-end" }}>
        <AccountCircle />
        <Logout />
      </Box>
    </AppBar>
  )
}
