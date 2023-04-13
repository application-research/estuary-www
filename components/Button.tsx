import * as React from 'react';
import * as U from '@common/utilities';

import styles from '@components/Button.module.scss';

import LoaderSpinner from '@components/LoaderSpinner';

const Button = (props: any) => {
  if (props.disabled) {
    return <button style={props.style} className={U.classNames(styles.button, styles.disabledButton)} children={props.children} disabled={props.disabled}/>;
  }
  if (props.loading) {
    return (
      <button className={U.classNames(styles.button, styles.loading)} style={props.style}>
        <LoaderSpinner style={{ borderTop: `2px solid var(--main-primary)` }} />
      </button>
    );
  }

  if (!U.isEmpty(props.type)) {
    return <label className={styles.button} onClick={props.onClick} children={props.children} htmlFor={props.htmlFor} style={props.style} />;
  }

  if (!U.isEmpty(props.href)) {
    return <a href={props.href} className={styles.button} children={props.children} {...props} />;
  }

  return <button style={props.style} className={styles.button} onClick={props.onClick} children={props.children} />;
};

export default Button;
