import styles from "@components/Typography.module.scss";

import * as React from "react";

export const H1 = (props) => {
  return <h1 className={styles.h1} {...props} />;
};

export const H2 = (props) => {
  return <h2 className={styles.h2} {...props} />;
};

export const H3 = (props) => {
  return <h3 className={styles.h3} {...props} />;
};

export const P = (props) => {
  return <p className={styles.p} {...props} />;
};
