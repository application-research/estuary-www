import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';

import { useFissionAuth } from '@common/useFissionAuth';

import Page from '@components/Page';
import SingleColumnLayout from '@components/SingleColumnLayout';
import Button from '@components/Button';

import { H1, H2, H3, H4, P } from '@components/Typography';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);
  const host = context.req.headers.host;
  const protocol = host.split(':')[0] === 'localhost' ? 'http' : 'https';

  if (viewer) {
    return {
      redirect: {
        permanent: false,
        destination: '/home',
      },
    };
  }

  return {
    props: { viewer, host, protocol },
  };
}

function AuthedWithFissionPage(props: any) {
  const [state, setState] = React.useState({
    loading: false,
    fs: null,
  });
  const { signIn, username } = useFissionAuth({ host: props.host, protocol: props.protocol });

  return (
    <Page title="Estuary: Authenticated with Fission" description="Authenticated with Fission. Continue to Estuary" url="https://estuary.tech/authed-with-fission">
      <SingleColumnLayout style={{ maxWidth: 488 }}>
        <H2>Authenticated with Fission</H2>
        <P style={{ marginTop: 16 }}>{username ? `Welcome back! You are signed into Fission as ${username}.` : 'One moment, we are loading your Fission account.'}</P>

        <div className={styles.actions}>
          <Button
            style={username ? { width: '100%' } : { width: '100%', backgroundColor: '#aaaaaa' }}
            loading={state.loading ? state.loading : undefined}
            onClick={async () => {
              setState({ ...state, loading: true });
              const response = await signIn();
              if (response && response.error) {
                alert(response.error);
                setState({ ...state, loading: false });
              }
            }}
          >
            Continue to Estuary
          </Button>
          <aside className={styles.formAside}>{state.loading ? 'One moment, we are signing you into Estuary with Fission.' : ''}</aside>
        </div>
      </SingleColumnLayout>
    </Page>
  );
}

export default AuthedWithFissionPage;
