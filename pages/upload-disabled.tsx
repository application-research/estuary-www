import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import ActionRow from '@components/ActionRow';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import SingleColumnLayout from '@components/SingleColumnLayout';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import Block from '@components/Block';
import Input from '@components/Input';
import Button from '@components/Button';

import { H1, H2, H3, H4, P } from '@components/Typography';

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

function UploadDisabled(props: any) {
  const [state, setState] = React.useState({});

  const sidebarElement = <AuthenticatedSidebar viewer={props.viewer} />;

  return (
    <Page title="Estuary: Upload: CID" description="Use an existing IPFS CID to make storage deals." url={`${props.hostname}/upload-cid`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <SingleColumnLayout>
          <H2>Upload Disabled</H2>
          <P style={{ marginTop: 16 }}>Estuary is currently unable to handle more data. Please check back later.</P>

          <div className={styles.actions}>
            <Button
              style={{
                marginBottom: 24,
                background: 'var(--main-button-background-secondary)',
                color: 'var(--main-button-text-secondary)',
              }}
              href="/home"
            >
              View your files
            </Button>
          </div>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default UploadDisabled;
