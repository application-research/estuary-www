import styles from '@pages/app.module.scss';

import * as C from '@common/constants';
import * as Crypto from '@common/crypto';
import * as U from '@common/utilities';
import * as React from 'react';

import Button from '@components/Button';
import Input from '@components/Input';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import SingleColumnLayout from '@components/SingleColumnLayout';
import Cookies from 'js-cookie';

import { H2, H4, P } from '@components/Typography';

const ENABLE_SIGN_IN_WITH_FISSION = false;

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
    props: { host, protocol, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${host}` },
  };
}

async function handleSignIn(state: any, host) {
  if (U.isEmpty(state.username)) {
    return { error: 'Please provide a username.' };
  }

  if (U.isEmpty(state.password)) {
    return { error: 'Please provide a password.' };
  }

  if (!U.isValidUsername(state.username)) {
    return { error: 'Your username must be 1-48 characters or digits.' };
  }

  if (state.adminLogin == 'true') {
    state.passwordHash = state.password;
  } else {
    // NOTE(jim) We've added a new scheme to keep things safe for users.
    state.passwordHash = await Crypto.attemptHashWithSalt(state.password);
  }

  let r = await fetch(`${host}/login`, {
    method: 'POST',
    body: JSON.stringify({ passwordHash: state.passwordHash, username: state.username }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const j = await r.json();
  if (j.error) {
    return j;
  }

  if (!j.token) {
    return { error: 'Failed to authenticate' };
  }

  console.log('Authenticated using advanced scheme.');
  Cookies.set(C.auth, j.token);
  window.location.href = '/home';
  return;
}

function SignInPage(props: any) {
  const [state, setState] = React.useState({ loading: false, authLoading: false, fissionLoading: false, username: '', password: '', adminLogin: 'false' });
  return (
    <Page title="Estuary: Sign in" description="Sign in to your Estuary account." url={`${props.hostname}/sign-in`}>
      <Navigation active="SIGN_IN" />
      <SingleColumnLayout style={{ maxWidth: 488 }}>
        <H2>Sign in</H2>

        <P style={{ marginTop: 16 }}>If you have created an account with Estuary before, you can use your username and password to sign in.</P>
        <H4 style={{ marginTop: 32 }}>Username</H4>
        <Input
          style={{ marginTop: 8 }}
          placeholder="Your account's username"
          name="username"
          value={state.username}
          onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
        />

        <H4 style={{ marginTop: 24 }}>Password</H4>
        <Input
          style={{ marginTop: 8 }}
          placeholder="Your account's password"
          type="password"
          value={state.password}
          name="password"
          onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
          onSubmit={async () => {
            setState({ ...state, loading: true });
            const response = await handleSignIn(state, props.api);
            if (response && response.error) {
              alert(response.error);
              setState({ ...state, loading: false });
            }
          }}
        />

        <div className={styles.actions} style={{ marginTop: '16px' }}>
          <input
            type="checkbox"
            onClick={() => {
              if (state.adminLogin === 'false') {
                setState({ ...state, adminLogin: 'true' });
              } else {
                setState({ ...state, adminLogin: 'false' });
              }
            }}
          />
          <H4>This user was created using estuary CLI</H4>
        </div>

        <div className={styles.actions}>
          <Button
            style={{ width: '100%' }}
            loading={state.loading ? state.loading : undefined}
            onClick={async () => {
              setState({ ...state, loading: true });
              const response = await handleSignIn(state, props.api);
              if (response && response.error) {
                alert(response.error);
                setState({ ...state, loading: false });
              }
            }}
          >
            Sign in
          </Button>
          <Button
            style={{
              width: '100%',
              marginTop: 12,
              background: 'var(--main-button-background-secondary)',
              color: 'var(--main-button-text-secondary)',
            }}
            href="/sign-up"
          >
            Create an account instead
          </Button>
        </div>
      </SingleColumnLayout>
    </Page>
  );
}

export default SignInPage;
