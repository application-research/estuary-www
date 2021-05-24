import styles from "~/pages/app.module.scss";
import tstyles from "~/pages/table.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as R from "~/common/requests";

import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, ...context.params },
  };
}

function MinerErrorPage(props) {
  const [state, setState] = React.useState({ logs: [] });

  React.useEffect(async () => {
    const response = await R.get(`/public/miners/failures/${props.id}`);

    if (response && response.length) {
      return setState({ logs: response });
    }

    alert("No error logs for this miner.");
  }, []);

  return (
    <Page
      title="Estuary: Public: Miner: Errors"
      description={`Errors for Miner: ${props.id}`}
      url={`https://estuary.tech/miners/errors/${props.id}`}
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
                Phase
              </th>
              <th className={tstyles.th}>Message</th>
            </tr>
            {state.logs
              ? state.logs.map((log) => (
                  <tr key={log.ID} className={tstyles.tr}>
                    <td className={tstyles.td}>{U.toDate(log.CreatedAt)}</td>
                    <td className={tstyles.tdcta}>
                      <a className={tstyles.cta} href={`/miners/stats/${log.miner}`}>
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

export default MinerErrorPage;
