import styles from '@components/AuthenticatedSidebar.module.scss';
import Cookies from 'js-cookie';

import * as C from '@common/constants';
import * as R from '@common/requests';
import Link from 'next/link';

function AuthenticatedLayout(props: any) {
  let perms = 0;
  if (props.viewer) {
    perms = props.viewer.perms;
  }

  return (
    <nav className={styles.container}>
      <div className={styles.title} style={{ marginTop: 40 }}>
        Home
      </div>
      <Link className={styles.item} href="/home" style={props.active === 'FILES' ? { color: `var(--main-primary)` } : null}>
        Files
      </Link>
      <Link className={styles.item} href="/upload" style={props.active === 'UPLOAD' ? { color: `var(--main-primary)` } : null}>
        Upload
      </Link>
      <Link className={styles.item} href="/upload-cid" style={props.active === 'UPLOAD_CID' ? { color: `var(--main-primary)` } : null}>
        Pin CID
      </Link>

      <div className={styles.title}>Developers</div>
      <Link className={styles.item} href="/staging" style={props.active === 'STAGING' ? { color: `var(--main-primary)` } : null}>
        Staging
      </Link>
      <Link className={styles.item} href="/deals" style={props.active === 'DEALS' ? { color: `var(--main-primary)` } : null}>
        Deals
      </Link>
      <Link className={styles.item} href="/deals/debug" style={props.active === 'DEALS_DEBUG' ? { color: `var(--main-primary)` } : null}>
        Debug
      </Link>
      <Link className={styles.item} href="/api-admin" style={props.active === 'API' ? { color: `var(--main-primary)` } : null}>
        API keys
      </Link>

      <div className={styles.title}>Settings</div>
      <Link className={styles.item} href="/your-miners">
        Your miners
      </Link>

      <Link className={styles.item} href="/settings">
        Account
      </Link>
      <Link className={styles.item} href="https://docs.estuary.tech/feedback" target="_blank">
        Feedback
      </Link>
      <span
        className={styles.item}
        onClick={async () => {
          const token = Cookies.get(C.auth);
          const response = await R.del(`/user/api-keys/${token}`, props.api);
          Cookies.remove(C.auth);
          window.location.href = '/';
        }}
      >
        Sign out
      </span>

      {perms >= 10 ? <div className={styles.title}>Admin</div> : null}
      {perms >= 10 ? (
        <Link className={styles.item} href="/admin/impersonate" style={props.active === 'ADMIN_IMPERSONATE' ? { color: `var(--main-primary)` } : null}>
          Impersonate
        </Link>
      ) : null}
      {perms >= 10 ? (
        <Link className={styles.item} href="/admin/stats" style={props.active === 'ADMIN_STATS' ? { color: `var(--main-primary)` } : null}>
          System
        </Link>
      ) : null}
      {perms >= 10 ? (
        <Link className={styles.item} href="/admin/balance" style={props.active === 'ADMIN_BALANCE' ? { color: `var(--main-primary)` } : null}>
          Balance
        </Link>
      ) : null}
      {perms >= 10 ? (
        <Link className={styles.item} href="/admin/providers" style={props.active === 'ADMIN_MINERS' ? { color: `var(--main-primary)` } : null}>
          Providers
        </Link>
      ) : null}
      {perms >= 10 ? (
        <Link className={styles.item} href="/admin/content" style={props.active === 'ADMIN_CONTENT' ? { color: `var(--main-primary)` } : null}>
          Content
        </Link>
      ) : null}
      {perms >= 10 ? (
        <Link className={styles.item} href="/admin/users" style={props.active === 'ADMIN_USERS' ? { color: `var(--main-primary)` } : null}>
          Users
        </Link>
      ) : null}
      {perms >= 10 ? (
        <Link className={styles.item} href="/admin/invites" style={props.active === 'ADMIN_INVITES' ? { color: `var(--main-primary)` } : null}>
          Invites
        </Link>
      ) : null}
      {perms >= 10 ? (
        <Link className={styles.item} href="/admin/shuttle" style={props.active === 'ADMIN_SHUTTLE' ? { color: `var(--main-primary)` } : null}>
          Shuttle
        </Link>
      ) : null}
    </nav>
  );
}

export default AuthenticatedLayout;
