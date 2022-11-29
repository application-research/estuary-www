import S from '@pages/index.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';
import * as Logos from '@components/PartnerLogoSVG';

import Page from '@components/Page';
import Chart from '@components/Chart';
import EstuarySVG from '@components/EstuarySVG';
import * as C from '@common/constants';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, api: process.env.ESTUARY_API, hostname: `https://${context.req.headers.host}` },
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
        Uuid: '266fbb9d-56a1-4dea-9b99-9f28054c5522',
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
      //const data = await R.get('/public/metrics/deals-on-chain', props.api);
      const data = await R.get('/api/v1/stats/deal-metrics', C.api.metricsHost)

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
    <Page title={title} description={description} url={`${props.hostname}/ecosystem`}>
      <nav className={S.ecosystemNav}>
        <a className={S.ecosystemEstuaryLogo} href="https://estuary.tech/" target="_blank">
          <EstuarySVG height="64px" color="var(--text-white)" />
        </a>

        <ul className={S.ecosystemNavList}>
          <li className={S.ecosystemNavListItem}>
            <a className={S.ecosystemNavLink} href="#collaborators">
              Collaborators
            </a>
          </li>
          <li className={S.ecosystemNavListItem}>
            <a className={S.ecosystemNavLink} href="#performance">
              Performance
            </a>
          </li>
          <li className={S.ecosystemNavListItem}>
            <a className={S.ecosystemNavLink} href="#deals">
              Deals
            </a>
          </li>
        </ul>
      </nav>

      <div className={S.ecosystem} style={{ display: 'grid', rowGap: '80px' }}>
        <h3 className={S.ecosystemH3} style={{ marginTop: '48px' }}>
          Estuary's performance since April 2021
        </h3>

        <div>
          <h2 id="collaborators" className={S.ecosystemH2}>
            Collaborators
          </h2>

          <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className={S.ecosystemLogo}>
              <div className={S.ecosystemLogoBox}>
                <Logos.Zora className={S.ecosystemImage} />
              </div>
            </div>
            <div className={S.ecosystemLogo}>
              <div className={S.ecosystemLogoBox}>
                <Logos.Portrait className={S.ecosystemImage} />
              </div>
            </div>
            <div className={S.ecosystemLogo}>
              <div className={S.ecosystemLogoBox}>
                <Logos.NBFS className={S.ecosystemImage} />
              </div>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://archive.org/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/203411654-adf169fb-0493-446a-8393-19d932d93618.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://kodadot.xyz/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/203411306-01912ea7-9503-4d6a-9501-e243c7123d89.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://wallet.glif.io/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/203406224-c17a8fd5-fae9-49a0-97c9-3ebf4e704d4f.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://chainsafe.io/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/202939033-a899fadf-5438-44d4-aa09-1c76e660072c.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://opendata.cityofnewyork.us/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/203404943-0d4d5e2f-195b-4b1e-ab2b-e88fae6a3aac.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://app.gala.games/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/202942649-b7237e6a-4c38-487a-b167-07a3833917a5.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://www.vividlabs.com/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/310223/156037345-f93054de-d222-47e9-9653-cd957fc0fcc5.svg" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://w3bmint.xyz/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/203404877-791e53c6-7ec6-48b6-960a-f65c4aa46e29.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://sxxfuture.com/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/202938632-e333f117-21a6-4594-95ea-804337a3d9eb.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://gitopia.com/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/202940154-8c54b568-70cd-4063-b21d-38aee052a063.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://hashaxis.com/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/202942456-d921ed27-c0c1-4d9e-98ae-f0189e740bc1.svg" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://www.labdao.xyz/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/202940852-dda0b5d6-7bb4-4ea3-9c86-ec6bc6286104.svg" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://green.filecoin.io/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/202937974-6d191fae-264f-40b0-b18e-3071b8009802.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://www.cancerimagingarchive.net/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/202939283-c78969dd-2f06-42dd-8823-cb6d23ff3818.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://opsci.io/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/202937956-0c12b60d-8a38-4e9b-9749-3420598276f8.png" />
              </a>
            </div>
            <div className={S.ecosystemLogo}>
              <a className={S.ecosystemLogoBox} href="https://www.bacalhau.org/" target="_blank">
                <img className={S.ecosystemImage} src="https://user-images.githubusercontent.com/28320272/202938869-73f5fcc1-7d0c-4e4c-b2d0-bd1d62ceac39.png" />
              </a>
            </div>
          </div>
        </div>

        <div>
          <h2 id="performance" className={S.ecosystemH2}>
            Performance
          </h2>

          <div className={S.ecosystemPerformance}>
            <div className={S.ecosystemSection}>
              <div className={S.ecosystemStatCard}>
                <div className={S.ecosystemStatValue}>{state.totalFilesStored.toLocaleString()}</div>
                <div className={S.ecosystemStatText}>Total root CIDs uploaded to Estuary. This value does not include sub objects references.</div>
              </div>
            </div>

            <div className={S.ecosystemSection}>
              <div className={S.ecosystemStatCard}>
                <div className={S.ecosystemStatValue}>{state.totalObjectsRef.toLocaleString()}</div>
                <div className={S.ecosystemStatText}>Total number of object references provided by every root CID in the network.</div>
              </div>
            </div>

            <div className={S.ecosystemSection}>
              <div className={S.ecosystemStatCard}>
                <div className={S.ecosystemStatValue}>{state.dealsOnChain.toLocaleString()}</div>
                <div className={S.ecosystemStatText}>Active successful storage deals on the Filecoin Network</div>
              </div>
            </div>

            <div className={S.ecosystemSection}>
              <div className={S.ecosystemStatCard}>
                <div className={S.ecosystemStatValue}>{U.bytesToSize(state.totalStorage)}</div>
                <div className={S.ecosystemStatText}>Total pinned IPFS storage for hot retrieval from any IPFS gateway. This data is not stored on Filecoin</div>
              </div>
            </div>

            {graph.dealsSealedBytes ? (
              <div className={S.ecosystemSection}>
                <div className={S.ecosystemStatCard}>
                  <div className={S.ecosystemStatValue}>{U.bytesToSize(graph.dealsSealedBytes)}</div>
                  <div className={S.ecosystemStatText}>Total sealed storage contributed to Filecoin including a 6x replication</div>
                </div>
              </div>
            ) : null}

            <div className={S.ecosystemSection}>
              <div className={S.ecosystemStatCard}>
                <div className={S.ecosystemStatValue}>{state.miners.length}</div>
                <div className={S.ecosystemStatText}>Total storage providers receiving deals from our Estuary node</div>
              </div>
            </div>

            <div className={S.ecosystemSection}>
              <div className={S.ecosystemStatCard}>
                <div className={S.ecosystemStatValue}>{state.totalUsers}</div>
                <div className={S.ecosystemStatText}>Total registered users</div>
              </div>
            </div>
          </div>

          <div className={S.ecosystemPerformance}>
            {/*{state.environmentDevices}*/}
            {state.environmentDevices != undefined && state.environmentDevices['device_usages'] != undefined
              ? state.environmentDevices['device_usages'].map((device) => {
                  return (
                    <div>
                      <div className={S.ecosystemStatText}>Environment Hosting Cost (last 30 days)</div>
                      <div className={S.ecosystemSection}>
                        <div className={S.ecosystemStatCard}>
                          <div className={S.ecosystemStatValue}>{device['usages'][0]['total']} USD</div>
                          <div className={S.ecosystemStatText}>{device['Info']['name']}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}

            <div className={S.ecosystemSection}>
              <div className={S.ecosystemStatCard}>
                <div className={S.ecosystemStatValue}>
                  {state.environmentDevices != undefined && state.environmentDevices['total'] != undefined ? (
                    <div className={S.ecosystemStatText}>Total Cost (last 30 days)</div>
                  ) : null}
                  {state.environmentDevices != undefined && state.environmentDevices['total'] != undefined ? Math.floor(state.environmentDevices['total']) + ' USD' : null}
                </div>
              </div>
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
          <h2 id="deals" className={S.ecosystemH2}>
            Deals
          </h2>
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
      </div>

      <div className={S.fb} style={{ padding: '48px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', paddingLeft: '8vw', paddingRight: '10vw' }}>
        <div className={S.ecosystemHeading}>
          <a href="https://estuary.tech/" target="_blank" className={S.fcta}>
            <EstuarySVG height="64px" color="var(--text-white)" style={{ marginLeft: '-1vw' }} />
          </a>
        </div>
        <a href="https://arg.protocol.ai" target="_blank" className={S.fcta}>
          Built by ARG
        </a>
        <a href="https://twitter.com/estuary_tech" target="_blank" className={S.fcta}>
          Follow Us
        </a>
      </div>
    </Page>
  );
}

export default EcosystemPage;
