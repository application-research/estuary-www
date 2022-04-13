import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';
import * as R from '@common/requests';
import * as Crypto from '@common/crypto';

import Cookies from 'js-cookie';
import ProgressCard from '@components/ProgressCard';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import SingleColumnLayout from '@components/SingleColumnLayout';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
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

const onSubmit = async (event, state, setState) => {
  if (U.isEmpty(state.key)) {
    alert('Please provide a valid key');
    return null;
  }

  console.log('Impersonating...');
  Cookies.set(C.auth, state.key);
  window.location.reload();
};

function ImpersonatePage(props: any) {
  const [state, setState] = React.useState({ key: '', loading: false });

  const sidebarElement = <AuthenticatedSidebar active="ADMIN_IMPERSONATE" viewer={props.viewer} />;
  const navigationElement = <Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />;

  return (
    <Page title="Estuary: Settings: Account" description="Update your settings for your account." url={`${props.site}/settings`}>
      <AuthenticatedLayout navigation={navigationElement} sidebar={sidebarElement}>
        <SingleColumnLayout>
          <H2>Impersonate</H2>
          <P style={{ marginTop: 16 }}>Tools to debug other users.</P>
        </SingleColumnLayout>

        <SingleColumnLayout>
          <H3>API key impersonation</H3>
          <P style={{ marginTop: 16 }}>
            Please enter another users API key to gain access to their account, once you do this you will have to sign out and sign back into this one.
          </P>

          <H4 style={{ marginTop: 32 }}>API key</H4>
          <Input
            style={{ marginTop: 8 }}
            placeholder="ex: ESTxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxARY"
            name="key"
            value={state.key}
            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
          />

          <div className={styles.actions}>
            <Button loading={state.loading} onClick={(e) => onSubmit(e, { ...state }, setState)}>
              Impersonate
            </Button>
          </div>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default ImpersonatePage;
