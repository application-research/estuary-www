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
    props: { viewer, ...context.params, api: process.env.ESTUARY_API },
  };
}

function LocalContentPage(props) {
  const [state, setState] = React.useState({ content: null });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get(`/content/status/${props.id}`, props.api);

      console.log(response);

      if (response && !response.error) {
        return setState({ content: { ...response } });
      }

      alert(`Content ${props.id} not found.`);
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar viewer={props.viewer} />;

  return (
    <Page title={`Estuary: Content: ID: ${props.id}`} description={`Content status for local ID: ${props.id}`} url={`/content/${props.id}`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <React.Fragment>
          <table className={tstyles.table}>
            <tbody className={tstyles.tbody}>
              <tr className={tstyles.tr}>
                <th className={tstyles.th}>Local ID</th>
              </tr>

              <tr className={tstyles.tr}>
                <td className={tstyles.td}>{props.id}</td>
              </tr>
            </tbody>
          </table>
        </React.Fragment>
      </AuthenticatedLayout>
    </Page>
  );
}

export default LocalContentPage;
