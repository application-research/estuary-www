import styles from "~/components/ProgressCard.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";

const ProgressCard = ({ deal, transfer, chain, marketing }) => {
  const isOnChain = deal.dealId > 0;

  let message = `DealOnChain`;
  if (transfer && transfer.statusMessage) {
    if (!deal.dealId) {
      message = transfer.statusMessage;

      if (message === "Completed") {
        message = "TransferFinish";
      }
    }

    if (chain && chain.sectorStartEpoch) {
      message = `ActiveOnChain`;
    }
  }

  if (deal.failed) {
    message = "FailAfterTransfer";
  }

  let topStyle = { background: C.statusColors[Number(transfer.status)] };
  if (transfer) {
    if (deal.failed) {
      topStyle.background = `var(--status-6-failed)`;
    }

    if (message === `DealOnChain`) {
      topStyle.background = `var(--status-success)`;
    }

    if (message === `ActiveOnChain`) {
      topStyle.background = `var(--status-success-bright)`;
    }
  }

  return (
    <div className={U.classNames(marketing ? styles.marketing : styles.card)}>
      <div className={styles.container}>
        <div className={styles.top} style={topStyle}>
          {transfer ? (
            <p className={styles.cardHeading}>
              {message} ({transfer.status}) ⇄{" "}
              <a href={`/miners/stats/${deal.miner}`}>{deal.miner}</a>
            </p>
          ) : (
            <p className={styles.cardHeading}>NoTransferAndFail ⇄ {deal.miner}</p>
          )}
        </div>
        <div className={styles.bottom}>
          {transfer ? (
            <div className={styles.detail}>
              <div className={styles.detailLeft}>> Retrieval:</div>
              <div className={styles.detailRight}>
                <a href={`https://dweb.link/ipfs/${transfer.baseCid}`} target="_blank">
                  https://dweb.link/ipfs/{transfer.baseCid}
                </a>
              </div>
            </div>
          ) : null}
          {deal ? (
            <React.Fragment>
              {deal.failed ? (
                <div className={styles.detail}>
                  <div className={styles.detailLeft}>> Fail time:</div>
                  <div className={styles.detailRight}>{U.toDate(deal.failedAt)}</div>
                </div>
              ) : null}

              <div className={styles.detail}>
                <div className={styles.detailLeft}>> Prop CID:</div>
                <div className={styles.detailRight}>{deal.propCid}</div>
              </div>

              <div className={styles.detail}>
                <div className={styles.detailLeft}>> Deal ID:</div>
                <div className={styles.detailRight}>{deal.dealId}</div>
              </div>
            </React.Fragment>
          ) : null}
          {transfer ? (
            <React.Fragment>
              <div className={styles.detail}>
                <div className={styles.detailLeft}>> Channel ID:</div>
                <div className={styles.detailRight}>{transfer.channelId.ID}</div>
              </div>

              {U.isEmpty(transfer.message) ? null : (
                <div className={styles.detail}>
                  <div className={styles.detailLeft}>> Message:</div>
                  <div className={styles.detailRight}>{transfer.message}</div>
                </div>
              )}

              <div className={styles.detail}>
                <div className={styles.detailLeft}>> Received:</div>
                <div className={styles.detailRight}>{transfer.received}</div>
              </div>

              <div className={styles.detail}>
                <div className={styles.detailLeft}>> Remote:</div>
                <div className={styles.detailRight}>{transfer.remotePeer}</div>
              </div>

              <div className={styles.detail}>
                <div className={styles.detailLeft}>> Estuary:</div>
                <div className={styles.detailRight}>{transfer.selfPeer}</div>
              </div>

              <div className={styles.detail}>
                <div className={styles.detailLeft}>> Data sent:</div>
                <div className={styles.detailRight}>{U.bytesToSize(transfer.sent)}</div>
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
