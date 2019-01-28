import styles from "~/components/FeatureRow.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";

function FeatureRow(props) {
  return <div className={styles.rtext}>{props.children}</div>;
}

export default FeatureRow;
