import styles from '@components/MarketingCube.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';

function MarketingCube(props: any) {
  return (
    <a className={styles.scene} href="/sign-up">
      <div className={styles.cube}>
        <div className={U.classNames(styles.face, styles.front)}>{props.children}</div>
        <div className={U.classNames(styles.face, styles.back)}>{props.children}</div>
        <div className={U.classNames(styles.face, styles.right)}>{props.children}</div>
        <div className={U.classNames(styles.face, styles.left)}>{props.children}</div>
        <div className={U.classNames(styles.face, styles.top)}>{props.children}</div>
        <div className={U.classNames(styles.face, styles.bottom)}>{props.children}</div>
      </div>
    </a>
  );
}

export default MarketingCube;
