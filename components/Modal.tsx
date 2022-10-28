import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '@components/Modal.module.scss';

const Modal = (props) => {
  const [isBrowser, setIsBrowser] = React.useState(false);
  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  useEffect(() => {
    setIsBrowser(true);
    document.body.addEventListener('keydown', closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
    };
  });

  if (isBrowser) {
    return ReactDOM.createPortal(
      <div className={styles.modal} onClick={props.onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h4 className={styles.modalTitle}>{props.title}</h4>
          </div>
          <div className={styles.modalBody}>{props.children}</div>
          <div className={styles.modalFooter}>
            <button onClick={props.onClose} className={styles.button}>
              Close
            </button>
          </div>
        </div>
      </div>,
      document.getElementById('__next')
    );
  }
  return null;
};

export default Modal;
