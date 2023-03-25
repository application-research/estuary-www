import { Stack, Typography, Box, Container } from '@mui/material';
import React from 'react';

const EstuaryData = () => {
  const arrayData = [{ text: '', number: '' }];
  return (
    <>
      <Box
        sx={{
          // backgroundColor: '#0C0B0B',
          color: 'white',
          position: 'relative',
          mt: 10,
          mb: 10,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '32px', fontWeight: 'bold' }}>
            Okay , but how much data has been uploaded using your service ?
          </Typography>

          <Box sx={{ background: 'linear-gradient(90deg, #000000 50%, rgba(98, 238, 221, 0.5) 100%)', p: 4, mt: 5 }}>
            <Stack direction="column" spacing={6} sx={{}}>
              <Stack direction="row" spacing={10} sx={{}} alignContent="center" justifyContent="center">
                <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px', fontWeight: 'bold' }}>
                  successful Filecoin storage deals
                </Typography>

                <Typography variant="body2" sx={{}} className=" text-white border-2 rounded-sm border-emerald bg-black shadow-md shadow-emerald  px-6 py-1 text-lg font-bold">
                  137,432
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default EstuaryData;
