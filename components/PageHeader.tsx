import styles from '@components/PageHeader.module.scss';

import * as React from 'react';

function PageHeader(props: any) {
  return <section className={styles.layout} {...props} />;
}

export default PageHeader;
