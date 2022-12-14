import styles from '@components/PinStatusIcon.module.scss';
import { MoveDownOutlined, PublishedWithChangesOutlined, SyncOutlined, SyncProblemOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

function PinStatusIcon(props: any) {
  if (props.pinningStatus == 'pinned') {
    return (
      <Tooltip title={props.pinningStatus}>
        <PublishedWithChangesOutlined color="success" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.pinningStatus == 'pinning') {
    return (
      <Tooltip title={props.pinningStatus}>
        <SyncOutlined color="primary" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.pinningStatus == 'failed') {
    return (
      <Tooltip title={props.pinningStatus}>
        <SyncProblemOutlined color="error" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.pinningStatus == 'offloaded') {
    return (
      <Tooltip title={props.pinningStatus}>
        <MoveDownOutlined color="disabled" className={styles.statusIcon} />
      </Tooltip>
    );
  }
  return null;
}

export default PinStatusIcon;
