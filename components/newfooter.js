import { Box, Container, Divider, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';

import NextLink from 'next/link';

const sections = [
  {
    title: 'Menu',
    items: [
      {
        title: 'Begin a Race',
        path: 'paths.dashboard.races.raceOne',
      },
      {
        title: 'Github',
        path: 'https://github.com/Keyrxng/GhostsOfEpochsPast',
      },
    ],
  },
  {
    title: 'Resources',
    items: [
      {
        title: 'Web3 Security DAO',
        path: 'https://www.web3securitydao.xyz/collaborating/resources',
      },
      {
        title: 'Web3 Security Lib',
        path: 'https://github.com/immunefi-team/Web3-Security-Library',
      },
      {
        title: 'DeFi Hack Labs',
        path: 'https://github.com/SunWeb3Sec/DeFiHackLabs',
      },
    ],
  },
  {
    title: 'Tools',
    items: [
      {
        title: 'TX Street',
        path: 'https://txstreet.com/v/eth',
      },
      {
        title: 'Phalcon',
        path: 'https://blocksec.com/phalcon',
      },
      {
        title: 'Eth Signature Database',
        path: 'https://www.4byte.directory/',
      },
    ],
  },
];

export const NewFooter = (props) => (
  <Box
    sx={{
      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50'),
      borderTopColor: 'divider',
      borderTopStyle: 'solid',
      borderTopWidth: 1,
      pb: 6,
      pt: {
        md: 15,
        xs: 6,
      },
    }}
    {...props}
  >
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid
          xs={12}
          sm={4}
          md={3}
          sx={{
            order: {
              xs: 4,
              md: 1,
            },
          }}
        >
          <Stack spacing={1}>
            {/* <Stack alignItems="center" component={NextLink} direction="row" display="inline-flex" href={paths.index} spacing={1} sx={{ textDecoration: 'none' }}> */}
            <Stack alignItems="center" component={NextLink} direction="row" display="inline-flex" spacing={1} sx={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  height: 24,
                  width: 24,
                }}
              >
                {/* <img src="/LogoGoEP-Shild.png" /> */}
              </Box>
              <Box
                sx={{
                  color: 'text.primary',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: '0.3px',
                  lineHeight: 2.5,
                  '& span': {
                    color: 'primary.main',
                  },
                }}
              >
                Ghosts Of <span>Epochs</span> Past
              </Box>
            </Stack>
            <Typography
              color="text.secondary"
              variant="caption"

              // sx={{
              //   ":hover": {
              //     scale: "1.1",
              //     transition: "all 0.3s ease-in-out",
              //     transitionDuration: "300ms",
              //   },
              // }}
            >
              Security is a process, not a product.
            </Typography>
          </Stack>
        </Grid>
        {sections.map((section, index) => (
          <Grid
            key={section.title}
            xs={12}
            sm={4}
            md={3}
            sx={{
              order: {
                md: index + 2,
                xs: index + 1,
              },
            }}
          >
            <Typography color="text.secondary" variant="overline">
              {section.title}
            </Typography>
            <Stack
              component="ul"
              spacing={1}
              sx={{
                listStyle: 'none',
                m: 0,
                p: 0,
              }}
            >
              {section.items.map((item) => (
                <Stack alignItems="center" direction="row" key={item.title} spacing={2}>
                  <Box
                    sx={{
                      backgroundColor: '#5260CD',
                      height: 2,
                      width: 12,
                      color: '#5260CD',
                    }}
                  />
                  <NextLink
                    // href={item.path}
                    href=""
                    variant="subtitle2"
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                    style={{
                      color: '#5260CD',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '14px',
                      transition: 'transform 0.2s ease-in-out',
                      transitionDuration: '200ms',
                    }}
                  >
                    {item.title}
                  </NextLink>
                </Stack>
              ))}
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);
