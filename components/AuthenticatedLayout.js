import styles from "~/components/AuthenticatedLayout.module.scss";

import * as React from "react";

function AuthenticatedLayout(props) {
  return (
    <React.Fragment>
      <nav className={styles.navigation}>{props.navigation}</nav>
      <div className={styles.container}>
        {props.sidebar ? <section className={styles.sidebar}>{props.sidebar}</section> : null}
        <section className={styles.content}>{props.children}</section>
      </div>
    </React.Fragment>
  );
}

export default AuthenticatedLayout;
