import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import SingleColumnLayout from '@components/SingleColumnLayout';

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

function AdminAnalyticsPage(props: any) {
  React.useEffect(() => {
    const run = async () => {
      const response = await R.get('/admin/dealstats', props.api);
      if (response.error) {
        console.log(response.error);
        return;
      }
    };
    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar active="ADMIN_ANALYTICS" viewer={props.viewer} />;

  return (
    <Page title="Estuary: Admin: Analytics" description="A list of Estuary node analytics." url={`${props.hostname}/admin/analytics`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <SingleColumnLayout>
          <EmptyStatePlaceholder>Coming soon</EmptyStatePlaceholder>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminAnalyticsPage;
