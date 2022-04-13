import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import SingleColumnLayout from '@components/SingleColumnLayout';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import Block from '@components/Block';
import Button from '@components/Button';

import { H1, H2, H3, H4, P } from '@components/Typography';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  if (!viewer) {
    return {
      redirect: {
        permanent: false,
        destination: '/sign-in',
      },
    };
  }

  if (viewer.perms < 10) {
    return {
      redirect: {
        permanent: false,
        destination: '/home',
      },
    };
  }

  return {
    props: { viewer, api: process.env.ESTUARY_API, site: `https://${context.req.headers.host}` },
  };
}

function AdminStatsPage(props) {
  const [state, setState] = React.useState({
    bstoreFree: null,
    bstoreSize: null,
    lmdbStat: null,
    lmdbUsage: null,
    numFiles: null,
    numMiners: null,
    numRetrievalFailures: null,
    numRetrievals: null,
    numStorageFailures: null,
    numUsers: null,
    totalDealsAttempted: null,
    totalDealsFailed: null,
    totalDealsSuccessful: null,
  });

  React.useEffect(() => {
    // TODO(why): Content stats can't be serialized to JSON.
    // const response = await R.get("/content/stats", props.api);
    const run = async () => {
      const response = {};
      const disk = await R.get('/admin/disk-info', props.api);
      if (disk.error) {
        console.log(disk.error);
        return;
      }

      let stats = await R.get('/admin/stats', props.api);
      if (stats.error) {
        console.log(stats.error);
        stats = {};
      }

      setState({ ...state, ...response, ...disk, ...stats });
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar active="ADMIN_STATS" viewer={props.viewer} />;

  console.log(props.viewer);

  return (
    <Page title="Estuary: Admin: Stats" description="Estuary node performance and behavior." url={`${props.site}/stats`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <SingleColumnLayout>
          <H2>System modes</H2>
          <P style={{ marginTop: 16 }}>Configure the system mode for your Estuary Node.</P>

          <div className={styles.actions}>
            {props.viewer.settings.dealMakingDisabled ? (
              <Button
                style={{ marginRight: 24, marginBottom: 24 }}
                onClick={async () => {
                  const response = await R.post(`/admin/cm/dealmaking`, { enabled: true }, props.api);
                  alert('Estuary will make storage deals until you disable deal making again.');
                  window.location.reload();
                }}
              >
                Enable deal making
              </Button>
            ) : (
              <Button
                style={{ marginRight: 24, marginBottom: 24 }}
                onClick={async () => {
                  const response = await R.post(`/admin/cm/dealmaking`, { enabled: false }, props.api);
                  alert('Estuary will suspend deal making until you enable deal making again.');
                  window.location.reload();
                }}
              >
                Disable deal making
              </Button>
            )}
          </div>
        </SingleColumnLayout>

        <SingleColumnLayout>
          <H2>Stats</H2>
          <P style={{ marginTop: 16 }}>Statistics around your Estuary node usage.</P>

          {state.numFiles ? (
            <React.Fragment>
              <Block style={{ marginTop: 24 }} label="Total files">
                {U.formatNumber(state.numFiles)}
              </Block>

              <Block style={{ marginTop: 2 }} label="Total miners">
                {U.formatNumber(state.numMiners)}
              </Block>

              <Block style={{ marginTop: 2 }} label="Total retrieval failures">
                {U.formatNumber(state.numRetrievalFailures)}
              </Block>

              <Block style={{ marginTop: 2 }} label="Total retrievals">
                {U.formatNumber(state.numRetrievals)}
              </Block>

              <Block style={{ marginTop: 2 }} label="Total storage failures">
                {U.formatNumber(state.numStorageFailures)}
              </Block>

              <Block style={{ marginTop: 2 }} label="Total users">
                {U.formatNumber(state.numUsers)}
              </Block>

              <Block style={{ marginTop: 2 }} label="Total deals attempted">
                {U.formatNumber(state.totalDealsAttempted)}
              </Block>

              <Block style={{ marginTop: 2 }} label="Total deals failed">
                {U.formatNumber(state.totalDealsFailed)}
              </Block>

              <Block style={{ marginTop: 2 }} label="Total deals successful">
                {U.formatNumber(state.totalDealsSuccessful)}
              </Block>
            </React.Fragment>
          ) : null}
        </SingleColumnLayout>

        <SingleColumnLayout>
          <H2>System</H2>
          <P style={{ marginTop: 16 }}>Hardware and system statistics around your Estuary node usage.</P>

          {state.bstoreFree ? (
            <React.Fragment>
              <Block style={{ marginTop: 24 }} label="Available free space">
                {U.bytesToSize(state.bstoreFree)}
              </Block>

              <Block style={{ marginTop: 2 }} label="Total space capacity">
                {U.bytesToSize(state.bstoreSize)}
              </Block>

              <Block style={{ marginTop: 2 }} label="LMDB usage">
                {U.bytesToSize(state.lmdbUsage)}
              </Block>

              {state.lmdbStat ? (
                <React.Fragment>
                  <Block style={{ marginTop: 2 }} label="LMDB branch pages">
                    {U.formatNumber(state.lmdbStat.branchPages)}
                  </Block>

                  <Block style={{ marginTop: 2 }} label="LMDB depth">
                    {state.lmdbStat.depth}
                  </Block>

                  <Block style={{ marginTop: 2 }} label="LMDB entries">
                    {U.formatNumber(state.lmdbStat.entries)}
                  </Block>

                  <Block style={{ marginTop: 2 }} label="LMDB leaf pages">
                    {U.formatNumber(state.lmdbStat.leafPages)}
                  </Block>

                  <Block style={{ marginTop: 2 }} label="LMDB overflow pages">
                    {U.formatNumber(state.lmdbStat.overflowPages)}
                  </Block>

                  <Block style={{ marginTop: 2 }} label="LMDB p size">
                    {U.formatNumber(state.lmdbStat.pSize)}
                  </Block>
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ) : null}
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminStatsPage;
