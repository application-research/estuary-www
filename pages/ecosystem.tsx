import S from '@pages/index.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import * as C from '@common/constants';
import Page from '@components/Page';

import Footer from '@root/components/Footer';
import ResponsiveNavbar from '@root/components/ResponsiveNavbar';
import Hero from '@root/components/Hero';
import Collaborators from '@root/components/Collaborators';
import CardWithIcon from '@root/components/CardWithIcon';
import { SHUTTLE_UUID_FIXTURE } from '@root/components/fixtures/EcosystemPage';
import MultilineChart from '@root/components/Chart';
import Table from '@root/components/Table';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
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
    totalFilesStored: 0,
    dealsOnChain: 0,
    totalUsers: 0,
    totalStorageMiner: 0,
    totalObjectsRef: 0,
    environmentDevices: null,
  });

  const [graph, setGraph] = React.useState({ data: null, dealsSealedBytes: 0 });

  // get current date and 30 days before
  var today = new Date();
  var priorDate = new Date(new Date().setDate(today.getDate() - 30));

  // reformat date
  var before = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
  var after = priorDate.getDate() + '-' + (priorDate.getMonth() + 1) + '-' + priorDate.getFullYear();

  //  static payload
  var staticEnvironmentPayload = {
    createdBefore: before,
    createdAfter: after,
    uuids: SHUTTLE_UUID_FIXTURE,
  };

  React.useEffect(() => {
    const run = async () => {
      const miners = await R.get('/public/miners', props.api);
      const minerData = await R.get(`/public/miners/stats/${props.id}`, props.api);

      const stats = await R.get('/api/v1/stats/info', C.api.metricsHost);
      const environment = await R.post('/api/v1/environment/equinix/list/usages', staticEnvironmentPayload, C.api.metricsHost);
      console.log('MINER data', minerData);
      if ((miners && miners.error) || (stats && stats.error)) {
        return setState({ ...state, miners: [], totalStorage: 0, totalFilesStored: 0, totalObjectsRef: 0, environmentDevices: environment });
      }
      setState({ ...state, miners, ...stats, environmentDevices: environment });
    };
    ///console.log(state.environmentDevices);
    run();
  }, []);

  React.useEffect(() => {
    const load = async () => {
      const data = await R.get('/api/v1/stats/deal-metrics', C.api.metricsHost);

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
            name: 'On Chain',
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

  // const [userData, setUserData] = React.useState({
  //   labels: [
  //     state.environmentDevices['device_usages'] != undefined &&
  //       state.environmentDevices['device_usages'].map((device) => {
  //         device['Info']['name'];
  //       }),
  //   ],
  //   datasets: [
  //     state.environmentDevices['device_usages'].map((device) => {
  //       device['usages'][0]['total'];
  //     }),
  //   ],
  // });
  // state.environmentDevices['device_usages'].map((device) => {
  //   device['Info']['name'];
  // }),
  console.log();
  const description =
    "Since April of 2021, Estuary made significant strides in growing it's ecosystem. We're excited to share our progress with you and look forward to continuing to grow this community.";
  const title = 'Estuary: Ecosystem dashboard.';

  return (
    <Page title={title} description={description} url={`${props.hostname}/ecosystem`}>
      <ResponsiveNavbar />
      <Hero
        heading={"Estuary's Ecosystem"}
        caption={
          "Since April of 2021, Estuary made significant strides in growing it's ecosystem. We're excited to share our progress with you and look forward to continuing to grow this community."
        }
      />
      <div className={S.ecosystem}>
        <div>
          <div style={{ marginBottom: '8px', display: 'grid', rowGap: '16px' }}>
            <h2 id="collaborators" className={S.ecosystemH2} style={{ paddingTop: '80px' }}>
              Collaborators
            </h2>
            <p className={S.caption} style={{ color: 'var(--text-white)', fontFamily: 'Mono', marginBottom: '16px', maxWidth: '75ch' }}>
              From data storage to custom app development, these companies are leading the way with Estuary
            </p>
          </div>

          <Collaborators />
        </div>

        <div style={{ display: 'grid', rowGap: '16px' }}>
          <h2 id="performance" className={S.ecosystemH2}>
            Performance
          </h2>

          <div className={S.ecosystemPerformance} style={{ paddingBottom: '16px' }}>
            {state.totalFilesStored && (
              <CardWithIcon
                statistic={state.totalFilesStored.toLocaleString()}
                caption={'Total root CIDs uploaded to Estuary. This value does not include sub objects references'}
                icon="https://user-images.githubusercontent.com/28320272/205302299-2e2a2c08-d071-447d-9c57-b139583ac9a2.gif"
              />
            )}

            {state.totalObjectsRef && (
              <CardWithIcon
                statistic={state.totalObjectsRef.toLocaleString()}
                caption={'Total number of object references provided by every root CID in the network'}
                icon="https://user-images.githubusercontent.com/28320272/205301350-28c38449-1e3d-41d1-9816-790008e4fbee.gif"
              />
            )}

            {state.dealsOnChain && (
              <CardWithIcon
                statistic={state.dealsOnChain.toLocaleString()}
                caption={'Active successful storage deals on the Filecoin Network'}
                icon="https://user-images.githubusercontent.com/28320272/205301608-742949ad-63b4-4cf0-9813-707459650bee.gif"
              />
            )}

            {state.totalStorage && (
              <CardWithIcon
                statistic={U.bytesToSize(state.totalStorage)}
                caption={'Total pinned IPFS storage for hot retrieval from any IPFS gateway. This data is not stored on Filecoin'}
                icon="https://user-images.githubusercontent.com/28320272/205301746-297295d4-a576-4d28-9d7c-2feada68aa5f.gif"
              />
            )}

            {state.totalUsers && (
              <CardWithIcon
                statistic={state.totalUsers.toLocaleString()}
                caption={'Total pinned IPFS storage for hot retrieval from any IPFS gateway. This data is not stored on Filecoin'}
                icon="https://user-images.githubusercontent.com/28320272/205304639-59eee09d-3b92-4952-b67f-8329500817b7.gif"
              />
            )}
          </div>

          {/* <div className={S.ecosystemPerformance} style={{ marginTop: '40px' }}>
            <BarChart data={userData} />
          </div> */}

          <div className={S.ecosystemPerformance} style={{ marginTop: '40px' }}>
            {/*{state.environmentDevices}*/}
            {state.environmentDevices != undefined && state.environmentDevices['device_usages'] != undefined
              ? state.environmentDevices['device_usages'].map((device) => {
                  return (
                    <div className={S.ecosystemShuttleData}>
                      <div className={S.ecosystemStatText}>Environment Hosting Cost (last 30 days)</div>
                      <div className={S.ecosystemSection}>
                        <div className={S.ecosystemStatCard}>
                          <div className={S.ecosystemStatValue}>{device['usages'][0]['total']} USD</div>
                          <div className={S.ecosystemStatLabel}>{device['Info']['name']}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}

            <div className={S.ecosystemShuttleData}>
              <div className={S.ecosystemStatText}>Total Cost</div>

              <div className={S.ecosystemSection}>
                <div className={S.ecosystemStatCard}>
                  <div className={S.ecosystemStatValue}>
                    {state.environmentDevices != undefined && state.environmentDevices['total'] != undefined ? Math.floor(state.environmentDevices['total']) + ' USD' : null}
                  </div>
                  {state.environmentDevices != undefined && state.environmentDevices['total'] != undefined ? <div className={S.ecosystemStatLabel}>Last 30 days</div> : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {graph.data ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', rowGap: '16px' }}>
            <h2 id="deals" className={S.ecosystemH2}>
              Deals
            </h2>
            <div style={{ gridColumn: 'span 4' }}>
              <div className={S.graphArea}>
                <MultilineChart
                  data={graph.data}
                  dimensions={{
                    width: width - 350,
                    height: 480,
                    margin: {
                      top: 30,
                      right: 30,
                      bottom: 30,
                      left: 60,
                    },
                  }}
                />
              </div>

              {/* <div style={{ gridColumn: 'span 4' }}> */}

              {/* </div> */}
            </div>
          </div>
        ) : null}

        {/* <Table /> */}

        {/* <div className={S.ecosystemPerformanceTable}>
          <div style={{ display: 'grid', rowGap: '12px' }}>
            <h2 id="deals" className={S.ecosystemH2}>
              Storage Providers
            </h2>
            <p className={S.caption} style={{ color: 'var(--text-white)', fontFamily: 'Mono', marginBottom: '16px', maxWidth: '75ch' }}>
              All of the storage providers that take storage from this Estuary node
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
            <div className={S.spColumn}>
              <span className={S.flink}>Index</span>
            </div>
            <div className={S.spColumn}>
              <span className={S.flink}>Owner's ID</span>
            </div>
            <div className={S.spColumn}>
              <span className={S.flink}>Stats</span>
            </div>
            <div className={S.spColumn}>
              <span className={S.flink}>Deals</span>
            </div>
            <div className={S.spColumn}>
              <span className={S.flink}>Errors</span>
            </div>
          </div>

          {state.miners.map((each, index) => {
            if (each.suspended) {
              return null;
            }

            const indexValue = U.pad(index, 4);

            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                <div className={S.spColumn}>
                  <span className={S.flink}>
                    <a className={S.flink} href={`/providers/stats/${each.addr}`}>
                      {indexValue} {!U.isEmpty(each.name) ? `— ${each.name}` : null}
                    </a>
                  </span>
                </div>
                <div className={S.spColumn}>
                  <span className={S.flink}>
                    <a className={S.flink} href={`/providers/stats/${each.addr}`}>
                      {each.addr}
                    </a>
                  </span>
                </div>
                <div className={S.spColumn}>
                  <span className={S.flink}>
                    <a className={S.flink} href={`/providers/stats/${each.addr}`}>
                      ➝ {each.addr}/stats
                    </a>
                  </span>
                </div>
                <div className={S.spColumn}>
                  <span className={S.flink}>
                    <a className={S.flink} href={`/providers/deals/${each.addr}`}>
                      ➝ {each.addr}/deals
                    </a>
                  </span>
                </div>
                <div className={S.spColumn}>
                  <span className={S.flink}>
                    <a className={S.flink} href={`/providers/errors/${each.addr}`}>
                      ➝ {each.addr}/errors
                    </a>
                  </span>
                </div>
              </div>
            );
          })}
        </div> */}
      </div>
      <Footer />
    </Page>
  );
}

export default EcosystemPage;
