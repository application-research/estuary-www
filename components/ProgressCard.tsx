import styles from '@components/ProgressCard.module.scss';

import * as C from '@common/constants';
import * as U from '@common/utilities';
import Link from 'next/link';

const ProgressCard = ({ deal, transfer, chain, marketing, message, contentId }) => {
  let topStyle = { background: null };
  if (transfer) {
    topStyle = { background: C.statusColors[Number(transfer.status)] };
    if (deal.failed && transfer.status === 6) {
      topStyle.background = `var(--status-6-failed)`;
    }
  }

  if (message === `DealOnChain`) {
    topStyle.background = `var(--status-success)`;
  }

  if (message === `ActiveOnChain`) {
    topStyle.background = `var(--status-success-bright)`;
  }

  const minerStatsURL = `/providers/stats/${deal.miner}`;
  const dealErrorURL = `/errors/${contentId}`;
  const dealURL = deal ? `/deals/${deal.ID}` : null;
  const receiptURL = deal && deal.dealId ? `/receipts/${deal.dealId}` : null;
  const proposalURL = deal && deal.propCid ? `/proposals/${deal.propCid}` : null;

  return (
    <div className={U.classNames(marketing ? styles.marketing : styles.card)}>
      <div className={styles.container}>
        <div className={styles.items} style={topStyle}>
          {deal.miner ? (
            <Link className={styles.title} href={minerStatsURL} target="_blank">
              {deal.miner}
            </Link>
          ) : null}
          <div className={styles.plain} style={{ textTransform: 'none' }}>
            {message}
          </div>
          {dealURL ? (
            <Link className={styles.item} href={dealURL}>
              → Status
            </Link>
          ) : null}
          {proposalURL ? (
            <Link className={styles.item} href={proposalURL}>
              → Proposal receipt
            </Link>
          ) : null}
          {receiptURL ? (
            <Link className={styles.item} href={receiptURL}>
              → Filecoin deal receipt
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
