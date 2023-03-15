import '@root/global.scss';

import * as React from 'react';
import '../styles/globals.css'
import CssBaseline from "@mui/material/CssBaseline";
 

function MyApp({ Component, pageProps }) {
  return (
  
    <CssBaseline>
  <Component {...pageProps} />
  </CssBaseline>
  
  )
}

export default MyApp;
