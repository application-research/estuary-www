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

import { H2, H3, H4, P } from '@components/Typography';
import Divider from '@components/Divider';

declare var window: any

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
    props: { viewer, host, protocol, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${host}` },
  };
}

async function connect() {
  if (!window.ethereum) {
    alert("You must have MetaMask installed!");
    return;
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

  console.log(accounts[0])

  return accounts[0]
}

async function handleRegisterWithMetaMask(state: any, host) {

  if (U.isEmpty(state.inviteCode)) {
    return { error: 'Please provide your invite code.' };
  }
  let user = await connect()
  let passwordHash = await Crypto.attemptHashWithSalt(user);

  let r = await fetch(`${host}/register`, {
    method: 'POST',
    body: JSON.stringify({
      passwordHash: passwordHash,
      username: user,
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

  Cookies.set(C.auth, j.token);
  window.location.href = '/home';
  return;
}

async function handleRegister(state: any, host) {
  if (U.isEmpty(state.password)) {
    return { error: 'Please provide a valid password.' };
  }

  if (!U.isValidPassword(state.password)) {
    return {
      error: 'Please provide a password thats at least 8 characters with at least one letter and one number',
    };
  }

  // make sure this field isn't empty
  if (U.isEmpty(state.confirmPassword)) {
    return { error: 'Please enter your password again.' };
  }

  // add password confirmation
  if (!U.isValidPassword(state.confirmPassword || state.confirmPassword !== state.password)) {
    return {
      error: 'Passwords do not match',
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

  let r = await fetch(`${host}/register`, {
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

  Cookies.set(C.auth, j.token);
  window.location.href = '/home';
  return;
}

function SignUpPage(props: any) {
  const [state, setState] = React.useState({
    inviteCode: '',
    username: '',
    password: '',
    confirmPassword: '',
    loading: false,
    fissionLoading: false,
    metaMaskLoading: false,
  });

  const authorise = null;
  const authScenario = null;
  const signIn = null;

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('invite');

    if (!U.isEmpty(inviteCode)) {
      setState({ ...state, inviteCode });
    }
  }, []);

  return (
      <Page title="Estuary: Sign up" description="Create an account on Estuary with an invite key." url={`${props.hostname}/sign-up`}>
        <Navigation active="SIGN_UP" />
        <SingleColumnLayout style={{ maxWidth: 488 }}>
          <H2>Sign up</H2>
          <P style={{ marginTop: 16 }}>You can create an account to use Estuary if you have an invite key.</P>

          <aside className={styles.formAside}>{state.fissionLoading ? 'We found an existing Estuary account. Signing you in now.' : ''}</aside>

          <H3 style={{ marginTop: 32 }}>Create an account</H3>
          <H4 style={{ marginTop: 16 }}>Username</H4>
          <Input
            style={{ marginTop: 8 }}
            placeholder="Type in your desired username"
            name="username"
            // pattern={C.regex.username}
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

          <H4 style={{ marginTop: 24 }}>Confirm Password</H4>
          <Input
            style={{ marginTop: 8 }}
            placeholder="Type in your password"
            type="password"
            value={state.confirmPassword}
            name="confirmPassword"
            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
          />
          <aside className={styles.formAside}>Enter your password again</aside>

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
              const response = await handleRegister(
                {
                  password: state.password,
                  username: state.username,
                  confirmPassword: state.confirmPassword,
                  inviteCode: state.inviteCode,
                },
                props.api
              );
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
              style={{ width: '100%' }}
              loading={state.loading ? state.loading : undefined}
              onClick={async () => {
                setState({ ...state, loading: true });
                const response = await handleRegister(
                  {
                    password: state.password,
                    username: state.username,
                    confirmPassword: state.confirmPassword,
                    inviteCode: state.inviteCode,
                  },
                  props.api
                );
                if (response && response.error) {
                  alert(response.error);
                  setState({ ...state, loading: false });
                }
              }}
            >
              Sign up
            </Button>
            <Divider text="Or"></Divider>
            <Button
              style={{
                width: '100%',
              }}
              loading={state.metaMaskLoading ? state.metaMaskLoading : undefined}
              onClick={async () => {
                setState({ ...state, metaMaskLoading: true });
                const response = await handleRegisterWithMetaMask(
                  {
                    username: state.username,
                    inviteCode: state.inviteCode,
                  },
                  props.api
                );
                if (response && response.error) {
                  alert(response.error);
                  setState({ ...state, metaMaskLoading: false });
                }
              }}
            >
              Sign up using MetaMask
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

export default SignUpPage;
