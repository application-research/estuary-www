import tstyles from '@pages/table.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import Link from 'next/link';

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
    props: { viewer, ...context.params, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function DealDebugPage(props: any) {
  const [state, setState] = React.useState({ logs: [] });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get(`/deals/failures`, props.api);

      if (response && response.length) {
        return setState({ logs: response });
      }

      alert('No debug logs for all deals.');
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar active="DEALS_DEBUG" viewer={props.viewer} />;

  return (
    <Page title="Estuary: Deals: Debug" description={`Debug storage deals on Estuary.`} url={`${props.hostname}/deals/debug`}>
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
                      <Link className={tstyles.cta} href={`/content/${log.content}`}>
                        {log.content}
                      </Link>
                    </td>
                    <td className={tstyles.tdcta}>
                      <Link className={tstyles.cta} href={`/providers/stats/${log.miner}`}>
                        {log.miner}
                      </Link>
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
