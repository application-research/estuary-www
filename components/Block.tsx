import styles from "@components/Block.module.scss";

import * as React from "react";
import * as U from "@common/utilities";
import * as C from "@common/constants";

import ActionRow from "@components/ActionRow";

function Block(props: any) {
  return (
    <React.Fragment>
      <div className={styles.container} style={props.style}>
        <div className={styles.top}>{props.children}</div>
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>{props.label}</div>
        </div>
      </div>
      {props.custom && props.onCustomClick ? (
        <ActionRow onClick={props.onCustomClick}>{props.custom}</ActionRow>
      ) : null}
    </React.Fragment>
  );
}

export default Block;
