import styles from "~/components/AuthenticatedSidebar.module.scss";
import Cookies from "js-cookie";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";

function AuthenticatedLayout(props) {
  return (
    <nav className={styles.container}>
      <div className={styles.title}>Estuary</div>
      <a className={styles.item} href="/upload">
        Upload
      </a>
      <a className={styles.item} href="/deals">
        Deals
      </a>
      <a className={styles.item} href="/api-admin">
        API
      </a>
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

      <div className={styles.title}>Collections</div>
      <a className={styles.item} href="/home">
        Files
      </a>

      <div className={styles.title}>Admin</div>
      {props.viewer.perms >= 10 ? (
        <a className={styles.item} href="/admin/stats">
          System
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a className={styles.item} href="/admin/balance">
          Balance
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a className={styles.item} href="/admin/miners">
          Miners
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a className={styles.item} href="/admin/content">
          Content
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a className={styles.item} href="/admin/users">
          Users
        </a>
      ) : null}
      {props.viewer.perms >= 10 ? (
        <a className={styles.item} href="/admin/invite">
          Invites
        </a>
      ) : null}
    </nav>
  );
}

export default AuthenticatedLayout;
