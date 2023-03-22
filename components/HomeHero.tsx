import React from 'react';
import { Box, Container, duration, Stack, Tab, Tabs, Typography, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
const HomeHero = () => {
  const mainPrimary = `#0BFF48`;
  const darkGreen = `#0A7225`;
  return (
    <>
      <Box
        sx={{
          //   border: "2px solid red",

          backgroundColor: 'transparent',
          position: 'relative',
          zIndex: 1,
          mb: 10,
          mt: 20,
          height: '50vh',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',

            backgroundColor: 'transparent',
            mt: 15,
          }}
        >
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={4} sx={{ maxWidth: '70%' }}>
            <h2 className="text-3xl leading-snug text-white items-center font-bold lg:leading-snug lg:text-5xl  ">
              A reliable way to upload public data onto Filecoin and pin it to IPFS
            </h2>

            <p className="text-xl lg:text-2xl lg:leading-relaxed text-white items-center opacity-95  leading-relaxed">
              Store your public data and guarantee that it is available to everyone around the world. Our technology will restore lost data and guarantee data replication
            </p>

            <Stack direction="row" justifyContent="between" alignItems="center" spacing={8}>
              {/* <div className="text-md border-2 border-neon text-emerald px-6 py-2   hover:scale-105 transition ease-in duration-150">Get Api Key</div> */}
              <Link href="https://docs.estuary.tech/get-invite-key" underline="none" target="_blank" rel="noopener">
                <Typography
                  variant="body2"
                  sx={{
                    border: `2px solid ${darkGreen}`,
                    color: mainPrimary,
                    px: 4,
                    py: 1,

                    transition: 'ease-in-out',
                    transitionDuration: '300ms',
                    fontSize: '16px',
                    fontWeight: 'bold',

                    '&:hover': {
                      transition: 'ease-in-out',
                      transitionDuration: '300ms',

                      backgroundColor: mainPrimary,
                      color: 'black',
                      border: `2px solid ${mainPrimary}`,
                    },
                  }}
                >
                  Get Api Key
                </Typography>
              </Link>

              <Link href="https://docs.estuary.tech" underline="none" target="_blank" rel="noopener">
                <Typography
                  variant="body2"
                  sx={{
                    border: `2px solid ${darkGreen}`,
                    color: '#0BFF48',
                    px: 4,
                    py: 1,

                    transition: 'ease-in-out',
                    transitionDuration: '300ms',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    '&:hover': {
                      transition: 'ease-in-out',
                      transitionDuration: '300ms',

                      backgroundColor: '#0BFF48',
                      color: 'black',
                      border: `2px solid ${mainPrimary}`,
                    },
                  }}
                >
                  View Docs
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default HomeHero;
