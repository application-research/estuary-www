import styles from "~/pages/app.module.scss";
import tstyles from "~/pages/table.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as R from "~/common/requests";

import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";
import SingleColumnLayout from "~/components/SingleColumnLayout";
import Block from "~/components/Block";

import { H1, H2, P } from "~/components/Typography";

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, ...context.params },
  };
}

function MinerStatsPage(props) {
  const [state, setState] = React.useState({ loading: 1 });

  React.useEffect(async () => {
    const response = await R.get(`/public/miners/stats/${props.id}`);
    console.log(response);
    const ask = await R.get(`/public/miners/storage/query/${props.id}`);
    console.log(ask);

    if (response && response.error) {
      return setState({ loading: 2 });
    }

    setState({ ...state, ...response, ...ask, loading: 3 });
  }, []);

  return (
    <Page
      title="Estuary: Public: Miner: Stats"
      description={`Stats for Miner: ${props.id}`}
      url={`https://estuary.tech/miners/stats/${props.id}`}
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated={props.viewer} active="INDEX" />}
        sidebar={props.viewer ? <AuthenticatedSidebar viewer={props.viewer} /> : null}
      >
        {state.loading > 1 ? (
          <SingleColumnLayout>
            <H2>{props.id}</H2>
            {state.usedByEstuary ? (
              <P style={{ marginTop: 8, marginBottom: 24 }}>This miner is used by Estuary.</P>
            ) : (
              <P style={{ marginTop: 8, marginBottom: 24 }}>
                This miner is not used by Estuary, therefore we do not make storage deals against
                this miner. An admin of Estuary can add this miner in the future.
              </P>
            )}

            {state.loading === 3 ? (
              <React.Fragment>
                {state.suspended ? (
                  <Block
                    style={{
                      marginTop: 24,
                      background: `var(--status-error)`,
                      color: `var(--main-background-input)`,
                    }}
                    label="Miner is suspended"
                  >
                    {state.suspendedReason}
                  </Block>
                ) : null}

                <Block
                  style={{ marginTop: 2 }}
                  label="Attempted deals"
                  onCustomClick={() => {
                    window.location.href = `/miners/deals/${props.id}`;
                  }}
                  custom={`➝ View deals for ${props.id}`}
                >
                  {state.dealCount} deals
                </Block>

                <Block
                  style={{ marginTop: 2 }}
                  label="Total errors"
                  onCustomClick={() => {
                    window.location.href = `/miners/errors/${props.id}`;
                  }}
                  custom={`➝ View errors for ${props.id}`}
                >
                  {state.errorCount} errors
                </Block>

                {state.version ? (
                  <Block style={{ marginTop: 2 }} label="Filecoin version">
                    {state.version}
                  </Block>
                ) : null}

                {state.verifiedPrice ? (
                  <Block style={{ marginTop: 2 }} label="Verified price">
                    {U.inFIL(state.verifiedPrice)}
                  </Block>
                ) : null}

                {state.price ? (
                  <Block style={{ marginTop: 2 }} label="Price">
                    {U.inFIL(state.price)}
                  </Block>
                ) : null}

                {state.maxPieceSize ? (
                  <Block style={{ marginTop: 2 }} label="Maximum piece size">
                    {U.bytesToSize(state.maxPieceSize)}
                  </Block>
                ) : null}

                {state.minPieceSize ? (
                  <Block style={{ marginTop: 2 }} label="Minimum piece size">
                    {U.bytesToSize(state.minPieceSize)}
                  </Block>
                ) : null}
              </React.Fragment>
            ) : null}
          </SingleColumnLayout>
        ) : null}
      </AuthenticatedLayout>
    </Page>
  );
}

export default MinerStatsPage;
