import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';

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

  return {
    props: { viewer, ...context.params },
  };
}

function DealDebugPage(props: any) {
  const [state, setState] = React.useState({ logs: [] });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get(`/deals/failures`);

      if (response && response.length) {
        return setState({ logs: response });
      }

      alert('No debug logs for all deals.');
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar viewer={props.viewer} />;

  return (
    <Page title="Estuary: Deals: Debug" description={`Debug storage deals on Estuary.`} url={`https://estuary.tech/deals/debug`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated active="DEALS_DEBUG" isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <table className={tstyles.table}>
          <tbody className={tstyles.tbody}>
            <tr className={tstyles.tr}>
              <th className={tstyles.th} style={{ width: 144 }}>
                Created date
              </th>
              <th className={tstyles.th} style={{ width: 112 }}>
                Local ID
              </th>
              <th className={tstyles.th} style={{ width: 120 }}>
                provider
              </th>
              <th className={tstyles.th} style={{ width: 120 }}>
                phase
              </th>
              <th className={tstyles.th}>message</th>
            </tr>
            {state.logs
              ? state.logs.map((log) => (
                  <tr key={log.ID} className={tstyles.tr}>
                    <td className={tstyles.td} style={{ maxWidth: 144 }}>
                      {U.toDate(log.CreatedAt)}
                    </td>
                    <td className={tstyles.tdcta}>
                      <a className={tstyles.cta} href={`/content/${log.content}`}>
                        {log.content}
                      </a>
                    </td>
                    <td className={tstyles.tdcta}>
                      <a className={tstyles.cta} href={`/providers/stats/${log.miner}`}>
                        {log.miner}
                      </a>
                    </td>
                    <td className={tstyles.td}>{log.phase}</td>
                    <td className={tstyles.td}>{log.message}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </AuthenticatedLayout>
    </Page>
  );
}

export default DealDebugPage;
