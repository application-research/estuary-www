import styles from "~/components/SingleColumnLayout.module.scss";

import * as React from "react";

function SingleColumnLayout(props) {
  return <section className={styles.layout} {...props} />;
}

export default SingleColumnLayout;
