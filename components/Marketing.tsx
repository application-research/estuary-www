import styles from '@components/Marketing.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';

import ActionRow from '@components/ActionRow';
import { ContentCard } from '@pages/deals';

export function MarketingGraph(props: any) {
  return (
    <img
      src="https://next-s3-public.s3-us-west-2.amazonaws.com/estuary-diagram-3.png"
      className={styles.image}
    />
  );
}

export function MarketingUpload(props: any) {
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
          Will cost {U.convertFIL(props.estimate)} FIL ⇄{' '}
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

export function MarketingProgress(props: any) {
  const CID = 'QmVm49v9w7LVx99zEzftuhYCptg86i4PjUq2ZbmrkefjGZ';
  const size = 292619370;
  const dealId = 520;
  const onChainDealId = 1856854;
  const contentId = 46;
  const miner = 'f8399';
  const propCID = 'bafyreidlpuvqumuic27njeij63sx3qlrmfcz4bphcpfuciaogwlpogx33i';

  return (
    <div className={styles.cards}>
      <ContentCard
        id={contentId}
        root={{ aggregatedFiles: '12238' }}
        content={{
          active: true,
          aggregate: false,
          aggregateIn: 0,
          cid: CID,
          description: '',
          id: contentId,
          name: '/',
          offloaded: false,
          replication: 6,
          size: size,
          userId: 1,
        }}
        deals={[
          {
            deal: {
              miner: `f02620`,
              content: 46,
              ID: dealId + 1,
              dealId: onChainDealId,
              propCid: propCID,
              failed: false,
            },
            onChainState: { lastUpdatedEpoch: 780614, sectorStartEpoch: 725661, slashEpoch: -1 },
            transfer: {
              baseCid: CID,
              sent: size,
              status: 6,
              statusMessage: 'Completed',
            },
          },
          {
            deal: {
              miner: `f023971`,
              content: 46,
              ID: dealId + 2,
              dealId: onChainDealId,
              propCid: propCID,
              failed: false,
            },
            onChainState: { lastUpdatedEpoch: 780614, sectorStartEpoch: 725661, slashEpoch: -1 },
            transfer: {
              baseCid: CID,
              sent: size,
              status: 6,
              statusMessage: 'Completed',
            },
          },
          {
            deal: {
              miner: `f022142`,
              content: 46,
              ID: dealId + 3,
              dealId: onChainDealId,
              propCid: propCID,
              failed: false,
            },
            onChainState: { lastUpdatedEpoch: 780614, sectorStartEpoch: 725661, slashEpoch: -1 },
            transfer: {
              baseCid: CID,
              sent: size,
              status: 6,
              statusMessage: 'Completed',
            },
          },
          {
            deal: {
              miner: `f019551`,
              content: 46,
              ID: dealId + 22,
              dealId: onChainDealId,
              propCid: propCID,
              failed: false,
            },
            onChainState: { lastUpdatedEpoch: 780614, sectorStartEpoch: 725661, slashEpoch: -1 },
            transfer: {
              baseCid: CID,
              sent: size,
              status: 6,
              statusMessage: 'Completed',
            },
          },
          {
            deal: {
              miner: `f01240`,
              content: 46,
              ID: dealId + 4,
              dealId: onChainDealId,
              propCid: propCID,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              sent: size,
              status: 6,
              statusMessage: 'Completed',
            },
          },
          {
            deal: {
              miner: `f01247`,
              content: 46,
              ID: dealId + 5,
              propCid: propCID,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 1,
              statusMessage: 'Ongoing',
            },
          },
          {
            deal: {
              miner: `f01278`,
              content: 46,
              ID: dealId + 6,
              propCid: propCID,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 2,
              statusMessage: 'TransferFinished',
            },
          },
          {
            deal: {
              miner: `f071624`,
              content: 46,
              ID: dealId + 7,
              propCid: propCID,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 3,
              statusMessage: 'ResponderCompleted',
            },
          },
          {
            deal: {
              miner: `f0135078`,
              content: 46,
              ID: dealId + 8,
              propCid: propCID,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 4,
              statusMessage: 'Finalizing',
            },
          },
          {
            deal: {
              miner: `f022352`,
              content: 46,
              ID: dealId + 9,
              propCid: propCID,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 5,
              statusMessage: 'Completing',
            },
          },
          {
            deal: {
              miner: `f014768`,
              content: 46,
              ID: dealId + 10,
              propCid: propCID,
              failed: false,
            },
            transfer: {
              baseCid: CID,
              status: 6,
              statusMessage: 'Completed',
            },
          },
          {
            deal: {
              miner: `f02606`,
              content: 46,
              ID: dealId + 11,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 6,
              statusMessage: 'Completed',
            },
          },
          {
            deal: {
              miner: `f019100`,
              content: 46,
              ID: dealId + 12,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 7,
              statusMessage: 'Failing',
            },
          },
          {
            deal: {
              miner: `f019041`,
              content: 46,
              ID: dealId + 13,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 8,
              statusMessage: 'Failed',
            },
          },
          {
            deal: {
              miner: `f023467`,
              content: 46,
              ID: dealId + 14,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 9,
              statusMessage: 'Cancelling',
            },
          },
          {
            deal: {
              miner: `f01276`,
              content: 46,
              ID: dealId + 15,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 10,
              statusMessage: 'Cancelled',
            },
          },
          {
            deal: {
              miner: `f02401`,
              content: 46,
              ID: dealId + 16,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 11,
              statusMessage: 'InitiatorPaused',
            },
          },
          {
            deal: {
              miner: `f02387`,
              content: 46,
              ID: dealId + 17,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 12,
              statusMessage: 'ResponderPaused',
            },
          },
          {
            deal: {
              miner: `f019104`,
              content: 46,
              ID: dealId + 18,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 13,
              statusMessage: 'BothPaused',
            },
          },
          {
            deal: {
              miner: `f099608`,
              content: 46,
              ID: dealId + 19,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 14,
              statusMessage: 'ResponderFinalizing',
            },
          },
          {
            deal: {
              miner: `f062353`,
              content: 46,
              ID: dealId + 20,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 15,
              statusMessage: 'RFTransferFinished',
            },
          },
          {
            deal: {
              miner: `f066596`,
              content: 46,
              ID: dealId + 21,
              propCid: propCID,
              failed: true,
            },
            transfer: {
              baseCid: CID,
              status: 16,
              statusMessage: 'ChannelNotFoundError',
            },
          },
        ]}
        failuresCount={5043}
      />
    </div>
  );
}
