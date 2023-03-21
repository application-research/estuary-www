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
import { FormGroup, Link, Stack, Typography, Box, Container } from '@mui/material';

import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import { H2, H3, H4, P } from '@components/Typography';
import Divider from '@components/Divider';

const mainPrimary = `#0BFF48`;
const darkGreen = `#0A7225`;
const blue = `#01BAE1`;

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

async function handleRegisterWithMetaMask(state: any, host) {
  if (!window.ethereum) {
    alert('You must have MetaMask installed!');
    return;
  }

  if (U.isEmpty(state.inviteCode)) {
    return { error: 'Please provide your invite code.' };
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

  const authSvcHost = C.api.authSvcHost;
  let userCreationResp = await fetch(`${authSvcHost}/register-with-metamask`, {
    method: 'POST',
    body: JSON.stringify({
      address: accounts[0],
      inviteCode: state.inviteCode,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (userCreationResp.status !== 200) {
    return { error: 'Failed to Create User' };
  }

  let from = accounts[0];
  let timestamp = new Date().toLocaleString();

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

  await authRedirect(r);
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

  await authRedirect(r);
}

async function authRedirect(resp) {
  if (resp.status !== 200) {
    return { error: 'Our server failed to register your account. Please contact us.' };
  }

  const j = await resp.json();
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

      <Container maxWidth="lg" sx={{}}>
        <Stack justifyContent="center" alignItems="center" sx={{}}>
          {/* <SingleColumnLayout style={{ maxWidth: 600 }}> */}
          {/* <Box className=" border-2 border-emerald rounded-xl" sx={{ px: 10, py: 4, boxShadow: '0px 4px 4px #40B1D4' }}> */}
          <Box className="  rounded-xl" sx={{ px: 10 }}>
            {/* <H2>Sign up</H2> */}

            <Typography className="text-4xl font-bold">Sign up</Typography>
            <Typography className="text-xl opacity-90 mt-5">You can create an account to use Estuary if you have an invite key.</Typography>

            {/* <P style={{ marginTop: 16 }}>You can create an account to use Estuary if you have an invite key.</P> */}

            <aside className={styles.formAside}>{state.fissionLoading ? 'We found an existing Estuary account. Signing you in now.' : ''}</aside>

            <Typography className="text-2xl mt-5">Create an account</Typography>
            {/* <Typography className="text-lg mt-5">UserName</Typography> */}
            {/* <H3 style={{ marginTop: 32 }}>Create an account</H3> */}
            {/* <H4 style={{ marginTop: 16 }}>Username</H4> */}

            {/* <Stack sx={{}} justifyContent="center" alignContent="center" alignItems="center"> */}

            <Stack sx={{ mt: 3 }}>
              <FormGroup>
                <CssTextField
                  label="UserName"
                  id="username"
                  name="username"
                  inputProps={{ pattern: C.regex.username }}
                  value={state.username}
                  onChange={(e) => setState({ ...state, [e.target.name]: e.target.value.toLowerCase() })}
                />
                <Typography className="text-md text-gray-400 mt-2 mb-6">Requirements: 1-32 characters or digits, no symbols allowed</Typography>

                <CssTextField
                  label="Password"
                  id="password"
                  type="password"
                  value={state.password}
                  inputProps={{ pattern: C.regex.password }}
                  name="password"
                  onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                />

                <Typography className="text-md text-gray-400 mt-2 mb-6">Requirements: at least 8 characters, must use at least one letter and number.</Typography>

                <CssTextField
                  label="Confirm"
                  id="confirmPassword"
                  type="password"
                  value={state.confirmPassword}
                  name="confirmPassword"
                  onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                />
                <Typography className="text-md text-gray-400 mt-2 mb-6">Enter Password to again</Typography>

                <CssTextField
                  label="invite code"
                  id="inviteCode"
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
                <Typography className="text-md text-gray-400 mt-2 mb-6">
                  Need an invite Key ?
                  <Link href="https://docs.estuary.tech/" underline="none" sx={{ color: blue, ':hover': { color: 'white' }, transition: '300ms ease-in-out' }}>
                    {' '}
                    Learn How to get One{' '}
                  </Link>
                </Typography>
              </FormGroup>
            </Stack>

            {/* 
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
            </aside> */}

            <Stack sx={{}}>
              <div className="">
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
                  sign up
                </Button>

                <Button
                  style={{
                    width: '100%',
                    marginTop: 24,
                  }}
                  href="/sign-in"
                >
                  Sign in instead
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
              </div>
              {/* <aside className={styles.formAside} style={{ marginTop: 8, display: 'block' }}>
                By creating an account or by using Estuary you unconditionally agree to our{' '}
                <a >
                  Terms of Service
                </a>


                .
              </aside> */}

              <Typography className="text-md text-gray-400 mt-8 mb-8">
                By creating an account or by using Estuary you unconditionally agree to our{' '}
                <Link href="https://docs.estuary.tech/terms" target="_blank" underline="none" sx={{ color: blue, ':hover': { color: 'white' }, transition: '300ms ease-in-out' }}>
                  Terms of Service
                </Link>
              </Typography>
            </Stack>
          </Box>
          {/* </SingleColumnLayout> */}
        </Stack>
      </Container>
    </Page>
  );
}

export default SignUpPage;
