import S from "~/pages/index.module.scss";
import pkg from "~/package.json";

import * as React from "react";
import * as U from "~/common/utilities";
import * as R from "~/common/requests";

import Page from "~/components/Page";
import Navigation from "~/components/Navigation";
import Card from "~/components/Card";
import FeatureRow from "~/components/FeatureRow";
import MarketingCube from "~/components/MarketingCube";

import { H1, H2, H3, P } from "~/components/Typography";
import { MarketingUpload, MarketingProgress, MarketingGraph } from "~/components/Marketing";

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer },
  };
}

function IndexPage(props) {
  const [state, setState] = React.useState({ miners: [] });
  React.useEffect(async () => {
    /*
    const response = await R.get("/health");
    console.log(response);
    */

    const miners = await R.get("/public/miners");
    if (miners && miners.error) {
      return setState({ miners: [] });
    }

    setState({ miners });
  }, []);

  return (
    <Page
      title="Estuary"
      description="Use our Estuary Node to store and retrieve your data from the Filecoin Network."
      url="https://estuary.tech"
    >
      <Navigation active="INDEX" isAuthenticated={props.viewer} />

      <div className={S.h}>
        <div className={S.ht}></div>
        <div className={S.hb}>
          Use our Estuary Node to store and retrieve your data from the Filecoin Network.
        </div>
      </div>

      <div className={S.r} style={{ borderTop: `#ececec 1px solid` }}>
        <div className={S.rl}>
          <div className={S.rtext}>
            Drag and drop, or click to upload data directly to the Filecoin Network.
          </div>
          <FeatureRow>No minimum size</FeatureRow>
          <FeatureRow>32 GB maximum size</FeatureRow>
          <FeatureRow>Deal cost estimation</FeatureRow>
        </div>
        <div className={S.rr}>
          <MarketingUpload
            estimate="0"
            price="0"
            size="792259920"
            replication="6"
            duration={1051200}
            verified={true}
          />
        </div>
      </div>

      <div className={S.r} style={{ borderTop: `#ececec 1px solid` }}>
        <div className={S.rl}>
          <div className={S.rtext}>
            Estuary nodes retrieve on your behalf. Your data is always pinned and accessible.
          </div>
          <FeatureRow>IPFS pin restoration from Filecoin</FeatureRow>
          <FeatureRow>Estuary Nodes handle replication and repair</FeatureRow>
        </div>
        <div className={S.rr}>
          <MarketingProgress />
        </div>
      </div>

      <footer className={S.f}>
        <div className={S.fa}>
          <div className={S.fcol4}>
            <span className={S.flink}>Index</span>
          </div>
          <div className={S.fcolfull}>
            <span className={S.flink}>All of the miners that store data from Estuary.</span>
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

          return (
            <div className={S.fam} key={each.addr}>
              <div className={S.fcol4}>
                <a className={S.flink} href={`/miners/stats/${each.addr}`}>
                  {`${index}`.padStart(4, 0)}
                </a>
              </div>
              <div className={S.fcol4}>
                <a className={S.flink} href={`/miners/stats/${each.addr}`}>
                  ➝ {each.addr}/stats
                </a>
              </div>
              <div className={S.fcol4}>
                <a className={S.flink} href={`/miners/deals/${each.addr}`}>
                  ➝ {each.addr}/deals
                </a>
              </div>
              <div className={S.fcol4}>
                <a className={S.flink} href={`/miners/errors/${each.addr}`}>
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
