import styles from "@components/ActionRow.module.scss";

import * as React from "react";
import * as U from "@common/utilities";

function ActionRow(props) {
  return (
    <div
      className={U.classNames(styles.container, props.onClick ? styles.action : null)}
      {...props}
    />
  );
}

export default ActionRow;
