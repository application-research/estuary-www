import styles from "@components/ProgressBlock.module.scss";

import * as React from "react";
import * as U from "@common/utilities";
import * as C from "@common/constants";

export default class ProgressBlock extends React.Component {
  static defaultProps = {
    loaded: 0,
    total: 100,
    secondsRemaining: 0,
    bytesPerSecond: 0,
  };

  render() {
    const totalPercentage = (this.props.loaded / this.props.total) * 100;

    return (
      <div className={styles.container} style={this.props.style}>
        <div className={styles.top}>
          <div className={styles.progress}>
            <div className={styles.unit} style={{ width: `${totalPercentage}%` }} />
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            {U.bytesToSize(this.props.loaded)} Loaded ({Math.floor(this.props.secondsRemaining, 2)}{" "}
            {U.pluralize("second", this.props.secondsRemaining)} remaining at{" "}
            {U.bytesToSize(this.props.bytesPerSecond)} per second)
          </div>
          <div className={styles.bottomRight}>{U.bytesToSize(this.props.total)} Total</div>
        </div>
      </div>
    );
  }
}
