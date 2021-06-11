import styles from "@pages/app.module.scss";

import * as React from "react";
import * as U from "@common/utilities";
import * as C from "@common/constants";
import * as Crypto from "@common/crypto";

import Cookies from "js-cookie";
import Page from "@components/Page";
import Navigation from "@components/Navigation";
import SingleColumnLayout from "@components/SingleColumnLayout";
import Input from "@components/Input";
import Button from "@components/Button";

import { H1, H2, H3, P } from "@components/Typography";

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  if (viewer) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
    };
  }

  return {
    props: { viewer },
  };
}

async function handleRegister(state: any) {
  if (U.isEmpty(state.password)) {
    return { error: "Please provide a valid password." };
  }

  if (!U.isValidPassword(state.password)) {
    return {
      error:
        "Please provide a password thats at least 8 characters with at least one letter and one number",
    };
  }

  if (U.isEmpty(state.username)) {
    return { error: "Please provide a username." };
  }

  if (U.isEmpty(state.inviteCode)) {
    return { error: "Please provide your invite code." };
  }

  if (!U.isValidUsername(state.username)) {
    return {
      error:
        "Your username must be 1-48 uppercase or lowercase characters or digits with no spaces.",
    };
  }

  let passwordHash = await Crypto.attemptHashWithSalt(state.password);

  let r = await fetch(`${C.api.host}/register`, {
    method: "POST",
    body: JSON.stringify({
      passwordHash: passwordHash,
      username: state.username.toLowerCase(),
      inviteCode: state.inviteCode,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (r.status !== 200) {
    return { error: "Our server failed to register your account. Please contact us." };
  }

  const j = await r.json();
  if (j.error) {
    return j;
  }

  if (!j.token) {
    return {
      error: "Our server failed to register your account and sign you in. Please contact us.",
    };
  }

  Cookies.set(C.auth, j.token);
  window.location.href = "/home";
  return;
}

function SignUpPage(props: any) {
  const [state, setState] = React.useState({
    inviteCode: "",
    username: "",
    password: "",
    loading: false,
  });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get("invite");

    if (!U.isEmpty(inviteCode)) {
      setState({ ...state, inviteCode });
    }
  }, []);

  return (
    <Page
      title="Estuary: Sign up"
      description="Create an account on Estuary with an invite key."
      url="https://estuary.tech/sign-up"
    >
      <Navigation active="SIGN_UP" />
      <SingleColumnLayout style={{ maxWidth: 488 }}>
        <H2>Sign up</H2>
        <P style={{ marginTop: 8 }}>
          You can create an account to use Estuary if you have an invite key.
        </P>

        <H3 style={{ marginTop: 24 }}>Username</H3>
        <Input
          style={{ marginTop: 8 }}
          placeholder="Type in your desired username"
          name="username"
          pattern={C.regex.username}
          value={state.username}
          onChange={(e) => setState({ ...state, [e.target.name]: e.target.value.toLowerCase() })}
        />
        <aside className={styles.formAside}>
          Requirements: 1-32 characters or digits, no symbols allowed
        </aside>

        <H3 style={{ marginTop: 24 }}>Password</H3>
        <Input
          style={{ marginTop: 8 }}
          placeholder="Type in your password"
          type="password"
          value={state.password}
          name="password"
          onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
        />
        <aside className={styles.formAside}>
          Requirements: at least 8 characters, must use at least one letter and number.
        </aside>

        <H3 style={{ marginTop: 24 }}>Invite code</H3>
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
            });
            if (response && response.error) {
              alert(response.error);
              setState({ ...state, loading: false });
            }
          }}
        />
        <aside className={styles.formAside}>
          Need an invite key?{" "}
          <a href="https://docs.estuary.tech" target="_blank">
            Learn how to get one.
          </a>
          .
        </aside>

        <div className={styles.actions}>
          <Button
            style={{ width: "100%" }}
            loading={state.loading ? state.loading : undefined}
            onClick={async () => {
              setState({ ...state, loading: true });
              const response = await handleRegister({
                password: state.password,
                username: state.username,
                inviteCode: state.inviteCode,
              });
              if (response && response.error) {
                alert(response.error);
                setState({ ...state, loading: false });
              }
            }}
          >
            Sign up
          </Button>
          <Button
            style={{
              width: "100%",
              marginTop: 12,
              background: "var(--main-button-background-secondary)",
              color: "var(--main-button-text-secondary)",
            }}
            href="/sign-in"
          >
            Sign in instead
          </Button>
        </div>
      </SingleColumnLayout>
    </Page>
  );
}

export default SignUpPage;
