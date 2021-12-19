import S from '@pages/index.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';
import * as Logos from '@components/PartnerLogoSVG';

import Page from '@components/Page';
import Navigation from '@components/Navigation';
import Card from '@components/Card';
import Button from '@components/Button';
import FeatureRow from '@components/FeatureRow';
import MarketingCube from '@components/MarketingCube';
import SingleColumnLayout from '@components/SingleColumnLayout';
import ComparisonWeb3 from '@components/ComparisonWeb3';
import Chart from '@components/Chart';
import EstuarySVG from '@components/EstuarySVG';

import { H1, H2, H3, H4, P } from '@components/Typography';
import { MarketingUpload, MarketingProgress, MarketingGraph } from '@components/Marketing';

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

function EcosystemPage(props: any) {
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
    const load = async () => {
      const data = await R.get('/public/metrics/deals-on-chain');

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
    };

    load();
  }, [width]);

  const description = 'Learn how well our Estuary node is performing and which collaborators are working with us.';
  const title = 'Estuary: Ecosystem dashboard.';

  return (
    <Page title={title} description={description} url="https://estuary.tech/ecosystem">
      <div className={S.ecosystem}>
        <div className={S.ecosystemHeading}>
          <EstuarySVG height="64px" />

          <p className={S.ecosystemParagraph} style={{ fontSize: 16 }}>
            Estuary's performance since April 2021
          </p>
        </div>

        <div className={S.ecosystemHeading}>
          <p className={S.ecosystemParagraph}>Collaborators</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Logos.Zora height="48px" style={{ margin: 22, flexShrink: 0 }} />
            <Logos.QRI height="48px" style={{ margin: 22, flexShrink: 0 }} />
            <Logos.IA height="48px" style={{ margin: 22, flexShrink: 0 }} />
            <Logos.Portrait height="48px" style={{ margin: 22, flexShrink: 0 }} />
            <Logos.GainForest style={{ margin: 22, height: 48, flexShrink: 0 }} />
            <Logos.NBFS style={{ margin: 22, height: 48, flexShrink: 0 }} />
          </div>
        </div>

        <div className={S.ecosystemSection}>
          <div className={S.ecosystemStatCard}>
            <div className={S.ecosystemStatValue}>{state.totalFiles.toLocaleString()}</div>
            <div className={S.ecosystemStatText}>Total files uploaded by all users using the primary Estuary node</div>
          </div>
        </div>

        <div className={S.ecosystemSection}>
          <div className={S.ecosystemStatCard}>
            <div className={S.ecosystemStatValue}>{state.dealsOnChain.toLocaleString()}</div>
            <div className={S.ecosystemStatText}>Active storage deals on the Filecoin Network</div>
          </div>
        </div>

        <div className={S.ecosystemSection}>
          <div className={S.ecosystemStatCard}>
            <div className={S.ecosystemStatValue}>{U.bytesToSize(state.totalStorage)}</div>
            <div className={S.ecosystemStatText}>Total pinned IPFS storage for hot retrieval from IPFS gateways</div>
          </div>
        </div>

        {graph.dealsSealedBytes ? (
          <div className={S.ecosystemSection}>
            <div className={S.ecosystemStatCard}>
              <div className={S.ecosystemStatValue}>{U.bytesToSize(graph.dealsSealedBytes)}</div>
              <div className={S.ecosystemStatText}>Total sealed storage on Filecoin including replication</div>
            </div>
          </div>
        ) : null}

        <div className={S.ecosystemSection}>
          <div className={S.ecosystemStatCard}>
            <div className={S.ecosystemStatValue}>{state.miners.length}</div>
            <div className={S.ecosystemStatText}>Total storage providers receiving deals from our Estuary node</div>
          </div>
        </div>
      </div>

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
            return null;
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
          ➝ Built by ARG
        </a>
      </div>
    </Page>
  );
}

export default EcosystemPage;
