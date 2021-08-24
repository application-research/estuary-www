import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';
import * as C from '@common/constants';
import * as Crypto from '@common/crypto';

import { useFissionAuth } from '@common/useFissionAuth';

import ProgressCard from '@components/ProgressCard';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import SingleColumnLayout from '@components/SingleColumnLayout';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import Input from '@components/Input';
import Button from '@components/Button';
import LoaderSpinner from '@components/LoaderSpinner';

import { H1, H2, H3, H4, P } from '@components/Typography';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);
  const host = context.req.headers.host;
  const protocol = host.split(':')[0] === 'localhost' ? 'http' : 'https';

  if (!viewer) {
    return {
      redirect: {
        permanent: false,
        destination: '/sign-in',
      },
    };
  }

  return {
    props: { host, protocol, viewer },
  };
}

function FissionPage(props: any) {
  const { viewer } = props;

  const sidebarElement = <AuthenticatedSidebar active="SETTINGS" viewer={viewer} />;

  return (
    <Page title="Estuary: Fission Setup (WIP)" description="Ensure Fission is setup on this page." url="https://estuary.tech/settings">
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <SingleColumnLayout>
          <H2>Fission</H2>
          <P style={{ marginTop: 16 }}>Setup your Fission account for a Filecoin address (WIP).</P>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default FissionPage;
