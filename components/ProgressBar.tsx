import styles from '@components/ProgressBar.module.scss';

export default function ProgressBar(props) {
  const { bgcolor, completed } = props;
  const completedRounded = Math.round(completed * 100) / 100;

  const notCompleted = Math.round((100 - completed) * 100) / 100;
  return (
    <div style={{ display: 'grid', rowGap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p className={styles.labelTitle}>Success: {`${completedRounded}%`} </p>
        <p className={styles.labelTitle}>Failure: {`${notCompleted}%`} </p>
      </div>

      <div className={styles.containerStyles}>
        <div className={styles.fillerStyles} style={{ width: `${completed}%` }}>
          <span className={styles.labelStyles}>{`${completedRounded}%`}</span>
        </div>
      </div>
    </div>
  );
}
