import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';
import * as Crypto from '@common/crypto';

import * as Webnative from 'webnative';
import { useFissionAuth } from '@common/useFissionAuth';

import Cookies from 'js-cookie';
import Page from '@components/Page';
import SingleColumnLayout from '@components/SingleColumnLayout';
import Input from '@components/Input';
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

async function handleRegister(state: any) {
  if (U.isEmpty(state.password)) {
    return { error: 'Please provide a valid password.' };
  }

  if (!U.isValidPassword(state.password)) {
    return {
      error: 'Please provide a password thats at least 8 characters with at least one letter and one number',
    };
  }

  if (U.isEmpty(state.username)) {
    return { error: 'Please provide a username.' };
  }

  if (U.isEmpty(state.inviteCode)) {
    return { error: 'Please provide your invite code.' };
  }

  if (!U.isValidUsername(state.username)) {
    return {
      error: 'Your username must be 1-48 uppercase or lowercase characters or digits with no spaces.',
    };
  }

  let passwordHash = await Crypto.attemptHashWithSalt(state.password);

  let r = await fetch(`${C.api.host}/register`, {
    method: 'POST',
    body: JSON.stringify({
      passwordHash: passwordHash,
      username: state.username.toLowerCase(),
      inviteCode: state.inviteCode,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (r.status !== 200) {
    return { error: 'Our server failed to register your account. Please contact us.' };
  }

  const j = await r.json();
  if (j.error) {
    return j;
  }

  if (!j.token) {
    return {
      error: 'Our server failed to register your account and sign you in. Please contact us.',
    };
  }

  /** Request an API token to store for the next sign in
   * The token is stored encrypted at rest in WNFS.
   * NOTE(bgins)
   */

  let response = await fetch(`${C.api.host}/user/api-keys`, {
    method: 'POST',
    body: '{}',
    headers: {
      Authorization: `Bearer ${j.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 403) {
    return { error: 'You are not authorized.' };
  }

  const json = await response.json();
  if (json.error) {
    return json;
  }

  if (!json.token) {
    return {
      error: 'Our server failed to issue you credentials. Please contact us.',
    };
  }

  const tokenPath = state.fs.appPath(Webnative.path.file(C.auth));
  await state.fs.write(tokenPath, json.token);
  const result = await state.publish(tokenPath);

  if (result?.error) {
    return result;
  }

  // NOTE(bgins): Set the first token granted and redirect to home
  Cookies.set(C.auth, j.token);
  window.location.href = '/home';
  return;
}

function AccountSetupPage(props: any) {
  const [state, setState] = React.useState({
    inviteCode: '',
    username: '',
    password: '',
    loading: false,
    fs: null,
  });
  const { fs, publish, readToken, username } = useFissionAuth({ host: props.host, protocol: props.protocol });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('invite');

    if (!U.isEmpty(inviteCode)) {
      setState({ ...state, inviteCode });
    }

    async function checkForToken() {
      const token = await readToken();
      if (token) {
        window.location.href = '/authed-with-fission';
      }
    }
    checkForToken();
  }, []);

  /** Check for token
   * The user may already have an account. If we have a token stored for
   * them, redirect them to the Authed with Fission interstitial page
   * NOTE(bgins)
   */

  React.useEffect(() => {
    async function checkForToken() {
      const token = await readToken();
      if (token) {
        window.location.href = '/authed-with-fission';
      }
    }
    checkForToken();
  }, [fs]);

  return (
    <Page title="Estuary: Account Setup" description="Setup an account on Estuary with an invite key." url="https://estuary.tech/account-setup">
      <SingleColumnLayout style={{ maxWidth: 488 }}>
        <H2>Account Setup</H2>
        <P style={{ marginTop: 16 }}>Welcome back! You can create an account to use Estuary if you have an invite key.</P>
        <P style={{ marginTop: 16 }}>{username ? `You are signed into Fission as ${username}.` : 'One moment, we are loading your Fission account.'}</P>

        <H4 style={{ marginTop: 32 }}>Username</H4>
        <Input
          style={{ marginTop: 8 }}
          placeholder="Type in your desired username"
          name="username"
          pattern={C.regex.username}
          value={state.username}
          onChange={(e) => setState({ ...state, [e.target.name]: e.target.value.toLowerCase() })}
        />
        <aside className={styles.formAside}>Requirements: 1-32 characters or digits, no symbols allowed</aside>

        <H4 style={{ marginTop: 24 }}>Password</H4>
        <Input
          style={{ marginTop: 8 }}
          placeholder="Type in your password"
          type="password"
          value={state.password}
          name="password"
          onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
        />
        <aside className={styles.formAside}>Requirements: at least 8 characters, must use at least one letter and number.</aside>

        <H4 style={{ marginTop: 24 }}>Invite code</H4>
        <Input
          style={{ marginTop: 8 }}
          placeholder="Provide your invite code"
          type="text"
          value={state.inviteCode}
          name="inviteCode"
          onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
          onSubmit={async () => {
            setState({ ...state, loading: true });
            const response = await handleRegister({
              password: state.password,
              username: state.username,
              inviteCode: state.inviteCode,
              fs,
              publish,
            });
            if (response && response.error) {
              alert(response.error);
              setState({ ...state, loading: false });
            }
          }}
        />
        <aside className={styles.formAside}>
          Need an invite key?{' '}
          <a href="https://docs.estuary.tech" target="_blank">
            Learn how to get one.
          </a>
          .
        </aside>

        <div className={styles.actions}>
          <Button
            style={username ? { width: '100%' } : { width: '100%', backgroundColor: '#aaaaaa' }}
            loading={state.loading ? state.loading : undefined}
            onClick={async () => {
              setState({ ...state, loading: true });
              const response = await handleRegister({
                password: state.password,
                username: state.username,
                inviteCode: state.inviteCode,
                fs,
                publish,
              });
              if (response && response.error) {
                alert(response.error);
                setState({ ...state, loading: false });
              }
            }}
          >
            Set up account
          </Button>
          <Button
            style={{
              width: '100%',
              marginTop: 12,
              background: 'var(--main-button-background-secondary)',
              color: 'var(--main-button-text-secondary)',
            }}
            href="/sign-in"
          >
            Sign in instead
          </Button>
        </div>
        <aside className={styles.formAside} style={{ marginTop: 8, display: 'block' }}>
          By creating an account or by using Estuary you unconditionally agree to our{' '}
          <a href="https://docs.estuary.tech/terms" target="_blank">
            Terms of Service
          </a>
          .
        </aside>
      </SingleColumnLayout>
    </Page>
  );
}

export default AccountSetupPage;
