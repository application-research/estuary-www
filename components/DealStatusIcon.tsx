import styles from '@components/PinStatusIcon.module.scss';
import {
  BalanceOutlined,
  GppBadOutlined,
  GppGoodOutlined,
  LinkOutlined,
  PhotoSizeSelectSmallOutlined,
  RemoveModeratorOutlined,
  SafetyCheckOutlined,
  UploadOutlined,
} from '@mui/icons-material';
import { Link, Tooltip } from '@mui/material';

function DealStatusIcon(props: any) {
  if (props.dealStatus == 'preparing') {
    const zoneHref = `/staging/${props.zone}`;
    return (
      <Link href={zoneHref}>
        <Tooltip title={props.dealStatus} placement="left" arrow>
          <PhotoSizeSelectSmallOutlined color="disabled" fontSize="small" className={styles.statusIcon} />
        </Tooltip>
      </Link>
    );
  } else if (props.dealStatus == 'proposing') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <BalanceOutlined color="action" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'transfering') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <UploadOutlined color="primary" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'on-chain') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <LinkOutlined color="secondary" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'sealed') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <GppGoodOutlined color="success" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'repairing') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <SafetyCheckOutlined color="warning" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'slashed') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <RemoveModeratorOutlined color="error" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  } else if (props.dealStatus == 'expired') {
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <GppBadOutlined color="disabled" fontSize="small" className={styles.statusIcon} />
      </Tooltip>
    );
  }
  return null;
}

export default DealStatusIcon;
