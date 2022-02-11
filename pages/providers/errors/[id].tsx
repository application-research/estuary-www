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

  return {
    props: { viewer, ...context.params, api: process.env.ESTUARY_API },
  };
}

function MinerErrorPage(props: any) {
  const [state, setState] = React.useState({ logs: [] });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get(`/public/miners/failures/${props.id}`, props.api);
      console.log(response);

      if (response && response.length) {
        return setState({ logs: response });
      }

      alert('No error logs for this miner.');
    };

    run();
  }, []);

  const sidebarElement = props.viewer ? <AuthenticatedSidebar viewer={props.viewer} /> : null;

  return (
    <Page title="Estuary: Public: Providers: Errors" description={`Errors for storage provider: ${props.id}`} url={`https://estuary.tech/providers/errors/${props.id}`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated={props.viewer} isRenderingSidebar={!!sidebarElement} active="INDEX" />} sidebar={sidebarElement}>
        <table className={tstyles.table}>
          <tbody className={tstyles.tbody}>
            <tr className={tstyles.tr}>
              <th className={tstyles.th} style={{ width: 144 }}>
                Created date
              </th>
              <th className={tstyles.th} style={{ width: 112 }}>
                Local ID
              </th>
              <th className={tstyles.th} style={{ width: 104 }}>
                Provider
              </th>
              <th className={tstyles.th} style={{ width: 96 }}>
                Phase
              </th>
              <th className={tstyles.th}>Message</th>
            </tr>
            {state.logs
              ? state.logs.map((log) => (
                  <tr key={log.ID} className={tstyles.tr}>
                    <td className={tstyles.td}>{U.toDate(log.CreatedAt)}</td>
                    <td className={tstyles.td}>{log.content}</td>
                    <td className={tstyles.tdcta}>
                      <a className={tstyles.cta} href={`/providers/stats/${log.miner}`}>
                        {log.miner}
                      </a>
                    </td>
                    <td className={tstyles.td}>{log.phase}</td>
                    <td className={tstyles.td}>
                      <strong>[{log.minerVersion}]</strong> {log.message}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </AuthenticatedLayout>
    </Page>
  );
}

export default MinerErrorPage;
