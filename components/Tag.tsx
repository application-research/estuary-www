import styles from '@components/Tag.module.scss';

import * as React from 'react';

const Tag = (props) => {
  return (
    <span className={styles.tag} style={props.style}>
      {props.children}
    </span>
  );
};

export default Tag;
