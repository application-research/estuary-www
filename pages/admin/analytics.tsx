import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';
import * as R from '@common/requests';

import Cookies from 'js-cookie';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import SingleColumnLayout from '@components/SingleColumnLayout';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';

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

function AdminAnalyticsPage(props: any) {
  React.useEffect(() => {
    const run = async () => {
      const response = await R.get('/admin/dealstats', props.api);
      if (response.error) {
        console.log(response.error);
        return;
      }

      console.log(response);
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar active="ADMIN_ANALYTICS" viewer={props.viewer} />;

  return (
    <Page title="Estuary: Admin: Analytics" description="A list of Estuary node analytics." url={`${props.site}/admin/analytics`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <SingleColumnLayout>
          <EmptyStatePlaceholder>Coming soon</EmptyStatePlaceholder>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminAnalyticsPage;
