import styles from '@pages/new-index.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import * as C from '@common/constants';
import Navigation from '@components/Navigation';
import Page from '@components/Page';

const curl = `curl \n-X POST https://api.estuary.tech/content/add \n-H "Authorization: Bearer YOUR_API_KEY" \n-H "Accept: application/json" \n-H "Content-Type: multipart/form-data" \n-F "data=@PATH_TO_FILE"`;

const retrieve = `lotus client retrieve --miner MINER_ID DATA_CID OUTPUT_FILE_NAME`;

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

const description = 'Use any browser and our API to store public data on IPFS and Filecoin.';

function IndexPage(props: any) {
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
        <p className={styles.caption}>We're building an open source platform that allows any developer to upload public data to Filecoin and retrieve it.</p>

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
              See who uses us ➝
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

      <div className={styles.section}>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            Estuary.tech is free while the service is in development. We will let the public know a year in advance before we charge money for anything you depend on. For now,
            there is no limit to uploads, but for each file there is a <b>32 GiB</b> max size.
          </li>
          <li className={styles.listItem}>
            Check out{' '}
            <a className={styles.link} href="https://storage.market">
              Storage Market
            </a>{' '}
            to see how our price compares to 300+ other Web2 or Web3 services.
          </li>
          <li className={styles.listItem}>The technology is developed by the Outercore: Engineering team at Protocol Labs.</li>
          <li className={styles.listItem}>
            Estuary.tech provides storage through{' '}
            <a className={styles.link} href="https://proto.school/content-addressing">
              immutable content address pinning
            </a>
            . This is just like any{' '}
            <a className={styles.link} href="https://github.com/ipfs/kubo">
              IPFS Node
            </a>
            , or popular services like{' '}
            <a className={styles.link} href="https://www.pinata.cloud/">
              Pinata
            </a>{' '}
            and{' '}
            <a className={styles.link} href="https://web3.storage">
              Web3 Storage
            </a>
            .
          </li>
          <li className={styles.listItem}>
            All deals have receipts before and after getting on chain. Every piece of data gets uploaded to Filecoin six times. See the example of a{' '}
            <a className={styles.link} href="https://estuary.tech/verify-cid?cid=QmVrrF7DTnbqKvWR7P7ihJKp4N5fKmBX29m5CHbW9WLep9">
              storage deal receipt
            </a>
            . Each Receipt has instructions of how to retrieve.
          </li>
          <li className={styles.listItem}>We need to achive 99.99% uptime, we are working on it.</li>
          <li className={styles.listItem}>Our goal is one hundred terabytes of data ingestion a week.</li>
          <li className={styles.listItem}>
            You can contribute to the development of our technology on{' '}
            <a className={styles.link} href="https://github.com/application-research/estuary">
              GitHub
            </a>
            . Did you know every line of our service is open source? We built it all in the public. You could take everything to build your own at any time!
          </li>
          <li className={styles.listItem}>
            <a className={styles.link} href="https://txt.dev/jim/estuary-2023">
              Our plans for 2023
            </a>
            .
          </li>
          <li className={styles.listItem}>Stay tuned for our redesign.</li>
          <li className={styles.listItem}>
            We are available 24/7 in the{' '}
            <a className={styles.link} href="https://filecoin.io/slack">
              Filecoin Slack
            </a>
            . Join the #ecosystem-dev channel.
          </li>
          <li className={styles.listItem}>We support white-labeling. Ask us about this if you're interested.</li>
        </ul>
      </div>
      <div className={styles.boxes} style={{ marginTop: 64 }}>
        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>API documentation</h3>
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
              <h3 className={styles.h3}>Support us</h3>

              <p className={styles.p}>Follow us on Twitter!</p>
            </div>

            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://www.twitter.com/estuary_tech" target="_blank">
                Follow on Twitter ➝
              </a>
            </div>
          </div>
        </div>

        <div className={styles.slot}>
          <div className={styles.box}>
            <div className={styles.boxText}>
              <h3 className={styles.h3}>Give feedback</h3>

              <p className={styles.p}>We read everything.</p>
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
              <h3 className={styles.h3}>Modify this website</h3>

              <p className={styles.p}>This website is open source. Make changes here:</p>
            </div>
            <div className={styles.action}>
              <a className={styles.actionButtonLink} href="https://github.com/application-research/estuary-www" target="_blank">
                View source ➝
              </a>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default IndexPage;
