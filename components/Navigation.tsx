import styles from '@components/Navigation.module.scss';

import Tag from '@components/Tag';
import Link from 'next/link';

const Navigation = (props: any) => {
  return (
    <div className={styles.navigation}>
      <nav className={styles.container} style={props.style}>
        <div className={styles.left} style={{ backgroundColor: !props.isRenderingSidebar ? `#fff` : null }}>
          <Link className={styles.logo} href="/">
            Estuary <Tag>Alpha</Tag>
          </Link>
        </div>
        <div className={styles.right}>
          {!props.isAuthenticated && props.active !== 'SIGN_UP' ? (
            <Link href="/sign-up" className={styles.item}>
              Sign up
            </Link>
          ) : null}
          {!props.isAuthenticated && props.active !== 'SIGN_IN' ? (
            <Link href="/sign-in" className={styles.item}>
              Sign in
            </Link>
          ) : null}
          {props.isAuthenticated && props.active === 'INDEX' ? (
            <Link href="/home" className={styles.item}>
              Home
            </Link>
          ) : null}

          <Link href="/verify-cid" className={styles.webItem}>
            Verify
          </Link>

          <Link href="https://docs.estuary.tech" className={styles.webItem}>
            Documentation
          </Link>

          {props.isAuthenticated ? (
            <Link href="/_" className={styles.mobileItem}>
              Menu
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
