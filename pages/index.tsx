import styles from '@pages/new-index.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Page from '@components/Page';
import Navigation from '@components/Navigation';
import Card from '@components/Card';
import Button from '@components/Button';
import FeatureRow from '@components/FeatureRow';
import MarketingCube from '@components/MarketingCube';
import SingleColumnLayout from '@components/SingleColumnLayout';
import Chart from '@components/Chart';
import * as C from '@common/constants';
import { H1, H2, H3, H4, P } from '@components/Typography';
import { MarketingUpload, MarketingProgress, MarketingGraph } from '@components/Marketing';

const curl = `curl \n-X POST https://api.estuary.tech/content/add \n-H "Authorization: Bearer YOUR_API_KEY" \n-H "Accept: application/json" \n-H "Content-Type: multipart/form-data" \n-F "data=@PATH_TO_FILE"`;

const retrieve = `lotus client retrieve --miner MINER_ID DATA_CID OUTPUT_FILE_NAME`;

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, api: process.env.ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

const description = 'Use any browser and our API to store public data on IPFS and Filecoin.';

function IndexPage(props: any) {
  const [state, setState] = React.useState({
    miners: [],
    totalStorage: 0,
    totalFilesStored: 0,
    dealsOnChain: 0,
    totalObjectsRef: 0,
    ready: false,
  });
  const [graph, setGraph] = React.useState({ data: null, dealsSealedBytes: 0 });

  React.useEffect(() => {
    const run = async () => {
      let miners;
      let stats;
      try {
        miners = await R.get('/public/miners', props.api);
        stats = await R.get('/api/v1/stats/info', C.api.metricsHost);
      } catch (e) {}

      if ((miners && miners.error) || (stats && stats.error)) {
        return setState({ ...state, miners: [], totalStorage: 0, totalFilesStored: 0, totalObjectsRef: 0, ready: true });
      }

      setState({ ...state, ...stats, miners, ready: true });
    };

    run();
  }, []);

  React.useEffect(() => {
    async function load() {
      let data;
      try {
        data = await R.get('/api/v1/stats/deal-metrics', C.api.metricsHost)

      } catch (e) {
        console.log(e);
        return null;
      }

      if (!data) {
        return null;
      }

      if (data.error) {
        return null;
      }

      let dealsAttempted = 0;
      let dealsAttemptedSet = [];
      let dealsFailed = 0;
      let dealsFailedSet = [];
      let dealsOnChain = 0;
      let dealsOnChainSet = [];
      let dealsOnChainBytes = 0;
      let dealsOnChainBytesSet = [];
      let dealsSealed = 0;
      let dealsSealedSet = [];
      let dealsSealedBytes = 0;
      let dealsSealedBytesSet = [];

      for (let item of data) {
        dealsAttempted = dealsAttempted + item.dealsAttempted;
        dealsFailed = dealsFailed + item.dealsFailed;
        dealsOnChain = dealsOnChain + item.dealsOnChain;
        dealsOnChainBytes = dealsOnChainBytes + item.dealsOnChainBytes;
        dealsSealed = dealsSealed + item.dealsSealed;
        dealsSealedBytes = dealsSealedBytes + item.dealsSealedBytes;

        // TODO(jim): Tell Jeromy this date is annoying
        if (item.time === '0001-01-01T00:00:00Z') {
          continue;
        }

        const date = new Date(item.time);

        dealsAttemptedSet.push({ date, value: dealsAttempted });
        dealsFailedSet.push({ date, value: dealsFailed });
        dealsOnChainSet.push({ date, value: dealsOnChain });
        dealsOnChainBytesSet.push({ date, value: dealsOnChainBytes });
        dealsSealedSet.push({ date, value: dealsSealed });
        dealsSealedBytesSet.push({ date, value: dealsSealedBytes });
      }

      setGraph({
        dealsSealedBytes,
        data: [
          {
            color: 'var(--status-6)',
            name: 'OnChain',
            items: dealsOnChainSet,
          },
          {
            color: 'var(--status-success-bright)',
            name: 'Sealed',
            items: dealsSealedSet,
          },
        ],
      });
    }

    load();
  }, []);

  return (
    <Page title="Estuary" description={description} url={props.hostname}>
      <Navigation active="INDEX" isAuthenticated={props.viewer} />
      <div className={styles.heading}>
        <h1 className={styles.h1}>
          A reliable way to upload public data onto{' '}
          <a className={styles.link} href="https://filecoin.io" target="_blank">
            Filecoin
          </a>{' '}
          and pin it to{' '}
          <a className={styles.link} href="https://ipfs.io" target="_blank">
            IPFS
          </a>
          .
        </h1>
        <p className={styles.caption}>
          Store your public data and guarantee it is available to everyone around the world. Our technology will restore lost data and guarantee data replication.
        </p>

        {!props.viewer ? (
          <div className={styles.action}>
            <button
              className={styles.actionButton}
              onClick={() => {
                window.location.href = 'https://docs.estuary.tech/get-invite-key';
              }}
            >
              Get an invite ➝
            </button>

            <button
              className={styles.actionButton}
              onClick={() => {
                window.location.href = 'https://docs.estuary.tech/get-provider-added';
              }}
            >
              Apply to provide storage ➝
            </button>

            <button
              className={styles.actionButton}
              onClick={() => {
                window.location.href = '/ecosystem';
              }}
            >
              View performance dashboard ➝
            </button>
          </div>
        ) : (
          <div className={styles.action}>
            <button
              className={styles.actionButton}
              onClick={() => {
                window.location.href = '/home';
              }}
            >
              View your files ➝
            </button>
            <button
              className={styles.actionButton}
              onClick={() => {
                window.location.href = 'https://docs.estuary.tech/get-provider-added';
              }}
            >
              Apply to provide storage ➝
            </button>
            <button
              className={styles.actionButton}
              onClick={() => {
                window.location.href = '/ecosystem';
              }}
            >
              View performance dashboard ➝
            </button>
          </div>
        )}
      </div>

      <div className={styles.section} style={{ marginTop: 64 }}>
        <h2 className={styles.h2}>
          Estuary.tech is a demonstration of what an Estuary node can do. Users of this Estuary node have pinned{' '}
          <b>
            {state.totalFilesStored.toLocaleString()} ({U.bytesToSize(state.totalStorage)}) root level CIDs
          </b>{' '}
          to IPFS.{' '}
          {state.totalObjectsRef ? (
            <span>
              Within those root CIDs, there exists a total of <b>{state.totalObjectsRef.toLocaleString()} object references</b>.
            </span>
          ) : null}{' '}
          To ensure the data is permanently available, our node automatically replicates the data <b>6 times</b> onto the Filecoin Network. So far&nbsp;
          <b>{state.dealsOnChain.toLocaleString()}</b> storage deals were successful and that equates to <b>{U.bytesToSize(graph.dealsSealedBytes)}</b> of sealed data.
        </h2>

        <h2 className={styles.h2} style={{ marginTop: 48 }}>
          This node makes storage deals against <b>{state.miners.length} decentralized storage providers</b> and growing. Storage providers who are on our main Estuary Node's list
          have graciously accepted all data as it comes their way, which really helps us test and improve the Filecoin network. When this node successfully stores data, any user of
          this node can verify their{' '}
          <a href="https://proto.school/anatomy-of-a-cid" className={styles.link} target="_blank">
            CID
          </a>{' '}
          is on chain by visiting the{' '}
          <a href="/verify-cid?cid=QmVrrF7DTnbqKvWR7P7ihJKp4N5fKmBX29m5CHbW9WLep9" className={styles.link}>
            verify page
          </a>
          .
        </h2>
      </div>

      <div className={styles.boxes} style={{ marginTop: 64 }}>
        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>API documentation</h3>

              <p className={styles.p}>Are you a developer? Use CURL or our REST API to upload data to our Estuary node in any programming language.</p>
            </div>

            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://docs.estuary.tech" target="_blank">
                Read docs ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Run your own Estuary node</h3>

              <p className={styles.p}>Want to try running an Estuary node? Estuary is completely open source, please take our code!</p>
            </div>

            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://github.com/application-research/estuary" target="_blank">
                View source ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Analytics, collaborations, and logs</h3>

              <p className={styles.p}>Want to see the performance data for this Estuary node? Want to see which storage providers we work with?</p>
            </div>

            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="/ecosystem" target="_blank">
                View dashboard ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Support us</h3>

              <p className={styles.p}>Follow the Application Research Group and Estuary on Twitter.</p>
            </div>

            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://www.twitter.com/aresearchgroup" target="_blank">
                Follow on Twitter ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Provable and verifiable storage</h3>

              <p className={styles.p}>
                All storage has an immutable content address so you always know what you're getting. All deals have receipts before and after getting on chain.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Unlimited uploads</h3>

              <p className={styles.p}>
                For now, there is no limit to how much data a user can upload. For each file there is a <b>32 GiB</b> max size.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Retrievable from any gateway</h3>

              <p className={styles.p}>Data stored with Estuary can be retrieved from any IPFS gateway on the internet.</p>
            </div>

            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://dweb.link/ipfs/QmSX2wCbAeMVXB3Gdfd23MnLW5wxpzE41dG7W1S4d5RXPi" target="_blank">
                Try it ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>FAQ</h3>

              <p className={styles.p}>Check our FAQ for answers to your questions</p>
            </div>
            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://docs.estuary.tech/faq" target="_blank">
                Read FAQ ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Give feedback</h3>

              <p className={styles.p}>Do you have questions about Estuary? Ask your question using this form, everyone on the team will see it.</p>
            </div>
            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://docs.estuary.tech/feedback" target="_blank">
                Give feedback ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Open source</h3>

              <p className={styles.p}>Check out our repositories on GitHub to contribute to our tools to use IPFS, Filecoin and Libp2p.</p>
            </div>
            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://github.com/application-research" target="_blank">
                GitHub ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Filecoin</h3>

              <p className={styles.p}>Filecoin is an open-source cloud storage marketplace, protocol, and incentive layer.</p>
            </div>
            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://filecoin.io" target="_blank">
                Learn more ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Application Research Group</h3>

              <p className={styles.p}>This project is maintained by the Application Research Group.</p>
            </div>
            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://arg.protocol.ai" target="_blank">
                Learn more ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.codeBlock}>
            <div className={styles.boxText}>
              <p className={styles.codeCaption}>CURL UPLOAD EXAMPLE</p>

              <p className={styles.code}>
                curl -X POST https://api.estuary.tech/content/add -H "Authorization: Bearer YOUR_API_KEY" -H "Accept: application/json" -H "Content-Type: multipart/form-data" -F
                "data=@PATH_TO_FILE"
              </p>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.codeBlock}>
            <div className={styles.boxText}>
              <p className={styles.codeCaption}>CLI RETRIEVAL EXAMPLE</p>

              <p className={styles.code}>lotus client retrieve --miner MINER_ID DATA_CID OUTPUT_FILE_NAME</p>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Modify this website</h3>

              <p className={styles.p}>This website is open source. You can make contributions here.</p>
            </div>
            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://github.com/application-research/estuary-www" target="_blank">
                View source ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Get started</h3>

              <p className={styles.p}>Want to follow a step by step guide to learn how to use Estuary? Try our tutorial.</p>
            </div>
            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://docs.estuary.tech/tutorial-get-an-api-key" target="_blank">
                View tutorial ➝
              </a>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default IndexPage;
