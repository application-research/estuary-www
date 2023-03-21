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
          background: 'linear-gradient(90deg, #000000 50%, #001A06 100%)',
          p: 5,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" spacing={5}>
            <Stack direction="column" spacing={3}>
              <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '28px', fontWeight: 'bold' }}>
                Estuary
              </Typography>

              <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '16px', opacity: '0.9' }}>
                If you choose to use Estuary you agree to our
                <Link className=" text-secondary underline hover:scale-105  transition-transform" href="https://docs.estuary.tech/terms/">
                  {' '}
                  Terms of Service.
                </Link>
              </Typography>
            </Stack>

            <Stack direction="column" spacing={2}>
              <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px' }}>
                Links
              </Typography>

              <Link
                target="_blank"
                href="https://docs.estuary.tech/"
                className="hover:scale-105  transition-transform"
                sx={{ color: '#0BFF48', px: 2, mt: '6px', fontSize: '14px', fontWeight: 'regular' }}
                underline="none"
              >
                Documentation
              </Link>

              <Link
                href="./verify-cid"
                target="_blank"
                className="hover:scale-105  transition-transform"
                sx={{ color: '#0BFF48', px: 2, mt: '6px', fontSize: '14px', fontWeight: 'regular' }}
                underline="none"
              >
                Verify
              </Link>

              <Link
                href="./sign-up"
                target="_blank"
                className="hover:scale-105  transition-transform"
                sx={{ color: '#0BFF48', px: 2, mt: '6px', fontSize: '14px', fontWeight: 'regular' }}
                underline="none"
              >
                Sign up
              </Link>
            </Stack>

            <Stack direction="column" spacing={2}>
              <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px' }}>
                Resources
              </Typography>

              <Link
                href="https://github.com/application-research/estuary-www"
                target="_blank"
                className="hover:scale-105  transition-transform"
                sx={{ color: '#0BFF48', px: 2, mt: '6px', fontSize: '14px' }}
                underline="none"
              >
                Github
              </Link>

              <Link
                href="https://fw.services/"
                target="_blank"
                className="hover:scale-105  transition-transform"
                sx={{ color: '#0BFF48', px: 2, mt: '6px', fontSize: '14px' }}
                underline="none"
              >
                Roadmap
              </Link>
            </Stack>

            <Stack direction="column" spacing={2}>
              <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px' }}>
                Socials
              </Typography>

              <Link
                href="https://filecoinproject.slack.com/join/shared_invite/zt-1mx9d08sj-Xo4pRqDQBeuVQyTUFPty5w#/shared-invite/email"
                target="_blank"
                className="hover:scale-105  transition-transform"
                sx={{ color: '#0BFF48', px: 2, mt: '6px', fontSize: '14px' }}
                underline="none"
              >
                Slack
              </Link>

              <Link
                href="https://twitter.com/estuary_tech"
                target="_blank"
                className="hover:scale-105  transition-transform"
                sx={{ color: '#0BFF48', px: 2, mt: '6px', fontSize: '14px' }}
                underline="none"
              >
                Twitter
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
