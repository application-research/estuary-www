import styles from '@components/ProgressBar.module.scss';
import LoaderSpinner from './LoaderSpinner';

export default function ProgressBar(props) {
  const { completed } = props;
  const completedRounded = Math.round(completed * 100) / 100;

  const notCompleted = Math.round((100 - completed) * 100) / 100;
  console.log(completedRounded, 'completed rounded');
  return (
    <div style={{ display: 'grid', rowGap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p className={styles.labelTitle}>Success: {isNaN(completedRounded) ? <LoaderSpinner /> : `${completedRounded}%`} </p>
        <p className={styles.labelTitle}>Failure: {isNaN(notCompleted) ? <LoaderSpinner /> : `${notCompleted}%`} </p>
      </div>

      <div className={styles.containerStyles}>
        <div className={styles.fillerStyles} style={{ width: `${completed}%` }}>
          <span className={styles.labelStyles}>{`${completedRounded}%`}</span>
        </div>
      </div>
    </div>
  );
}
