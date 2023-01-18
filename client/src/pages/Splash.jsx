import { Box, Button, FormControl, Input, InputLabel, Link, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'

export default function Splash() {

    const [hasAccount, setHasAccount] = useState(false);

  return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center"}}>
          <Box sx={{flex: 1, height: "100%", backgroundColor: "primary.main", display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Typography variant="h1">Chiffchaff</Typography>
          </Box>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", flexDirection: "column" }}>
              {hasAccount ? 
                  <>
                <Typography variant="h2">Login</Typography>
                <form>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                            <FormControl sx={{marginTop: "10px"}}>
                                <InputLabel htmlFor='username'>Username</InputLabel>
                                <Input autoComplete required type="username" id="username" />
                            </FormControl>
                            <FormControl sx={{marginTop: "10px"}}>
                                <InputLabel htmlFor='password'>Password</InputLabel>
                                <Input autoComplete required type="password" id="password" />
                        </FormControl>
                      <Button type="submit" variant='contained' sx={{ alignSelf: "flex-end", margin: "10px 0" }}>Login</Button>
                      <Link onClick={() => setHasAccount(false)}>Need an account? Sign up.</Link>
                    </Box>
                </form>
                  </>
                  :
                  <>
                <Typography variant="h2">Sign Up</Typography>
                <form>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                            <FormControl>
                                <InputLabel htmlFor='email'>Email address</InputLabel>
                                <Input autoComplete autoFocus required type="email" id="email" />
                            </FormControl>
                            <FormControl sx={{marginTop: "10px"}}>
                                <InputLabel htmlFor='username'>Username</InputLabel>
                                <Input autoComplete required type="username" id="username" />
                            </FormControl>
                            <FormControl sx={{marginTop: "10px"}}>
                                <InputLabel htmlFor='password'>Password</InputLabel>
                                <Input autoComplete required type="password" id="password" />
                        </FormControl>
                      <Button type="submit" variant='contained' sx={{ alignSelf: "flex-end", margin: "10px 0" }}>Sign up</Button>
                      <Link onClick={() => setHasAccount(true)}>Already have an account? Login.</Link>
                    </Box>
                </form>
                  </>
              }
          </Box>
    </Box>
  )
}
