import S from '@pages/index.module.scss';

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

import { H1, H2, H3, H4, P } from '@components/Typography';
import { MarketingUpload, MarketingProgress, MarketingGraph } from '@components/Marketing';

const curl = `curl \n-X POST https://api.estuary.tech/content/add \n-H "Authorization: Bearer YOUR_API_KEY" \n-H "Accept: application/json" \n-H "Content-Type: multipart/form-data" \n-F "data=@PATH_TO_FILE"`;

const retrieve = `lotus client retrieve --miner MINER_ID DATA_CID OUTPUT_FILE_NAME`;

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer },
  };
}

function useWindowSize() {
  const [size, setSize] = React.useState([0, 0]);
  if (!process.browser) {
    return size;
  }

  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function IndexPage(props: any) {
  const [width, height] = useWindowSize();
  const [state, setState] = React.useState({
    miners: [],
    totalStorage: 0,
    totalFiles: 0,
    dealsOnChain: 0,
  });
  const [graph, setGraph] = React.useState({ data: null, dealsSealedBytes: 0 });

  React.useEffect(() => {
    const run = async () => {
      const miners = await R.get('/public/miners');
      const stats = await R.get('/public/stats');

      if ((miners && miners.error) || (stats && stats.error)) {
        return setState({ ...state, miners: [], totalStorage: 0, totalFiles: 0 });
      }

      setState({ ...state, miners, ...stats });
    };

    run();
  }, []);

  React.useEffect(() => {
    async function load() {
      let data;

      try {
        data = await R.get('/public/metrics/deals-on-chain');
      } catch (e) {
        console.log(e);
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
          /* NOTE(jim)
             Asked not to show failure.
          {
            color: 'var(--status-16)',
            name: 'Attempted',
            items: dealsAttemptedSet,
          },
          {
            color: 'var(--status-7)',
            name: 'Failed',
            items: dealsFailedSet,
          },
          */
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
  }, [width]);

  const description = 'Use any browser and our API to store public data on the decentralized Filecoin Network and retrieve it from anywhere.';

  return (
    <Page title="Estuary" description={description} url="https://estuary.tech">
      <Navigation active="INDEX" isAuthenticated={props.viewer} />

      <div className={S.h}>
        <div className={S.ht}>
          {props.viewer ? <H1 style={{ maxWidth: '768px', fontWeight: 600 }}>Welcome back!</H1> : <H1 style={{ maxWidth: '768px', fontWeight: 600 }}>Store your data</H1>}
          <P style={{ marginTop: 12, maxWidth: '768px', fontSize: '1.15rem', opacity: '0.7' }}>{description}</P>
          {props.viewer ? (
            <div className={S.actions}>
              <Button href="/home">View your files</Button>
            </div>
          ) : (
            <div className={S.actions}>
              <Button
                href="https://docs.estuary.tech"
                target="_blank"
                style={{
                  marginRight: 24,
                  marginBottom: 24,
                }}
              >
                Learn more
              </Button>

              <Button
                href="https://docs.estuary.tech/get-invite-key"
                target="_blank"
                style={{
                  background: 'var(--main-button-background-secondary)',
                  color: 'var(--main-button-text-secondary)',
                  marginBottom: 24,
                }}
              >
                Get access
              </Button>
            </div>
          )}
          <div className={S.hbimgc}>
            <div className={S.ca}>
              <div className={S.cb} style={{ background: `var(--main-text)` }}>
                <div className={S.cbt}>CLI ➝ Store</div>
                <div className={S.cbb}>{curl}</div>
              </div>

              <div className={S.cb} style={{ marginTop: 24, background: `var(--main-text)` }}>
                <div className={S.cbt}>CLI ➝ Retrieve</div>
                <div className={S.cbb}>{retrieve}</div>
              </div>

              <div className={S.cb} style={{ marginTop: 24 }}>
                <div className={S.cbt}>Browser ➝ Retrieve via gateway</div>
                <a className={S.cbb} href="https://dweb.link/ipfs/QmTMBh4bCQFgzr1fTCjVb5pRBUe7v9673HTLZWh77sUHUx" target="_blank">
                  https://dweb.link/ipfs/QmTMBh4bCQFgzr1fTCjVb5pRBUe7v9673HTLZWh77sUHUx
                </a>
              </div>
            </div>

            <img className={S.hbimg} src="https://next-s3-public.s3.us-west-2.amazonaws.com/social/estuary.hero.large.png" />
          </div>
        </div>
      </div>

      <div className={S.stats}>
        <div className={S.sc}>
          <div className={S.scn}>{state.totalFiles ? state.totalFiles.toLocaleString() : null}</div>
          <div className={S.scl}>Total files</div>
        </div>
        <div className={S.sc}>
          <div className={S.scn}>{state.dealsOnChain}</div>
          <div className={S.scl}>Deals on chain</div>
        </div>
        <div className={S.sc}>
          <div className={S.scn}>{U.bytesToSize(state.totalStorage)}</div>
          <div className={S.scl}>Total pinned data</div>
        </div>
        {graph.dealsSealedBytes ? (
          <div className={S.sc}>
            <div className={S.scn}>{U.bytesToSize(graph.dealsSealedBytes)}</div>
            <div className={S.scl}>Total sealed storage</div>
          </div>
        ) : null}
      </div>

      <SingleColumnLayout style={{ textAlign: 'center', marginBottom: 24 }}>
        <H2 style={{ margin: '0 auto 0 auto' }}>Filecoin storage made easy</H2>
        <P style={{ marginTop: 12, maxWidth: '768px', fontSize: '1.15rem', opacity: '0.7' }}>
          Estuary makes using Filecoin as easy as uploading a file. Now you can make storage deals without having to understand how it works.
        </P>
        <div className={S.actions}>
          <Button href="/comparisons">Compare to Cloud Storage</Button>
        </div>
      </SingleColumnLayout>

      <div className={S.r}>
        <div className={S.rl}>
          <div className={S.rtext}>Upload public data</div>
          <FeatureRow>
            <strong>No minimum size</strong>. 32 GB maximum per file.
          </FeatureRow>
          <FeatureRow>
            <strong>Use this website, or our API</strong>. Check out our{' '}
            <a href="https://docs.estuary.tech" target="_blank">
              documentation
            </a>
            .
          </FeatureRow>
          <FeatureRow>
            <strong>Global access.</strong> Retrieve your data from any IPFS gateway or Filecoin miner directly.
          </FeatureRow>
        </div>
        <div className={S.rr} style={{ background: `#000` }}>
          <video className={S.video} controls src="https://ipfs.io/ipfs/bafybeiaxlts3bqrsywzcymnp3lv7rrqarszntge455yav26ekfvhbxkjfm" autoPlay={true} playsInline muted loop />
          {/* <MarketingUpload estimate="0" price="0" size="792259920" replication="6" duration={1051200} verified={true} /> */}
        </div>
      </div>

      <div className={S.r}>
        <div className={S.rl}>
          <div className={S.rtext}>Provable storage</div>
          <FeatureRow>
            <strong>Interoperable</strong>. All storage is accessible from any IPFS gateway.
          </FeatureRow>
          <FeatureRow>
            <strong>Verifiable</strong>. All storage has an immutable content address so you always know what you're getting. All deals have receipts before and after getting on
            chain.
          </FeatureRow>
          <FeatureRow>
            <strong>Detailed</strong>. Learn exactly how your data is stored and with which provider in the world.
          </FeatureRow>
        </div>
        <div className={S.rr}>
          <MarketingProgress />
        </div>
      </div>

      <SingleColumnLayout style={{ textAlign: 'center' }}>
        <H2 style={{ margin: '0 auto 0 auto' }}>Open source code and public logs</H2>
        <P style={{ marginTop: 12, maxWidth: '768px', fontSize: '1.15rem', opacity: '0.7' }}>
          Logs from your Storage providers are public so we can help debug and triage issues with the Filecoin Network.
        </P>

        <div className={S.actions}>
          <Button
            href="https://docs.estuary.tech/feedback"
            target="_blank"
            style={{
              background: `var(--main-primary)`,
            }}
          >
            Give us feedback
          </Button>
        </div>
      </SingleColumnLayout>

      {graph.data ? (
        <div className={S.graphArea}>
          <Chart
            data={graph.data}
            dimensions={{
              width: width - 88,
              height: 480 + 20,
              margin: {
                top: 30,
                right: 30,
                bottom: 30,
                left: 60,
              },
            }}
          />
        </div>
      ) : null}

      <footer className={S.f}>
        {graph.data ? (
          <div className={S.fa}>
            {graph.data.map((each) => {
              return (
                <div className={S.fcol4} key={each.name}>
                  <div className={S.graphItem} style={{ background: each.color, color: `var(--main-text)` }}>
                    {each.name}: {each.items[each.items.length - 1].value}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        <div className={S.fa}>
          <div className={S.fcol4}>
            <span className={S.flink}>Index</span>
          </div>
          <div className={S.fcolfull}>
            <span className={S.flink}>All of the storage providers that take storage from this Estuary node.</span>
          </div>
        </div>
        {state.miners.map((each, index) => {
          if (each.suspended) {
            return (
              <div className={S.fa} key={each.addr}>
                <div className={S.fcol4}>
                  <span className={S.flink} style={{ background: `var(--status-error)` }}>
                    {each.addr} suspended
                  </span>
                </div>
                <div className={S.fcolfull}>
                  <span className={S.flink} style={{ background: `var(--status-error)` }}>
                    reason: {each.suspendedReason}
                  </span>
                </div>
              </div>
            );
          }

          const indexValue = U.pad(index, 4);

          return (
            <div className={S.fam} key={each.addr}>
              <div className={S.fcol4}>
                <a className={S.flink} href={`/providers/stats/${each.addr}`}>
                  {indexValue} {!U.isEmpty(each.name) ? `— ${each.name}` : null}
                </a>
              </div>
              <div className={S.fcol4}>
                <a className={S.flink} href={`/providers/stats/${each.addr}`}>
                  ➝ {each.addr}/stats
                </a>
              </div>
              <div className={S.fcol4}>
                <a className={S.flink} href={`/providers/deals/${each.addr}`}>
                  ➝ {each.addr}/deals
                </a>
              </div>
              <div className={S.fcol4}>
                <a className={S.flink} href={`/providers/errors/${each.addr}`}>
                  ➝ {each.addr}/errors
                </a>
              </div>
            </div>
          );
        })}
      </footer>

      <div className={S.fb}>
        <a href="https://arg.protocol.ai" target="_blank" className={S.fcta}>
          ➝ Built by ꧁𓀨꧂
        </a>
      </div>
    </Page>
  );
}

export default IndexPage;
