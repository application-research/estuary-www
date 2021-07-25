import styles from '@components/AlertPanel.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';

function AlertPanel(props: any) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.h2}>⚠️ {props.title}</h2>
      <p className={styles.p}>{props.children}</p>
    </div>
  );
}

export default AlertPanel;
