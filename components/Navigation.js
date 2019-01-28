import styles from "~/components/Navigation.module.scss";
import pkg from "~/package.json";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";

const Navigation = (props) => {
  return (
    <div className={styles.navigation}>
      <nav className={styles.container} style={props.style}>
        <div className={styles.left}>
          <a className={styles.logo} href="/" style={{ fontSize: 32, lineHeight: 32 }}>
            ↬
          </a>
        </div>
        <div className={styles.right}>
          {!props.isAuthenticated && props.active !== "SIGN_UP" ? (
            <a href="/sign-up" className={styles.item}>
              ➝ Use invite
            </a>
          ) : null}
          {!props.isAuthenticated && props.active !== "SIGN_IN" ? (
            <a href="/sign-in" className={styles.item}>
              ➝ Sign in
            </a>
          ) : null}
          {props.isAuthenticated && props.active === "INDEX" ? (
            <a href="/home" className={styles.item}>
              ➝ Return home
            </a>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
