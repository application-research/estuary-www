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
    props: { viewer, ...context.params, api: process.env.ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function MinerDealsPage(props: any) {
  const [state, setState] = React.useState({ logs: [] });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get(`/public/miners/deals/${props.id}`, props.api);

      console.log(response);

      if (response && response.length) {
        return setState({ logs: response });
      }

      alert('No deal history for this storage provider.');
    };

    run();
  }, []);

  const sidebarElement = props.viewer ? <AuthenticatedSidebar viewer={props.viewer} /> : null;

  return (
    <Page title="Estuary: Public: Providers: Deals" description={`Deals for storage provider: ${props.id}`} url={`${props.hostname}/providers/deals/${props.id}`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated={props.viewer} active="INDEX" isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <table className={tstyles.table}>
          <tbody className={tstyles.tbody}>
            <tr className={tstyles.tr}>
              <th className={tstyles.th} style={{ width: 144 }}>
                Created date
              </th>
              <th className={tstyles.th} style={{ width: 96 }}>
                Local ID
              </th>
              <th className={tstyles.th} style={{ width: 104 }}>
                Provider
              </th>
              <th className={tstyles.th} style={{ width: 96 }}>
                Deal ID
              </th>
              <th className={tstyles.th}>Prop CID</th>
              <th className={tstyles.th}>Data transfer channel</th>
            </tr>
            {state.logs
              ? state.logs.map((log) => {
                  let style = {};
                  if (log.failed) {
                    style = { background: `#ff8389` };
                  }

                  return (
                    <tr key={log.ID} className={tstyles.tr} style={style}>
                      <td className={tstyles.td}>{U.toDate(log.created_at)}</td>
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
                      <td className={tstyles.td}>{log.failed ? '--' : log.dealId > 0 ? log.dealId : 'in-progress'}</td>
                      <td className={tstyles.td}>{log.propCid}</td>
                      <td className={tstyles.td}>{log.dtChan}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </AuthenticatedLayout>
    </Page>
  );
}

export default MinerDealsPage;
