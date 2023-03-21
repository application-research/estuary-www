import styles from '@pages/app.module.scss';

import TextField from '@mui/material/TextField';

import * as C from '@common/constants';
import * as Crypto from '@common/crypto';
import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { Alert, FormGroup, Link, Stack, Typography, Box, Container } from '@mui/material';
import Button from '@components/Button';
import Input from '@components/Input';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import SingleColumnLayout from '@components/SingleColumnLayout';
import Cookies from 'js-cookie';
import { H2, H4, P } from '@components/Typography';
import Divider from '@components/Divider';

const mainPrimary = `#0BFF48`;
const darkGreen = `#0A7225`;
const blue = `#01BAE1`;

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

async function handleSignInWithMetaMask(state: any, host) {
  if (!window.ethereum) {
    alert('You must have MetaMask installed!');
    return;
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  if (window.ethereum.networkVersion !== C.network.chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: C.network.chainId }],
      });
    } catch (err) {
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [C.network],
        });
      }
    }
  }

  let from = accounts[0];
  let timestamp = new Date().toLocaleString();

  const authSvcHost = C.api.authSvcHost;
  let response = await fetch(`${authSvcHost}/generate-nonce`, {
    method: 'POST',
    body: JSON.stringify({ host, address: from, issuedAt: timestamp, chainId: parseInt(C.network.chainId), version: '1' }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    return { error: 'Failed to Generate Nonce Message' };
  }

  const respJson = await response.json();
  if (respJson.error) {
    return respJson;
  }

  if (!respJson.nonceMsg) {
    return { error: 'No nonceMsg Generated' };
  }

  const msg = `0x${Buffer.from(respJson.nonceMsg, 'utf8').toString('hex')}`;

  let sign;
  try {
    sign = await window.ethereum.request({
      method: 'personal_sign',
      params: [msg, from, ''],
    });
  } catch (err) {
    return { error: err.message };
  }

  let r = await fetch(`${authSvcHost}/login-with-metamask`, {
    method: 'POST',
    body: JSON.stringify({ address: from, signature: sign }),
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

  Cookies.set(C.auth, j.token);
  window.location.href = '/home';
  return;
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

  if (r.status !== 200) {
    // NOTE(jim): We don't know the users password ever so we can't do anything on their
    // behalf, but if they were authenticated using the old method, we can do one more retry.
    const retryHash = await Crypto.attemptHash(state.password);

    let retry = await fetch(`${host}/login`, {
      method: 'POST',
      body: JSON.stringify({ passwordHash: retryHash, username: state.username }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (retry.status !== 200) {
      return { error: 'Failed to authenticate' };
    }

    const retryJSON = await retry.json();
    if (retryJSON.error) {
      return retryJSON;
    }

    if (!retryJSON.token) {
      return { error: 'Failed to authenticate' };
    }

    Cookies.set(C.auth, retryJSON.token);

    try {
      const response = await R.put('/user/password', { newPasswordHash: state.passwordHash }, host);
    } catch (e) {
      console.log(e);
    }

    window.location.href = '/home';
    return;
  }

  const j = await r.json();
  if (j.error) {
    return j;
  }

  if (!j.token) {
    return { error: 'Failed to authenticate' };
  }

  Cookies.set(C.auth, j.token);
  window.location.href = '/home';
  return;
}

const CssTextField = styled(TextField)({
  transition: 'all 0.3s ease-in-out',

  '& label': { color: 'gray' },
  '& helperText': { color: 'white' },
  '& .MuiInputBase-input': { color: 'white' },

  '& label.Mui-focused': {
    transition: 'all 0.3s ease-in-out',
    color: mainPrimary,
  },
  '& .MuiInput-underline:after': {
    transition: 'all 0.3s ease-in-out',
    borderBottomColor: mainPrimary,
  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      transition: 'all 0.3s ease-in-out',
      borderColor: mainPrimary,
    },
    '&:hover fieldset': {
      transition: 'all 0.3s ease-in-out',
      borderColor: darkGreen,
    },
    '&.Mui-focused fieldset': {
      transition: 'all 0.3s ease-in-out',
      borderColor: darkGreen,
    },
  },
});

function SignInPage(props: any) {
  const [state, setState] = React.useState({
    loading: false,
    authLoading: false,
    fissionLoading: false,
    username: '',
    password: '',
    adminLogin: 'false',
    metaMaskLoading: false,
  });

  return (
    <Page title="Estuary: Sign in" description="Sign in to your Estuary account." url={`${props.hostname}/sign-in`}>
      <Navigation active="SIGN_IN" />

      <Container maxWidth="lg" sx={{}}>
        <Stack justifyContent="center" alignItems="center" sx={{ p: 4 }}>
          {/* <SingleColumnLayout style={{ maxWidth: 600 }}> */}
          {/* <Box className="mt-16 border-2 border-emerald rounded-xl" sx={{ px: 10, py: 4, boxShadow: '0px 4px 4px #40B1D4', width: '50rem' }}> */}
          <Box className="mt-16   rounded-xl" sx={{ px: 10, py: 4, width: '50rem' }}>
            {/* <H2>Sign up</H2> */}

            <Typography className="text-5xl font-bold">Sign in</Typography>
            <Typography className="text-xl opacity-90 mt-8 leading-relaxed">
              If you have created an account with Estuary before, you can use your username and password to sign in.
            </Typography>

            {/* <aside className={styles.formAside}>{state.fissionLoading ? 'We found an existing Estuary account. Signing you in now.' : ''}</aside> */}

            <Stack sx={{ mt: 5 }}>
              <FormGroup>
                <CssTextField
                  label="UserName"
                  id="username"
                  style={{ marginTop: 8 }}
                  name="username"
                  value={state.username}
                  onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                />
                <Typography className="text-md text-gray-400 mt-2 mb-8">your account's username</Typography>

                <CssTextField
                  label="Password"
                  id="password"
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
                <Typography className="text-md text-gray-400 mt-2 mb-8">your account's password</Typography>

                <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-gray-600"
                    onClick={() => {
                      if (state.adminLogin === 'false') {
                        setState({ ...state, adminLogin: 'true' });
                      } else {
                        setState({ ...state, adminLogin: 'false' });
                      }
                    }}
                  />
                  <Typography className="text-md text-gray-200 ml-2 ">This user was created using estuary CLI</Typography>
                </Stack>
              </FormGroup>
            </Stack>

            <div className="space-y-6">
              <Button
                style={{ width: '100%' }}
                loading={state.loading ? state.loading : undefined}
                onClick={async () => {
                  setState({ ...state, loading: true });
                  const response = await handleSignIn(state, props.api);
                  if (response && response.error) {
                    alert(response.error);

                    setState({ ...state, loading: false });
                    return (
                      <>
                        <Alert severity="error">{response.error}</Alert>
                      </>
                    );
                  }
                }}
              >
                Sign in
              </Button>
              {/* <Divider text="Or"></Divider> */}
              <Button
                style={{
                  width: '100%',
                }}
                loading={state.metaMaskLoading ? state.metaMaskLoading : undefined}
                onClick={async () => {
                  setState({ ...state, metaMaskLoading: true });
                  const response = await handleSignInWithMetaMask(state, props.api);
                  if (response && response.error) {
                    alert(response.error);

                    setState({ ...state, metaMaskLoading: false });
                    return (
                      <>
                        <Alert severity="error">{response.error}</Alert>
                      </>
                    );
                  }
                }}
              >
                Sign in with MetaMask
              </Button>

              <Typography className="text-lg text-gray-400 mt-2 mb-8">
                Don't have an account ?
                <Link href="/sign-up" underline="none" sx={{ color: blue, ':hover': { color: 'white' }, transition: '300ms ease-in-out' }}>
                  {' '}
                  Create Account{' '}
                </Link>
              </Typography>
            </div>
          </Box>
        </Stack>
      </Container>
      {/* <SingleColumnLayout style={{ maxWidth: 488 }}>
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
          <Divider text="Or"></Divider>
          <Button
            style={{
              width: '100%',
            }}
            loading={state.metaMaskLoading ? state.metaMaskLoading : undefined}
            onClick={async () => {
              setState({ ...state, metaMaskLoading: true });
              const response = await handleSignInWithMetaMask(state, props.api);
              if (response && response.error) {
                alert(response.error);
                setState({ ...state, metaMaskLoading: false });
              }
            }}
          >
            Sign in with MetaMask
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
      </SingleColumnLayout> */}
    </Page>
  );
}

export default SignInPage;
