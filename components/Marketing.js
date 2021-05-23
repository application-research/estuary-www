import styles from "~/components/Marketing.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";

import ActionRow from "~/components/ActionRow";
import { ContentCard } from "~/pages/deals.js";

export function MarketingGraph(props) {
  return (
    <img
      src="https://next-s3-public.s3-us-west-2.amazonaws.com/estuary-diagram-3.png"
      className={styles.image}
    />
  );
}

export function MarketingUpload(props) {
  return (
    <div className={styles.single}>
      <div className={styles.drop}>
        <div className={styles.top}>2020-your-public-data.zip</div>
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>Ready to upload</div>
          <div className={styles.bottomRight}>APPLICATION/ZIP</div>
        </div>
      </div>

      {props.estimate ? (
        <ActionRow>
          Will cost {U.convertFIL(props.estimate)} FIL ⇄{" "}
          {(Number(U.convertFIL(props.estimate)) * Number(props.price)).toFixed(2)} USD
        </ActionRow>
      ) : null}
      <ActionRow>{U.bytesToSize(props.size)}</ActionRow>
      <ActionRow>Replicated across {props.replication} miners.</ActionRow>
      <ActionRow>
        Stored for {props.duration} filecoin-epochs (
        {((props.duration * 30) / 60 / 60 / 24).toFixed(2)} days).
      </ActionRow>
      {props.verified ? (
        <ActionRow>This deal is verified.</ActionRow>
      ) : (
        <ActionRow>This deal is not verified.</ActionRow>
      )}
    </div>
  );
}

export function MarketingProgress(props) {
  const CID = "QmVm49v9w7LVx99zEzftuhYCptg86i4PjUq2ZbmrkefjGZ";
  const size = 292619370;
  const dealId = 520;
  const onChainDealId = 1856854;
  const contentId = 46;
  const miner = "f8399";

  return (
    <div className={styles.cards}>
      <ContentCard
        id={contentId}
        content={{
          active: true,
          aggregate: false,
          aggregateIn: 0,
          cid: CID,
          description: "",
          id: contentId,
          name: "large-tree-5.mp4",
          offloaded: false,
          replication: 6,
          size: size,
          userId: 1,
        }}
        deals={[
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 1,
              dealId: onChainDealId,
              failed: false,
            },
            onChainState: { lastUpdatedEpoch: 780614, sectorStartEpoch: 725661, slashEpoch: -1 },
            transfer: {
              baseCid: CID,
              sent: size,
              status: 6,
              statusMessage: "Completed",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 2,
              dealId: onChainDealId,
              failed: false,
            },
            onChainState: { lastUpdatedEpoch: 780614, sectorStartEpoch: 725661, slashEpoch: -1 },
            transfer: {
              baseCid: CID,
              sent: size,
              status: 6,
              statusMessage: "Completed",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 3,
              dealId: onChainDealId,
              failed: false,
            },
            onChainState: { lastUpdatedEpoch: 780614, sectorStartEpoch: 725661, slashEpoch: -1 },
            transfer: {
              baseCid: CID,
              sent: size,
              status: 6,
              statusMessage: "Completed",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 22,
              dealId: onChainDealId,
              failed: false,
            },
            onChainState: { lastUpdatedEpoch: 780614, sectorStartEpoch: 725661, slashEpoch: -1 },
            transfer: {
              baseCid: CID,
              sent: size,
              status: 6,
              statusMessage: "Completed",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 4,
              dealId: onChainDealId,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              sent: size,
              status: 6,
              statusMessage: "Completed",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 5,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 1,
              statusMessage: "Ongoing",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 6,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 2,
              statusMessage: "TransferFinished",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 7,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 3,
              statusMessage: "ResponderCompleted",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 8,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 4,
              statusMessage: "Finalizing",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 9,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 5,
              statusMessage: "Completing",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 10,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 6,
              statusMessage: "Completed",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 11,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 6,
              statusMessage: "Completed",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 12,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 7,
              statusMessage: "Failing",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 13,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 8,
              statusMessage: "Failed",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 14,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 9,
              statusMessage: "Cancelling",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 15,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 10,
              statusMessage: "Cancelled",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 16,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 11,
              statusMessage: "InitiatorPaused",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 17,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 12,
              statusMessage: "ResponderPaused",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 18,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 13,
              statusMessage: "BothPaused",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 19,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 14,
              statusMessage: "ResponderFinalizing",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 20,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 15,
              statusMessage: "RFTransferFinished",
            },
          },
          {
            deal: {
              miner: miner,
              content: 46,
              ID: dealId + 21,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 16,
              statusMessage: "ChannelNotFoundError",
            },
          },
        ]}
        failuresCount={5043}
      />
    </div>
  );
}
