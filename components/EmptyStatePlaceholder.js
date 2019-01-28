import styles from "~/components/EmptyStatePlaceholder.module.scss";

import * as React from "react";

export const EmptyStatePlaceholder = (props) => {
  return <h1 className={styles.placeholder} {...props} />;
};

export default EmptyStatePlaceholder;
