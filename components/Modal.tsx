import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '@components/Modal.module.scss';

const CloseSVG = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px">
      <g>
        <path fill="none" d="M0 0h24v24H0z" />
        <path opacity="0.5" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
      </g>
    </svg>
  );
};

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
            <button onClick={props.onClose} className={styles.closeButton}>
              <CloseSVG />
            </button>
          </div>
          <div className={styles.modalBody}>{props.children}</div>
          <div className={styles.modalFooter}></div>
        </div>
      </div>,
      document.getElementById('__next')
    );
  }
  return null;
};

export default Modal;
