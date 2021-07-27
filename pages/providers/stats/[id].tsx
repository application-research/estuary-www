import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import SingleColumnLayout from '@components/SingleColumnLayout';
import Block from '@components/Block';

import { H1, H2, H3, H4, P } from '@components/Typography';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, ...context.params },
  };
}

function MinerStatsPage(props: any) {
  const [state, setState] = React.useState({
    loading: 1,
    iex: null,
    name: null,
    error: null,
    suspendedReason: null,
    dealCount: null,
    errorCount: null,
    version: null,
    verifiedPrice: null,
    usedByEstuary: null,
    suspended: null,
    price: null,
    maxPieceSize: null,
    minPieceSize: null,
  });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get(`/public/miners/stats/${props.id}`);
      let iex;
      try {
        const iexResponse = await fetch('https://cloud.iexapis.com/stable/crypto/filusdt/price?token=pk_aa330a89a4724944ae1a525879a19f2d');
        iex = await iexResponse.json();
      } catch (e) {
        console.log(e);
      }

      if (response && response.error) {
        return setState({ ...state, loading: 2 });
      }

      const next = { ...state, ...response, iex, loading: 3 };
      setState(next);

      const ask = await R.get(`/public/miners/storage/query/${props.id}`);
      setState({ ...next, ...ask });
    };

    run();
  }, []);

  console.log('state', state);

  const sidebarElement = props.viewer ? <AuthenticatedSidebar viewer={props.viewer} /> : null;

  return (
    <Page title={`Estuary: Public: Providers: ${props.id}`} description={`Stats for storage provider: ${props.id}`} url={`https://estuary.tech/providers/stats/${props.id}`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated={props.viewer} active="INDEX" isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        {state.loading > 1 ? (
          <SingleColumnLayout>
            <H2>
              {props.id} {U.isEmpty(state.name) ? null : `— ${state.name}`}
            </H2>
            {state.usedByEstuary ? (
              <P style={{ marginTop: 16, marginBottom: 24 }}>This storage provider is used by Estuary.</P>
            ) : (
              <P style={{ marginTop: 16, marginBottom: 24 }}>
                This storage provider is not used by Estuary, therefore we do not make storage deals against this storage provider. An admin of Estuary can add this storage
                provider in the future.
              </P>
            )}

            {state.loading === 3 ? (
              <React.Fragment>
                {state.error ? (
                  <Block
                    style={{
                      marginTop: 2,
                      background: `var(--status-error)`,
                      color: `var(--main-background-input)`,
                    }}
                    label="Ask error"
                  >
                    {state.error}
                  </Block>
                ) : null}

                {state.suspended ? (
                  <Block
                    style={{
                      marginTop: 2,
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
                    window.location.href = `/providers/deals/${props.id}`;
                  }}
                  custom={`➝ View deals for ${props.id}`}
                >
                  {state.dealCount} deals
                </Block>

                <Block
                  style={{ marginTop: 2 }}
                  label="Total errors"
                  onCustomClick={() => {
                    window.location.href = `/providers/errors/${props.id}`;
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
                    {U.inUSDPrice(state.verifiedPrice, state.iex.price)}
                  </Block>
                ) : null}

                {state.price ? (
                  <Block style={{ marginTop: 2 }} label="Price">
                    {U.inUSDPrice(state.price, state.iex.price)}
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

            {state.chainInfo ? (
              <React.Fragment>
                <H2 style={{ marginTop: 88 }}>Chain Info</H2>
                <P style={{ marginTop: 16, marginBottom: 24 }}>Additional chain info for debugging.</P>

                {state.chainInfo.addresses && state.chainInfo.addresses.length ? (
                  <Block style={{ marginTop: 2 }} label="MultiAddr Addresses">
                    {state.chainInfo.addresses.map((each) => {
                      return (
                        <React.Fragment>
                          {each}
                          <br />
                        </React.Fragment>
                      );
                    })}
                  </Block>
                ) : null}

                <Block style={{ marginTop: 2 }} label="Peer">
                  {state.chainInfo.peerId}
                </Block>

                <Block style={{ marginTop: 2 }} label="Owner ID">
                  {state.chainInfo.owner}
                </Block>

                <Block style={{ marginTop: 2 }} label="Worker ID">
                  {state.chainInfo.worker}
                </Block>
              </React.Fragment>
            ) : null}
          </SingleColumnLayout>
        ) : null}
      </AuthenticatedLayout>
    </Page>
  );
}

export default MinerStatsPage;
