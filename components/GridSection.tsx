import styles from '@components/GridSection.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';

function GridSection(props: any) {
  return <section className={styles.container} style={props.style} {...props} />;
}

export default GridSection;
