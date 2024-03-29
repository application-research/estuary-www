import * as React from 'react';
import styles from '@components/Divider.module.scss';


function Divider(props: any) {
  return props.text != "" ? (
    <div className={styles.divider}>{props.text}</div>
  ) : null;
}

export default Divider;
