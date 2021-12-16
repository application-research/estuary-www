import styles from '@components/RetrievalCommands.module.scss';
import 'react-tabs/style/react-tabs.css';

import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

function RetrievalCommands(props: {
  miner: string,
  dealId: string,
  cid: string,
  aggregatedIn?: string | null,
  selector?: string | null,
}) {
  const { miner, dealId, cid, aggregatedIn, selector } = props;
  return (
    <Tabs selectedTabClassName={styles.selectedTab}>
      <TabList>
        <Tab>filc</Tab>
        {aggregatedIn && selector && (
          <Tab>lotus 1.13.2+</Tab>
        )}
        <Tab>lotus</Tab>
      </TabList>
      <TabPanel>
        <pre className={styles.command}>
          filc retrieve {cid}
        </pre>
      </TabPanel>
      {aggregatedIn && selector && (
        <TabPanel>
          <pre className={styles.command}>
            lotus client retrieve --miner {miner} --datamodel-path-selector {selector} {aggregatedIn} data-{dealId}
          </pre>
        </TabPanel>
      )}
      <TabPanel>
        <pre className={styles.command}>
          lotus client retrieve --miner {miner} {cid} data-{dealId}
        </pre>
      </TabPanel>
    </Tabs>
  )
}

export default RetrievalCommands;
