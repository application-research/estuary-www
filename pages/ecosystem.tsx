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
  var before = today.getDate() + "-"+ (today.getMonth() + 1)+ "-"+ today.getFullYear()
  var after = priorDate.getDate() + "-"+ (priorDate.getMonth() + 1)+ "-"+ priorDate.getFullYear()

  //  static payload
  var staticEnvironmentPayload = {
    "createdBefore": before,
    "createdAfter": after,
    "uuids": [{
      "Uuid": "766557e4-1c14-4bef-a5b2-d974bbb2d848",
      "Name": "Estuary API"
    },
      {
        "Uuid": "60352064-7b2c-4597-baf6-9df128e9242b",
        "Name": "Shuttle-1"
      },
      {
        "Uuid": "ed16760d-ec36-4d71-b46f-378428c1d774",
        "Name": "Shuttle-2"
      },

      {
        "Uuid": "266fbb9d-56a1-4dea-9b99-9f28054c5522",
        "Name": "Shuttle-4"
      },
      {
        "Uuid": "266fbb9d-56a1-4dea-9b99-9f28054c5522",
        "Name": "Shuttle-5"
      },
      {
        "Uuid": "266fbb9d-56a1-4dea-9b99-9f28054c5522",
        "Name": "Shuttle-6"
      },
      {
        "Uuid": "3c924716-f30e-4afd-a073-98204e4a96a7",
        "Name": "Shuttle-7"
      },
      {
        "Uuid": "8ceea3cd-7608-4428-8d6b-99f2acc80ce3",
        "Name": "Shuttle-8"
      },
      {
        "Uuid": "43cfdfa5-6037-4520-9e4c-c46f4d3686a1",
        "Name": "Autoretrieve Server"
      },
      {
        "Uuid": "a8e5d22b-13ef-4dc9-adcf-a3b2bb4a8863",
        "Name": "Upload Proxy Server"
      },
      {
        "Uuid": "e4d0efb1-1b5b-4aaf-a6ed-37c4a6cc2c6f",
        "Name": "Backup Server"
      }
    ]
  };

  React.useEffect(() => {
    const run = async () => {
      const miners = await R.get('/public/miners', props.api);
      const stats = await R.get('/public/stats', props.api);
      const environment = await R.post('/api/v1/environment/equinix/list/usages',staticEnvironmentPayload,C.api.metricsHost);

      if ((miners && miners.error) || (stats && stats.error)) {
        return setState({ ...state, miners: [], totalStorage: 0, totalFilesStored: 0, totalObjectsRef: 0, environmentDevices: environment });
      }
      setState({ ...state, miners, ...stats,environmentDevices : environment });
    };
    console.log(state.environmentDevices);
    run();
  }, []);

  React.useEffect(() => {
    const load = async () => {
      const data = await R.get('/public/metrics/deals-on-chain', props.api);

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
            <Logos.IA height="48px" style={{ margin: 22, flexShrink: 0 }} />
            <Logos.Portrait height="48px" style={{ margin: 22, flexShrink: 0 }} />
            <Logos.GainForest style={{ margin: 22, height: 48, flexShrink: 0 }} />
            <Logos.NBFS style={{ margin: 22, height: 48, flexShrink: 0 }} />
            <a href="https://kodadot.xyz/" target="_blank">
            <img src="https://github.com/kodadot/kodadot-presskit/raw/main/v3/KODA_v3.png?raw=true" style={{ margin: 22, display: 'inlineFlex', height: 48, flexShrink: 0 }} />
            </a>
            <a href="https://pulse.opsci.io/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/310223/151883495-7e8bcfa2-6aa3-4941-954b-f05a4b7cabd8.png"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://wallet.glif.io/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/310223/153525013-3bd18d54-8e51-4efe-b035-f4a7df7d313e.png"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://chainsafe.io/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/310223/153525038-d81a0f8f-80c6-4306-b614-b4b80234f2ba.png"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://opendata.cityofnewyork.us/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/310223/153525071-dc6b481b-ba8d-4f3b-8df3-cc1e692bbe81.svg"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://app.gala.games/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/310223/155954935-1cdacc87-0702-4fd4-aacf-b74cead78b6f.jpg"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://www.vividlabs.com/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/310223/156037345-f93054de-d222-47e9-9653-cd957fc0fcc5.svg"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://sxxfuture.com/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/310223/174445569-8d5f8311-ec29-40a6-97a0-9db5aba87246.png"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://gitopia.com/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/104923168/184664511-b96e850e-5e52-453a-9b58-72ddcd21718f.png"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://mirror.xyz/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/310223/174463542-d9fed43e-b3a6-4385-8d14-48bcd4b05a7f.png"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://hashaxis.com/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/104923168/184872595-0ee235cb-ef64-4be7-8c4f-9c5dd51304c2.jpg"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://green.filecoin.io/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/19626270/183493007-101fbb38-c59f-4008-b490-42b80952ca5e.png"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://www.labdao.xyz/" target="_blank">
            <img
              src="https://user-images.githubusercontent.com/104923168/185168424-5d049508-442b-4a29-a9c2-d1cea3485d4f.jpg"
              style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
            <a href="https://w3bmint.xyz/" target="_blank">
              <img
                src="https://user-images.githubusercontent.com/4479171/192295992-b39be4bb-afac-4b58-8c43-2232c52982cb.png"
                style={{ height: 48, flexShrink: 0, display: 'inlineFlex', margin: 22 }} />
            </a>
          </div>
        </div>

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
        <br/>
        <div className={S.ecosystemHeading}>
          <p className={S.ecosystemParagraph}>Environment Hosting Cost (last 30 days)</p>
          {/*{state.environmentDevices}*/}
          {state.environmentDevices != undefined && state.environmentDevices['device_usages'] != undefined ? (
              state.environmentDevices['device_usages'].map((device) => {
                return (
                  <div className={S.ecosystemSection}>
                    <div className={S.ecosystemStatCard}>
                      <div className={S.ecosystemStatValue}>{device["usages"][0]["total"]} USD</div>
                      <div className={S.ecosystemStatText}>{device["Info"]["name"]}</div>
                    </div>
                  </div>
                );
          })
          ) : (
            <div className={S.ecosystemSection}>
              <div className={S.ecosystemStatCard}>
                <div className={S.ecosystemStatText}>Stats not available</div>
              </div>
            </div>
          )}
          <p className={S.ecosystemParagraph}>Total Cost (last 30 days)</p>
          <div className={S.ecosystemSection}>
            <div className={S.ecosystemStatCard}>
              <div className={S.ecosystemStatValue}>
                {state.environmentDevices != undefined && state.environmentDevices['total'] != undefined ? (
                  Math.floor(state.environmentDevices["total"]) + " USD"
                ): (
                      <div className={S.ecosystemStatText}>Stats not available</div>
                )} </div>
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