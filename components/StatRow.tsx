import styles from '@components/StatRow.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';

function StatRow(props: any) {
  return (
    <div className={styles.container} onClick={props.onClick} style={props.style}>
      <div className={styles.left}>{props.title}</div>
      <div className={styles.right}>{props.children}</div>
    </div>
  );
}

export default StatRow;
