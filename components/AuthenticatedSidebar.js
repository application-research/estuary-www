import styles from "~/components/AuthenticatedSidebar.module.scss";
import Cookies from "js-cookie";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";

function AuthenticatedLayout(props) {
  return (
    <nav className={styles.container}>
      <a className={styles.item} href="/home">
        Files
      </a>
      <a className={styles.item} href="/upload">
        Upload
      </a>
      <a className={styles.item} href="/deals">
        Deals
      </a>
      <a className={styles.item} href="/api-admin">
        API
      </a>
      <a className={styles.item} href="/settings">
        Settings
      </a>
      {props.viewer.perms >= 10 ? (
        <a className={styles.adminItem} href="/admin/stats">
          Admin ➝ System
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a className={styles.adminItem} href="/admin/analytics">
          Admin ➝ Analytics
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a className={styles.adminItem} href="/admin/balance">
          Admin ➝ Balance
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a className={styles.adminItem} href="/admin/miners">
          Admin ➝ Miners
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a className={styles.adminItem} href="/admin/content">
          Admin ➝ Content
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a className={styles.adminItem} href="/admin/invite">
          Admin ➝ Invites
        </a>
      ) : null}

      <span
        className={styles.item}
        onClick={async () => {
          Cookies.remove(C.auth);
          await U.delay(200);
          window.location.href = "/";
        }}
      >
        Sign out
      </span>
    </nav>
  );
}

export default AuthenticatedLayout;
