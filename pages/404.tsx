import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';

import ProgressCard from '@components/ProgressCard';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import SingleColumnLayout from '@components/SingleColumnLayout';
import { Box, Container } from '@mui/material';

function ErrorPage(props: any) {
  return (
    <AuthenticatedLayout navigation={<Navigation isAuthenticated active="404" />} sidebar={props.viewer ? <AuthenticatedSidebar viewer={props.viewer} /> : null}>
      <Page title="Estuary: 404" description="This page does not exist." url={props.hostname ?? ''}>
        <Box className="bg-black" sx={{ height: '100vh' }}>
          {/* <SingleColumnLayout>
          <EmptyStatePlaceholder>404</EmptyStatePlaceholder>
        </SingleColumnLayout> */}
          <Container maxWidth="lg" sx={{ height: '100vh' }}>
            {/* <div className="h-85 bg-primary"></div> */}
          </Container>
        </Box>
      </Page>
    </AuthenticatedLayout>
  );
}

export default ErrorPage;
