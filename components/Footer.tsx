import React from 'react';

import { Link, Stack, Typography, Box, Container } from '@mui/material';

const Footer = () => {
  return (
    <>
      <Box
        sx={{
          // backgroundColor: '#0C0B0B',
          color: 'white',
          position: 'relative',
          background: 'linear-gradient(90deg, #000000 50%, rgba(98, 238, 221, 0.3) 100%)',
          p: 5,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={5}>
            <Stack direction="column" spacing={3}>
              <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '28px', fontWeight: 'bold' }}>
                Estuary
              </Typography>

              <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '16px', opacity: '0.9' }}>
                If you choose to use Estuary you agree to our
                <a className=" text-emerald underline" href="https://docs.estuary.tech/terms/">
                  {' '}
                  Terms of Service.
                </a>
              </Typography>
            </Stack>

            <Stack direction="column" spacing={2}>
              <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px' }}>
                Links
              </Typography>

              <Link className="hover:scale-105  transition-transform" sx={{ color: '#62EEDD', px: 2, mt: '6px', fontSize: '14px', fontWeight: 'regular' }} underline="none">
                Documentation
              </Link>

              <Link className="hover:scale-105  transition-transform" sx={{ color: '#62EEDD', px: 2, mt: '6px', fontSize: '14px', fontWeight: 'regular' }} underline="none">
                Verify
              </Link>

              <Link className="hover:scale-105  transition-transform" sx={{ color: '#62EEDD', px: 2, mt: '6px', fontSize: '14px', fontWeight: 'regular' }} underline="none">
                Sign in
              </Link>
            </Stack>

            <Stack direction="column" spacing={2}>
              <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px' }}>
                Links
              </Typography>

              <Link className="hover:scale-105  transition-transform" sx={{ color: '#62EEDD', px: 2, mt: '6px', fontSize: '14px' }} underline="none">
                Documentation
              </Link>

              <Link className="hover:scale-105  transition-transform" sx={{ color: '#62EEDD', px: 2, mt: '6px', fontSize: '14px' }} underline="none">
                Verify
              </Link>

              <Link className="hover:scale-105  transition-transform" sx={{ color: '#62EEDD', px: 2, mt: '6px', fontSize: '14px' }} underline="none">
                Sign in
              </Link>
            </Stack>

            <Stack direction="column" spacing={2}>
              <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px' }}>
                Links
              </Typography>

              <Link className="hover:scale-105  transition-transform" sx={{ color: '#62EEDD', px: 2, mt: '6px', fontSize: '14px' }} underline="none">
                Documentation
              </Link>

              <Link className="hover:scale-105  transition-transform" sx={{ color: '#62EEDD', px: 2, mt: '6px', fontSize: '14px' }} underline="none">
                Verify
              </Link>

              <Link className="hover:scale-105  transition-transform" sx={{ color: '#62EEDD', px: 2, mt: '6px', fontSize: '14px' }} underline="none">
                Sign in
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
