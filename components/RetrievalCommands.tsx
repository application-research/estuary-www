import styles from '@components/RetrievalCommands.module.scss';

import * as React from 'react';

function RetrievalCommands(props: { miner: string; dealId: string; cid: string; aggregatedIn?: string | null; selector?: string | null }) {
  const { miner, dealId, cid, aggregatedIn, selector } = props;

  // NOTE(jim):
  // Special case for lotus 1.13.2+
  const isLotusVersion13 = aggregatedIn && selector;
  let maybeLotus13: any = ``;
  if (isLotusVersion13) {
    maybeLotus13 = (
      <React.Fragment>
        <br />
        <br />
        <span className={styles.command}>{`# Lotus 1.13.2`}</span>
        <br />
        <br />
        <span className={styles.command}>{`lotus client retrieve --miner ${miner} --datamodel-path-selector ${selector} ${aggregatedIn} data-${dealId}`}</span>
      </React.Fragment>
    );
  }

  return (
    <div className={styles.container}>
      {`# FILC`}
      <br />
      <span className={styles.command}>{`filc retrieve ${cid}`}</span>
      <br />
      <br />
      {`# Lotus`}
      <br />
      <span className={styles.command}>{`lotus client retrieve --miner ${miner} ${cid} data-${dealId}`}</span>
      {maybeLotus13}
    </div>
  );
}

export default RetrievalCommands;
