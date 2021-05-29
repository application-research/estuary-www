import styles from "~/components/AuthenticatedSidebar.module.scss";
import Cookies from "js-cookie";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";
import * as R from "~/common/requests";

function AuthenticatedLayout(props) {
  return (
    <nav className={styles.container}>
      <div className={styles.title} style={{ marginTop: 40 }}>
        Home
      </div>
      <a
        className={styles.item}
        href="/home"
        style={props.active === "FILES" ? { color: `var(--main-primary)` } : null}
      >
        Files
      </a>
      <a
        className={styles.item}
        href="/upload"
        style={props.active === "UPLOAD" ? { color: `var(--main-primary)` } : null}
      >
        Upload
      </a>
      <a
        className={styles.item}
        href="/upload-cid"
        style={props.active === "UPLOAD_CID" ? { color: `var(--main-primary)` } : null}
      >
        Upload CID
      </a>

      <div className={styles.title}>Developers</div>
      <a
        className={styles.item}
        href="/staging"
        style={props.active === "STAGING" ? { color: `var(--main-primary)` } : null}
      >
        Staging
      </a>
      <a
        className={styles.item}
        href="/deals"
        style={props.active === "DEALS" ? { color: `var(--main-primary)` } : null}
      >
        Deals
      </a>
      <a
        className={styles.item}
        href="/api-admin"
        style={props.active === "API" ? { color: `var(--main-primary)` } : null}
      >
        API keys
      </a>

      <div className={styles.title}>Settings</div>
      <a className={styles.item} href="https://docs.estuary.tech/feedback" target="_blank">
        Feedback
      </a>
      <span
        className={styles.item}
        onClick={async () => {
          const token = Cookies.get(C.auth);
          const response = await R.del(`/user/api-keys/${token}`);
          Cookies.remove(C.auth);
          window.location.href = "/";
        }}
      >
        Sign out
      </span>

      {props.viewer.perms >= 10 ? <div className={styles.title}>Admin</div> : null}
      {props.viewer.perms >= 10 ? (
        <a
          className={styles.item}
          href="/admin/stats"
          style={props.active === "ADMIN_STATS" ? { color: `var(--main-primary)` } : null}
        >
          System
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a
          className={styles.item}
          href="/admin/balance"
          style={props.active === "ADMIN_BALANCE" ? { color: `var(--main-primary)` } : null}
        >
          Balance
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a
          className={styles.item}
          href="/admin/miners"
          style={props.active === "ADMIN_MINERS" ? { color: `var(--main-primary)` } : null}
        >
          Miners
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a
          className={styles.item}
          href="/admin/content"
          style={props.active === "ADMIN_CONTENT" ? { color: `var(--main-primary)` } : null}
        >
          Content
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a
          className={styles.item}
          href="/admin/users"
          style={props.active === "ADMIN_USERS" ? { color: `var(--main-primary)` } : null}
        >
          Users
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a
          className={styles.item}
          href="/admin/invites"
          style={props.active === "ADMIN_INVITES" ? { color: `var(--main-primary)` } : null}
        >
          Invites
        </a>
      ) : null}
    </nav>
  );
}

export default AuthenticatedLayout;
