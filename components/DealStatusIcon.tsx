import styles from '@components/PinStatusIcon.module.scss';
import { BalanceOutlined, GppGoodOutlined, LinkOutlined, PhotoSizeSelectSmallOutlined, SafetyCheckOutlined, UploadOutlined } from '@mui/icons-material';
import { Link, Tooltip } from '@mui/material';

function DealStatusIcon(props: any) {
  if (props.dealStatus == 'staged') {
    const zoneHref = `/staging/${props.zone}`;
    return (
      <Tooltip title={props.dealStatus} placement="left" arrow>
        <Link href={zoneHref}>
          <PhotoSizeSelectSmallOutlined color="disabled" fontSize="small" className={styles.statusIcon} />
        </Link>
      </Tooltip>
    );
  } else if (props.dealStatus == 'asking') {
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
  }
  return null;
}

export default DealStatusIcon;
