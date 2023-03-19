import styles from '@components/Navigation.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';
import { Typography } from '@mui/material';
import Tag from '@components/Tag';
import Wallet from '@components/Wallet';

const Navigation = (props: any) => {
  return (
    <div className="relative">
      <div className="container  bg-primary   w-auto  mt-8 mx-auto flex flex-row justify-between items-center ">
        <div className="flex justify-between items-center space-x-3">
          <a className="text-3xl text-white items-center font-bold" href="/">
            Estuary
          </a>

          <Typography variant="body2" sx={{ border: '2px solid #40B1D4', color: '#62EEDD', px: 2, mt: '6px', fontSize: '14px' }}>
            Aplha
          </Typography>
        </div>

        {props.isAuthenticated && props.active !== 'INDEX' ? (
          <div className={styles.wallet}>
            <Wallet />
          </div>
        ) : null}

        <div className="flex justify-between items-center text-white text-lg opacity-95  space-x-8    ">
          {!props.isAuthenticated && props.active !== 'SIGN_UP' ? (
            <a className=" hover:text-emerald  transition ease-in duration-150" href="/sign-up">
              Sign up
            </a>
          ) : null}

          {!props.isAuthenticated && props.active !== 'SIGN_IN' ? (
            <a className=" hover:text-emerald  transition ease-in duration-150" href="/sign-in">
              Sign in
            </a>
          ) : null}

          {props.isAuthenticated && props.active === 'INDEX' ? (
            <a className=" hover:text-emerald  transition ease-in duration-150" href="/home">
              Sign in
            </a>
          ) : null}

          <a className="hover:text-emerald hidden  transition ease-in duration-150  sm:block " href="/verify-cid">
            Verify
          </a>

          <a className=" hover:text-emerald  hidden transition ease-in duration-150 sm:block" href="https://docs.estuary.tech">
            Documentation
          </a>

          {props.isAuthenticated ? (
            <a className=" hover:text-emerald  transition ease-in duration-150" href="/_">
              Menu
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Navigation;

// <div className={styles.navigation}>
//   <nav className={styles.container} style={props.style}>
//     <div className={styles.left} style={{ backgroundColor: !props.isRenderingSidebar ? `#fff` : null }}>
//       <a className={styles.logo} href="/">
//         Estuary <Tag>Alpha</Tag>
//       </a>
//     </div>
//     {props.isAuthenticated && props.active !== 'INDEX'? (
//       <div className={styles.wallet}>
//         <Wallet/>
//       </div>
//     ) : null}
//     <div className={styles.right}>
//       {!props.isAuthenticated && props.active !== 'SIGN_UP' ? (
//         <a href="/sign-up" className={styles.item}>
//           Sign up
//         </a>
//       ) : null}
//       {!props.isAuthenticated && props.active !== 'SIGN_IN' ? (
//         <a href="/sign-in" className={styles.item}>
//           Sign in
//         </a>
//       ) : null}
//       {props.isAuthenticated && props.active === 'INDEX' ? (
//         <a href="/home" className={styles.item}>
//           Home
//         </a>
//       ) : null}

//       <a href="/verify-cid" className={styles.webItem}>
//         Verify
//       </a>

//       <a href="https://docs.estuary.tech" className={styles.webItem}>
//         Documentation
//       </a>

//       {props.isAuthenticated ? (
//         <a href="/_" className={styles.mobileItem}>
//           Menu
//         </a>
//       ) : null}
//     </div>
//   </nav>
// </div>
