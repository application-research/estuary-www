import S from '@pages/index.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as Logos from '@components/PartnerLogoSVG';
import * as React from 'react';

import * as C from '@common/constants';
import Chart from '@components/Chart';
import Page from '@components/Page';

import Footer from '@root/components/Footer';
import ResponsiveNavbar from '@root/components/ResponsiveNavbar';
import Link from 'next/link';

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
    uuids: [
      {
        Uuid: '766557e4-1c14-4bef-a5b2-d974bbb2d848',
        Name: 'Estuary API',
      },
      {
        Uuid: '60352064-7b2c-4597-baf6-9df128e9242b',
        Name: 'Shuttle-1',
      },
      {
        Uuid: 'ed16760d-ec36-4d71-b46f-378428c1d774',
        Name: 'Shuttle-2',
      },

      {
        Uuid: '266fbb9d-56a1-4dea-9b99-9f28054c5522',
        Name: 'Shuttle-4',
      },
      {
        Uuid: '20e7cd76-c65c-48a1-871e-39b692f051b3',
        Name: 'Shuttle-5',
      },
      {
        Uuid: '266fbb9d-56a1-4dea-9b99-9f28054c5522',
        Name: 'Shuttle-6',
      },
      {
        Uuid: '3c924716-f30e-4afd-a073-98204e4a96a7',
        Name: 'Shuttle-7',
      },
      {
        Uuid: '8ceea3cd-7608-4428-8d6b-99f2acc80ce3',
        Name: 'Shuttle-8',
      },
      {
        Uuid: '43cfdfa5-6037-4520-9e4c-c46f4d3686a1',
        Name: 'Autoretrieve Server',
      },
      {
        Uuid: 'a8e5d22b-13ef-4dc9-adcf-a3b2bb4a8863',
        Name: 'Upload Proxy Server',
      },
      {
        Uuid: 'e4d0efb1-1b5b-4aaf-a6ed-37c4a6cc2c6f',
        Name: 'Backup Server',
      },
    ],
  };

  React.useEffect(() => {
    const run = async () => {
      const miners = await R.get('/public/miners', props.api);
      const stats = await R.get('/api/v1/stats/info', C.api.metricsHost);
      const environment = await R.post('/api/v1/environment/equinix/list/usages', staticEnvironmentPayload, C.api.metricsHost);

      if ((miners && miners.error) || (stats && stats.error)) {
        return setState({ ...state, miners: [], totalStorage: 0, totalFilesStored: 0, totalObjectsRef: 0, environmentDevices: environment });
      }
      setState({ ...state, miners, ...stats, environmentDevices: environment });
    };
    console.log(state.environmentDevices);
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

  const description = 'Learn how well our Estuary node is performing and which collaborators are working with us.';
  const title = 'Estuary: Ecosystem dashboard.';

  return (
    <Page title={title} description={description} url={`${props.hostname}/ecosystem`}>
      <ResponsiveNavbar />
      <div className={S.ecosystem}>
        <div>
          <h3 className={S.ecosystemH3} style={{ marginTop: '48px' }}>
            Estuary's performance since April 2021
          </h3>
          <h2 id="collaborators" className={S.ecosystemH2} style={{ paddingTop: '80px' }}>
            Collaborators
          </h2>

          <div className={S.collaborations}>
            <div className={S.container}>
              <div className={S.column}>
                <div className={S.ecosystemLogoBox}>
                  <Logos.Zora height="35px" className={S.ecosystemImage} />
                </div>
              </div>
              <div className={S.column}>
                <div className={S.ecosystemLogoBox}>
                  <Logos.Portrait height="35px" className={S.ecosystemImage} />
                </div>
              </div>
              <div className={S.column}>
                <div className={S.ecosystemLogoBox}>
                  <Logos.NBFS height="30px" width="160px" className={S.ecosystemImage} />
                </div>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://archive.org/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/203411654-adf169fb-0493-446a-8393-19d932d93618.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://kodadot.xyz/" target="_blank">
                  <img height="60vh" src="https://user-images.githubusercontent.com/28320272/203411306-01912ea7-9503-4d6a-9501-e243c7123d89.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://wallet.glif.io/" target="_blank">
                  <img height="80vh" src="https://user-images.githubusercontent.com/28320272/203406224-c17a8fd5-fae9-49a0-97c9-3ebf4e704d4f.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://chainsafe.io/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202939033-a899fadf-5438-44d4-aa09-1c76e660072c.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://opendata.cityofnewyork.us/" target="_blank">
                  <img height="80vh" src="https://user-images.githubusercontent.com/28320272/203404943-0d4d5e2f-195b-4b1e-ab2b-e88fae6a3aac.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://app.gala.games/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202942649-b7237e6a-4c38-487a-b167-07a3833917a5.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://www.vividlabs.com/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/310223/156037345-f93054de-d222-47e9-9653-cd957fc0fcc5.svg" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://w3bmint.xyz/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/203404877-791e53c6-7ec6-48b6-960a-f65c4aa46e29.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://sxxfuture.com/" target="_blank">
                  <img height="35vh" src="https://user-images.githubusercontent.com/28320272/204052332-56be823b-b058-4232-96a5-ef3d569dcc56.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://gitopia.com/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202940154-8c54b568-70cd-4063-b21d-38aee052a063.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://hashaxis.com/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202942456-d921ed27-c0c1-4d9e-98ae-f0189e740bc1.svg" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://www.labdao.xyz/" target="_blank">
                  <img height="45vh" src="https://user-images.githubusercontent.com/28320272/202940852-dda0b5d6-7bb4-4ea3-9c86-ec6bc6286104.svg" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://green.filecoin.io/" target="_blank">
                  <img height="70vh" src="https://user-images.githubusercontent.com/28320272/202937974-6d191fae-264f-40b0-b18e-3071b8009802.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://www.cancerimagingarchive.net/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202939283-c78969dd-2f06-42dd-8823-cb6d23ff3818.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://opsci.io/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202937956-0c12b60d-8a38-4e9b-9749-3420598276f8.png" />
                </Link>
              </div>
              <div className={S.column}>
                <Link className={S.ecosystemLogoBox} href="https://www.bacalhau.org/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202938869-73f5fcc1-7d0c-4e4c-b2d0-bd1d62ceac39.png" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 id="performance" className={S.ecosystemH2}>
            Performance
          </h2>

          <div className={S.ecosystemPerformance} style={{ paddingBottom: '16px' }}>
            <div className={S.ecosystemSectionWithIcon}>
              <div className={S.ecosystemStatCardWithIcon}>
                <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205302299-2e2a2c08-d071-447d-9c57-b139583ac9a2.gif" />

                <div className={S.ecosystemStatValueWithIcon}>
                  {state.totalFilesStored.toLocaleString()}
                  <div className={S.ecosystemStatText}>Total root CIDs uploaded to Estuary. This value does not include sub objects references.</div>
                </div>
              </div>
            </div>

            <div className={S.ecosystemSectionWithIcon}>
              <div className={S.ecosystemStatCardWithIcon}>
                <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205301350-28c38449-1e3d-41d1-9816-790008e4fbee.gif" />

                <div className={S.ecosystemStatValueWithIcon}>
                  {state.totalObjectsRef.toLocaleString()} <div className={S.ecosystemStatText}>Total number of object references provided by every root CID in the network.</div>
                </div>
              </div>
            </div>

            <div className={S.ecosystemSectionWithIcon}>
              <div className={S.ecosystemStatCardWithIcon}>
                <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205301608-742949ad-63b4-4cf0-9813-707459650bee.gif" />

                <div className={S.ecosystemStatValueWithIcon}>
                  {state.dealsOnChain.toLocaleString()} <div className={S.ecosystemStatText}>Active successful storage deals on the Filecoin Network</div>
                </div>
              </div>
            </div>

            <div className={S.ecosystemSectionWithIcon}>
              <div className={S.ecosystemStatCardWithIcon}>
                <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205301746-297295d4-a576-4d28-9d7c-2feada68aa5f.gif" />

                <div className={S.ecosystemStatValueWithIcon}>
                  {U.bytesToSize(state.totalStorage)}
                  <div className={S.ecosystemStatText}>Total pinned IPFS storage for hot retrieval from any IPFS gateway. This data is not stored on Filecoin</div>
                </div>
              </div>
            </div>

            {graph.dealsSealedBytes ? (
              <div className={S.ecosystemSectionWithIcon}>
                <div className={S.ecosystemStatCardWithIcon}>
                  <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205651552-40090d3d-70b3-4896-a832-c198631f5c9b.gif" />

                  <div className={S.ecosystemStatValueWithIcon}>
                    {U.bytesToSize(graph.dealsSealedBytes)} <div className={S.ecosystemStatText}>Total sealed storage contributed to Filecoin including a 6x replication</div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className={S.ecosystemSectionWithIcon}>
              <div className={S.ecosystemStatCardWithIcon}>
                <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205303934-d95ea7a6-e13d-482a-94a4-cedb99998568.gif" />

                <div className={S.ecosystemStatValueWithIcon}>
                  <p>{state.miners.length}</p>
                  <p className={S.ecosystemStatText}>Total storage providers receiving deals from our Estuary node</p>
                </div>
              </div>
            </div>

            <div className={S.ecosystemSectionWithIcon}>
              <div className={S.ecosystemStatCardWithIcon}>
                <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205304639-59eee09d-3b92-4952-b67f-8329500817b7.gif" />

                <div className={S.ecosystemStatValueWithIcon}>
                  {state.totalUsers}
                  <div className={S.ecosystemStatText}>Total registered users</div>
                </div>
              </div>
            </div>
          </div>
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
              <div className={S.ecosystemSection}>
                <div className={S.ecosystemStatCard}>
                  <div className={S.ecosystemStatValue}>
                    {state.environmentDevices != undefined && state.environmentDevices['total'] != undefined ? Math.floor(state.environmentDevices['total']) + ' USD' : null}
                  </div>
                  {state.environmentDevices != undefined && state.environmentDevices['total'] != undefined ? (
                    <div className={S.ecosystemStatLabel}>Total Cost (last 30 days)</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 id="deals" className={S.ecosystemH2} style={{ paddingBottom: '0px' }}>
          Deals
        </h2>
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

        <div className={S.ecosystemPerformanceTable}>
          <div>
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
          </div>

          <div className={S.fa}>
            <div className={S.fcol4}>
              <span className={S.flink} style={{ fontSize: '16px' }}>
                Index
              </span>
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
                  <Link className={S.flink} href={`/providers/stats/${each.addr}`}>
                    {indexValue} {!U.isEmpty(each.name) ? `— ${each.name}` : null}
                  </Link>
                </div>
                <div className={S.fcol4}>
                  <Link className={S.flink} href={`/providers/stats/${each.addr}`}>
                    ➝ {each.addr}/stats
                  </Link>
                </div>
                <div className={S.fcol4}>
                  <Link className={S.flink} href={`/providers/deals/${each.addr}`}>
                    ➝ {each.addr}/deals
                  </Link>
                </div>
                <div className={S.fcol4}>
                  <Link className={S.flink} href={`/providers/errors/${each.addr}`}>
                    ➝ {each.addr}/errors
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </Page>
  );
}

export default EcosystemPage;
