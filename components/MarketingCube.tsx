import styles from '@components/MarketingCube.module.scss';

import * as U from '@common/utilities';
import Link from 'next/link';

function MarketingCube(props: any) {
  return (
    <Link className={styles.scene} href="/sign-up">
      <div className={styles.cube}>
        <div className={U.classNames(styles.face, styles.front)}>{props.children}</div>
        <div className={U.classNames(styles.face, styles.back)}>{props.children}</div>
        <div className={U.classNames(styles.face, styles.right)}>{props.children}</div>
        <div className={U.classNames(styles.face, styles.left)}>{props.children}</div>
        <div className={U.classNames(styles.face, styles.top)}>{props.children}</div>
        <div className={U.classNames(styles.face, styles.bottom)}>{props.children}</div>
      </div>
    </Link>
  );
}

export default MarketingCube;
