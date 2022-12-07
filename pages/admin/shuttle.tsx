import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import Button from '@components/Button';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import PageHeader from '@components/PageHeader';

import { H2, H3, P } from '@components/Typography';

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
    props: { viewer, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function AdminShuttlePage(props: any) {
  const [state, setState] = React.useState({ loading: false, shuttles: [] });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get('/admin/shuttle/list', props.api);
      console.log(response);
      setState({ ...state, shuttles: response && response.length ? response : [] });
    };

    run();
  }, []);

  const sidebarElement = props.viewer ? <AuthenticatedSidebar active="ADMIN_SHUTTLE" viewer={props.viewer} /> : null;

  return (
    <Page title="Estuary: Admin: Shuttle" description="Create shuttles." url={`${props.hostname}/admin/shuttle`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated={props.viewer} isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <PageHeader>
          <H2>Create Shuttle</H2>
          <P style={{ marginTop: 16 }}>Generate a Shuttle for your data.</P>

          <div className={styles.actions}>
            <Button
              loading={state.loading ? state.loading : undefined}
              onClick={async () => {
                setState({ ...state, loading: true });
                await R.post(`/admin/shuttle/init`, {}, props.api);
                const response = await R.get('/admin/shuttle/list', props.api);
                console.log(response);
                setState({ ...state, loading: false, shuttles: response && response.length ? response : [] });
              }}
            >
              Initialize a shuttle
            </Button>
          </div>
        </PageHeader>
        <div className={styles.group}>
          {state.shuttles && state.shuttles.length
            ? state.shuttles.map((data, index) => {
                const id = data.addrInfo ? data.hostname : 'NOT-DEPLOYED';
                return (
                  <div style={{ marginTop: 24 }} key={`${id}-${index}`}>
                    <H3 style={{ margin: `8px 0 8px 0px` }}>Shuttle ➝ {id}</H3>
                    <table className={tstyles.table}>
                      <tbody className={tstyles.tbody}>
                        <tr className={tstyles.tr}>
                          <th className={tstyles.th}>handle</th>
                        </tr>
                        <tr className={tstyles.tr}>
                          <td className={tstyles.td}>{data.handle}</td>
                        </tr>
                      </tbody>
                    </table>
                    <table className={tstyles.table}>
                      <tbody className={tstyles.tbody}>
                        <tr className={tstyles.tr}>
                          <th className={tstyles.th}>token</th>
                        </tr>
                        <tr className={tstyles.tr}>
                          <td className={tstyles.td}>{data.token}</td>
                        </tr>
                      </tbody>
                    </table>
                    {data.storageStats ? (
                      <table className={tstyles.table}>
                        <tbody className={tstyles.tbody}>
                          <tr className={tstyles.tr}>
                            <th className={tstyles.th}>Free space</th>
                            <th className={tstyles.th}>Total space</th>
                            <th className={tstyles.th}>Pins</th>
                            <th className={tstyles.th}>Queue</th>
                          </tr>
                          <tr className={tstyles.tr}>
                            <td className={tstyles.td}>{U.bytesToSize(data.storageStats.blockstoreFree)}</td>
                            <td className={tstyles.td}>{U.bytesToSize(data.storageStats.blockstoreSize)}</td>
                            <td className={tstyles.td}>{data.storageStats.pinCount}</td>
                            <td className={tstyles.td}>{data.storageStats.pinQueueLength}</td>
                          </tr>
                        </tbody>
                      </table>
                    ) : null}
                    <table className={tstyles.table}>
                      <tbody className={tstyles.tbody}>
                        <tr className={tstyles.tr}>
                          <th className={tstyles.th}>Last connection</th>
                          <th className={tstyles.th}>Addresses</th>
                          <th className={tstyles.th}>Online</th>
                        </tr>
                        <tr className={tstyles.tr}>
                          <td className={tstyles.td}>{U.toDate(data.lastConnection)}</td>
                          <td className={tstyles.td}>
                            {data.addrInfo
                              ? data.addrInfo.Addrs.map((each) => {
                                  return <div key={each}>{each}</div>;
                                })
                              : 'None'}
                          </td>

                          <td className={tstyles.td}>{String(data.online)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })
            : null}
        </div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminShuttlePage;
