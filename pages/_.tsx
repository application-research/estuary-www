import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';

import ProgressCard from '@components/ProgressCard';
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
    props: { viewer, api: process.env.ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function TemplatePage(props: any) {
  return (
    <Page title="Estuary: Navigation" description="Mobile site navigation" url={props.hostname}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated={props.viewer} active="TEMPLATE" />}>
        <AuthenticatedSidebar viewer={props.viewer} />
      </AuthenticatedLayout>
    </Page>
  );
}

export default TemplatePage;
