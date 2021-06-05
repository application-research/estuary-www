import styles from "@components/Card.module.scss";

import * as React from "react";
import * as U from "@common/utilities";
import * as C from "@common/constants";

function Card(props: any) {
  return (
    <React.Fragment>
      <div className={styles.container} style={props.style}>
        <div className={styles.top}>{props.children}</div>
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>{props.label}</div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Card;
