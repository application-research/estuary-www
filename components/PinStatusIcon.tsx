import styles from '@components/PinStatusIcon.module.scss';
import { HourglassEmptyOutlined, MoveDownOutlined, PublishedWithChangesOutlined, SyncOutlined, SyncProblemOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

function PinStatusIcon(props: any) {
  if (props.pinningStatus == 'queued') {
    return (
      <Tooltip title={props.pinningStatus} placement="left" arrow>
        <HourglassEmptyOutlined color="secondary" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.pinningStatus == 'pinning') {
    return (
      <Tooltip title={props.pinningStatus} placement="left" arrow>
        <SyncOutlined color="primary" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.pinningStatus == 'pinned') {
    return (
      <Tooltip title={props.pinningStatus} placement="left" arrow>
        <PublishedWithChangesOutlined color="success" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.pinningStatus == 'failed') {
    return (
      <Tooltip title={props.pinningStatus} placement="left" arrow>
        <SyncProblemOutlined color="error" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.pinningStatus == 'offloaded') {
    return (
      <Tooltip title={props.pinningStatus} placement="left" arrow>
        <MoveDownOutlined color="disabled" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  }
  return null;
}

export default PinStatusIcon;
