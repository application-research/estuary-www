import styles from '@components/Navigation.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';

import Tag from '@components/Tag';
import Wallet from '@components/Wallet';

const Navigation = (props: any) => {
  return (
    <div className={styles.navigation}>
      <nav className={styles.container} style={props.style}>
        <div className={styles.left} style={{ backgroundColor: !props.isRenderingSidebar ? `#fff` : null }}>
          <a className={styles.logo} href="/">
            <Tag style={{ marginLeft: `-4px` }}>Discontinued 8/7/23</Tag>
          </a>
        </div>
        {props.isAuthenticated && props.active !== 'INDEX' ? (
          <div className={styles.wallet}>
            <Wallet />
          </div>
        ) : null}
        <div className={styles.right}>
          {!props.isAuthenticated && props.active !== 'SIGN_IN' ? (
            <a href="/sign-in" className={styles.item}>
              Sign in
            </a>
          ) : null}
          {props.isAuthenticated && props.active === 'INDEX' ? (
            <a href="/home" className={styles.item}>
              Home
            </a>
          ) : null}

          <a href="/verify-cid" className={styles.webItem}>
            Verify
          </a>

          <a href="https://docs.estuary.tech" className={styles.webItem}>
            Documentation
          </a>

          {props.isAuthenticated ? (
            <a href="/_" className={styles.mobileItem}>
              Menu
            </a>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
