import styles from '@components/ActionRow.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';

function ActionRow(props: any) {
  return (
    <div
      className={U.classNames(styles.container, props.isHeading ? null : styles.default, props.onClick ? styles.action : null)}
      onClick={props.onClick}
      children={props.children}
      style={props.style}
    />
  );
}

export default ActionRow;
