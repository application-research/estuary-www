import styles from '@components/ProgressCard.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';

const ProgressCard = ({ deal, transfer, chain, marketing, contentId, showFailures }) => {
  const isOnChain = deal.dealId > 0;

  let message = `DealOnChain`;
  if (transfer && transfer.statusMessage) {
    if (!deal.dealId) {
      message = transfer.statusMessage;

      if (message === 'Failed') {
        return null;
      }

      if (message === 'Completed') {
        message = 'TransferFinish';
      }
    }

    if (chain && chain.sectorStartEpoch && Number(chain.sectorStartEpoch) > 0) {
      message = `ActiveOnChain`;
    }
  }

  if (deal && deal.failed) {
    message = 'Failed';

    if (!showFailures) {
      return null;
    }

    // NOTE(jim): status 6 is a successful deal transfer.
    if (transfer.status === 6) {
      message = 'FailedAfterTransfer';
    }
  }

  let topStyle = { background: C.statusColors[Number(transfer.status)] };
  if (transfer) {
    if (deal.failed && transfer.status === 6) {
      if (!showFailures) {
        return null;
      }

      topStyle.background = `var(--status-6-failed)`;
    }

    if (message === `DealOnChain`) {
      topStyle.background = `var(--status-success)`;
    }

    if (message === `ActiveOnChain`) {
      topStyle.background = `var(--status-success-bright)`;
    }
  }

  const minerStatsURL = `/miners/stats/${deal.miner}`;
  const dealErrorURL = `/errors/${contentId}`;
  const dealURL = deal ? `/deals/${deal.ID}` : null;
  const receiptURL = deal && deal.dealId ? `/receipts/${deal.dealId}` : null;
  const proposalURL = deal && deal.propCid ? `/proposals/${deal.propCid}` : null;

  return (
    <div className={U.classNames(marketing ? styles.marketing : styles.card)}>
      <div className={styles.container}>
        <div className={styles.items} style={topStyle}>
          <a className={styles.title} href={minerStatsURL} target="_blank">
            {deal.miner}
          </a>
          <div className={styles.plain} style={{ textTransform: 'none' }}>
            {message}
          </div>
          {dealURL ? (
            <a className={styles.item} href={dealURL}>
              → Status
            </a>
          ) : null}
          {proposalURL ? (
            <a className={styles.item} href={proposalURL}>
              → Proposal receipt
            </a>
          ) : null}
          {receiptURL ? (
            <a className={styles.item} href={receiptURL}>
              → Filecoin deal receipt
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
