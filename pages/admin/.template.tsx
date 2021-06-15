import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import SingleColumnLayout from '@components/SingleColumnLayout';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import Block from '@components/Block';

import { H1, H2, P } from '@components/Typography';

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
    props: { viewer },
  };
}

function EstuaryTemplate(props) {
  return (
    <Page title="Estuary: Admin: Template" description="" url="https://estuary.tech">
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated active="ADMIN_TEMPLATE" />}
        sidebar={<AuthenticatedSidebar viewer={props.viewer} />}
      >
        <SingleColumnLayout>
          <H2>Template</H2>
          <P style={{ marginTop: 8 }}>Estuary Template.</P>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default EstuaryTemplate;
