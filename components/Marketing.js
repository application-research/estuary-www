import styles from "~/components/Marketing.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";

import ActionRow from "~/components/ActionRow";
import ProgressCard from "~/components/ProgressCard";

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
  return (
    <div className={styles.cards}>
      <ProgressCard
        marketing
        deal={{
          dealId: 1904723,
          miner: "f08399",
          failed: false,
          propCid: "bafyreibbuepzjalmdjr3h7h6zpxsdu4atfabi6qimexh5c6rx7db6iutk4",
        }}
        transfer={{
          baseCid: "QmcREpVYDPknyvHAsfWoKGf1JJkfVdpwm3vHSYnju2YR7r",
          status: "6",
          statusMessage: "MaybeOnChain",
          channelId: { ID: "1620357263552379400" },
          message: "",
          received: 0,
          remotePeer: "12D3KooWGabRFTsGhQLP5sb5f6eSUDbhyDqiF3fK9mZQWxJK5xJG",
          selfPeer: "12D3KooWCVXs8P7iq6ao4XhfAmKWrEeuKFWCJgqe9jGDMTqHYBjw",
          sent: 792259920,
        }}
      />
      <ProgressCard
        marketing
        deal={{
          dealId: 1905792,
          miner: "f01247",
          failed: false,
          propCid: "bafyreidmtuykbghvxnh2g5lyvjl7p552fphwbx3xhqfdfeplbuefeivnla",
        }}
        transfer={{
          baseCid: "QmcREpVYDPknyvHAsfWoKGf1JJkfVdpwm3vHSYnju2YR7r",
          status: "6",
          statusMessage: "MaybeOnChain",
          channelId: { ID: "1620357263552379400" },
          message: "",
          received: 0,
          remotePeer: "12D3KooWA9zRZNfi59eJynKbY7B91By4QXRTLZ3dFD8hKPFTTwY7",
          selfPeer: "12D3KooWCVXs8P7iq6ao4XhfAmKWrEeuKFWCJgqe9jGDMTqHYBjw",
          sent: 792259920,
        }}
      />
    </div>
  );
}
