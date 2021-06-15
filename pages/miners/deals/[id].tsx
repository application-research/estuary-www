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
    props: { viewer, ...context.params },
  };
}

function MinerDealsPage(props: any) {
  const [state, setState] = React.useState({ logs: [] });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get(`/public/miners/deals/${props.id}`);

      console.log(response);

      if (response && response.length) {
        return setState({ logs: response });
      }

      alert('No deal history for this miner.');
    };

    run();
  }, []);

  return (
    <Page
      title="Estuary: Public: Miner: Deals"
      description={`Deals for Miner: ${props.id}`}
      url={`https://estuary.tech/miners/deals/${props.id}`}
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated={props.viewer} active="INDEX" />}
        sidebar={props.viewer ? <AuthenticatedSidebar viewer={props.viewer} /> : null}
      >
        <table className={tstyles.table}>
          <tbody className={tstyles.tbody}>
            <tr className={tstyles.tr}>
              <th className={tstyles.th} style={{ width: 144 }}>
                Creation
              </th>
              <th className={tstyles.th} style={{ width: 104 }}>
                Miner
              </th>
              <th className={tstyles.th} style={{ width: 96 }}>
                Content
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
                      <td className={tstyles.td}>{U.toDate(log.CreatedAt)}</td>
                      <td className={tstyles.tdcta}>
                        <a className={tstyles.cta} href={`/miners/stats/${log.miner}`}>
                          {log.miner}
                        </a>
                      </td>
                      <td className={tstyles.td}>{log.content}</td>
                      <td className={tstyles.td}>
                        {log.failed ? '--' : log.dealId > 0 ? log.dealId : 'in-progress'}
                      </td>
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
