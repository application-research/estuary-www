import styles from '@pages/app.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import LoaderSpinner from '@components/LoaderSpinner';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import StatRow from '@components/StatRow';

import { H2, P } from '@components/Typography';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function WatchProvidersPage(props: any) {
  const [state, setState] = React.useState({
    providers: [],
  });

  React.useEffect(() => {
    const run = async () => {
      let iex;
      try {
        const iexResponse = await fetch('https://cloud.iexapis.com/stable/crypto/filusdt/price?token=pk_aa330a89a4724944ae1a525879a19f2d');
        iex = await iexResponse.json();
      } catch (e) {
        console.log(e);
      }

      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      if (!params) {
        return null;
      }

      if (params && U.isEmpty(params.picks)) {
        return null;
      }

      let list = params.picks.split(',');
      let providers = [];
      for await (let provider of list) {
        let candidate = {
          usd: iex ? iex.price : null,
          miner: provider,
          statError: null,
          askError: null,
          version: null,
          verifiedPrice: null,
          price: null,
          maxPieceSize: null,
          minPieceSize: null,
          chainInfo: null,
          suspendedReason: null,
          dealCount: null,
          errorCount: null,
          suspended: null,
          usedByEstuary: null,
        };

        const response = await R.get(`/public/miners/stats/${provider}`, props.api);

        if (response && !response.error) {
          candidate = { ...candidate, ...response };
        }

        if (response && response.error) {
          candidate = { ...candidate, statError: response.error };
        }

        const ask = await R.get(`/public/miners/storage/query/${provider}`, props.api);

        if (ask && !ask.error) {
          candidate = { ...candidate, ...ask };
        }

        if (ask && ask.error) {
          candidate = { ...candidate, askError: ask.error };
        }

        if (candidate.miner) {
          providers.push(candidate);
        }
      }

      setState({ providers });
    };

    run();
  }, []);

  let sidebarElement;
  if (props.viewer) {
    sidebarElement = <AuthenticatedSidebar viewer={props.viewer} />;
  }

  const navigationElement = <Navigation isAuthenticated={props.viewer} isRenderingSidebar={sidebarElement} active="SECRET_PICKS_PAGE" />;

  console.log(state.providers);

  return (
    <Page title="Estuary: Providers" description="This is a providers page." url={`${props.hostname}/providers/public/watch`}>
      <AuthenticatedLayout navigation={navigationElement} sidebar={sidebarElement}>
        <div className={styles.group} style={{ paddingTop: 88, paddingBottom: 88 }}>
          {state.providers && state.providers.length ? (
            state.providers.map((each) => {
              return (
                <div style={{ marginBottom: 48 }} key={each.miner}>
                  <H2
                    style={{ marginBottom: 12 }}
                    onClick={() => {
                      window.location.href = `/providers/stats/${each.miner}`;
                    }}
                  >
                    {each.miner}
                  </H2>
                  {each.statError ? (
                    <StatRow title={'Stat error'} style={{ background: `#FF0000`, color: '#FFFFFF' }}>
                      {each.statError}
                    </StatRow>
                  ) : null}
                  {each.askError ? (
                    <StatRow title={'Ask error'} style={{ background: `#FF0000`, color: '#FFFFFF' }}>
                      {each.askError}
                    </StatRow>
                  ) : null}
                  {each.suspended ? (
                    <StatRow title={'Suspended'} style={{ background: `#FF0000`, color: '#FFFFFF' }}>
                      {each.suspendedReason}
                    </StatRow>
                  ) : null}

                  {each.version ? <StatRow title={'Version'}>{each.version}</StatRow> : null}

                  {each.chainInfo ? <StatRow title={'Peer ID'}>{each.chainInfo.peerId}</StatRow> : null}
                  {each.chainInfo ? <StatRow title={'Owner ID'}>{each.chainInfo.owner}</StatRow> : null}
                  {each.chainInfo ? <StatRow title={'Worker ID'}>{each.chainInfo.worker}</StatRow> : null}

                  {each.chainInfo && each.chainInfo.addresses && each.chainInfo.addresses.length ? (
                    <StatRow title="Addresses">
                      {each.chainInfo.addresses.map((each) => {
                        return (
                          <React.Fragment>
                            {each}
                            <br />
                          </React.Fragment>
                        );
                      })}
                    </StatRow>
                  ) : null}

                  {each.dealCount ? <StatRow title={'Deal count'}>{each.dealCount}</StatRow> : null}
                  {each.errorCount ? <StatRow title={'Deal errors'}>{each.errorCount}</StatRow> : null}

                  {each.verifiedPrice ? <StatRow title={'Verified price'}>{U.inUSDPrice(each.verifiedPrice, each.usd)}</StatRow> : null}
                  {each.price ? <StatRow title={'Price'}>{U.inUSDPrice(each.price, each.usd)}</StatRow> : null}
                  {each.minPieceSize ? (
                    <StatRow title={'Min piece size'}>
                      {each.minPieceSize} bytes ⇄ {U.bytesToSize(each.minPieceSize)}
                    </StatRow>
                  ) : null}
                  {each.maxPieceSize ? (
                    <StatRow title={'Max piece Size'}>
                      {each.maxPieceSize} bytes ⇄ {U.bytesToSize(each.maxPieceSize)}
                    </StatRow>
                  ) : null}
                </div>
              );
            })
          ) : (
            <React.Fragment>
              <H2>
                Loading your providers... <LoaderSpinner />
              </H2>
              <P style={{ marginTop: 16 }}>Loading this page and fetching all of the provider data takes some time...</P>
            </React.Fragment>
          )}
        </div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default WatchProvidersPage;
