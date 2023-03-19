import React from 'react';

import { Grid, Stack, Typography, Box, Container, Link } from '@mui/material';

const DataStore = () => {
  return (
    <>
      <Box
        sx={{
          // backgroundColor: '#0C0B0B',
          color: 'white',

          mt: 20,
          mb: 20,
        }}
      >
        <Container maxWidth="lg" sx={{ height: '40vh' }}>
          <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '32px', fontWeight: 'bold' }}>
            So when you upload your data, it goes to 7 places for 540 days!{' '}
          </Typography>

          <Stack direction="row" spacing={8} sx={{ position: 'relative' }} justifyContent="center" alignItems="center">
            <Box
              sx={{ border: '1px solid #62EEDD', background: '#070707', p: 5, mt: 5, width: '25rem', position: 'absolute', top: 20, left: 0 }}
              className=" shadow-md shadow-emerald"
            >
              <Stack direction="column" spacing={3} justifyContent="center" alignItems="center">
                <Typography variant="body2" sx={{ color: 'white', mt: '0px', fontSize: '28px', fontWeight: 'bold' }}>
                  Estuary IPFS node
                </Typography>

                <Typography variant="body2" sx={{ color: 'white', mt: '6px', fontSize: '20px', fontWeight: 'regular', opacity: '0.9', lineHeight: '2.0rem', textAlign: 'center' }}>
                  This is like a hot cache! You can retrieve your data from any public IPFS gateway
                </Typography>

                <Link href="https://shuttle-1.estuary.tech/gw/ipfs/QmPBHAjRLZqvJwcBUTiVxNtvugToAnTyJxpzTCgKZVHsvw/" underline="none">
                  <Typography
                    variant="body2"
                    sx={{}}
                    className="text-emerald border-2 rounded-sm text-center border-emerald bg-black py-1 text-lg font-bold items-center w-56 hover:scale-105  transition-transform "
                  >
                    Pinning example
                  </Typography>
                </Link>

                <Link underline="none" href="https://estuary.tech/verify-cid?cid=QmPBHAjRLZqvJwcBUTiVxNtvugToAnTyJxpzTCgKZVHsvw">
                  <Typography
                    variant="body2"
                    sx={{}}
                    className="text-emerald border-2 rounded-sm text-center border-emerald hover:scale-105  transition-transform bg-black py-1 text-lg font-bold items-center w-56"
                  >
                    Reciept example
                  </Typography>
                </Link>
              </Stack>
            </Box>

            {/* card 2 */}
            <Box
              sx={{ border: '1px solid #62EEDD', background: '#070707', p: 2, mt: 5, width: '40rem', height: '30vh', position: 'absolute', top: '3.8rem', right: 0 }}
              className=" shadow-md shadow-emerald"
            >
              <Stack direction="column" spacing={5} justifyContent="center" alignItems="center">
                <Typography variant="body2" sx={{ color: 'white', mt: '16px', fontSize: '28px', fontWeight: 'bold' }}>
                  Filecoin Storage Provider
                </Typography>

                <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
                  <Link underline="none" href="https://estuary.tech/providers/stats/f01345523">
                    <Typography
                      variant="body2"
                      sx={{}}
                      className="text-emerald border-2 rounded-sm text-center border-emerald hover:scale-105  transition-transform bg-black py-1 text-lg font-bold items-center w-56"
                    >
                      Provider 1
                    </Typography>
                  </Link>

                  <Link underline="none" href="https://estuary.tech/providers/stats/f01392893">
                    <Typography
                      variant="body2"
                      sx={{}}
                      className="text-emerald border-2 rounded-sm text-center border-emerald hover:scale-105  transition-transform bg-black py-1 text-lg font-bold items-center w-56"
                    >
                      Provider 2
                    </Typography>
                  </Link>
                </Stack>

                <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
                  <Link underline="none" href="https://estuary.tech/providers/stats/f022352">
                    <Typography
                      variant="body2"
                      sx={{}}
                      className="text-emerald border-2 rounded-sm text-center border-emerald hover:scale-105  transition-transform bg-black py-1 text-lg font-bold items-center w-56"
                    >
                      Provider 3
                    </Typography>
                  </Link>

                  <Link underline="none" href="https://estuary.tech/providers/stats/f01096124">
                    <Typography
                      variant="body2"
                      sx={{}}
                      className="text-emerald border-2 rounded-sm text-center border-emerald hover:scale-105  transition-transform bg-black py-1 text-lg font-bold items-center w-56"
                    >
                      Provider 4
                    </Typography>
                  </Link>
                </Stack>

                <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
                  <Link underline="none" href="https://estuary.tech/providers/stats/f01199442">
                    <Typography
                      variant="body2"
                      sx={{}}
                      className="text-emerald border-2 rounded-sm text-center border-emerald hover:scale-105  transition-transform bg-black py-1 text-lg font-bold items-center w-56"
                    >
                      Provider 5
                    </Typography>
                  </Link>

                  <Link underline="none" href="https://estuary.tech/providers/stats/f0763337">
                    <Typography
                      variant="body2"
                      sx={{}}
                      className="text-emerald border-2 rounded-sm text-center border-emerald hover:scale-105  transition-transform bg-black py-1 text-lg font-bold items-center w-56"
                    >
                      Provider 6
                    </Typography>
                  </Link>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default DataStore;
