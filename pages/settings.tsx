import styles from "@pages/app.module.scss";

import * as React from "react";
import * as U from "@common/utilities";
import * as R from "@common/requests";

import ProgressCard from "@components/ProgressCard";
import Navigation from "@components/Navigation";
import Page from "@components/Page";
import AuthenticatedLayout from "@components/AuthenticatedLayout";
import AuthenticatedSidebar from "@components/AuthenticatedSidebar";
import SingleColumnLayout from "@components/SingleColumnLayout";
import EmptyStatePlaceholder from "@components/EmptyStatePlaceholder";
import Input from "@components/Input";
import Button from "@components/Button";

import { H1, H2, H3, P } from "~/components/Typography";

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  if (!viewer) {
    return {
      redirect: {
        permanent: false,
        destination: "/sign-in",
      },
    };
  }

  return {
    props: { viewer },
  };
}

const onSubmit = async (event, state, setState) => {
  if (U.isEmpty(state.new)) {
    alert("Please provide a new password");
    return setState({ ...state, loading: false });
  }

  if (!U.isValidPassword(state.new)) {
    return {
      error:
        "Please provide a password thats at least 8 characters with at least one letter and one number",
    };
  }

  if (U.isEmpty(state.confirm)) {
    alert("Please confirm your new password");
    return setState({ ...state, loading: false });
  }

  if (state.new !== state.confirm) {
    alert("Please make sure you confirmed your new password correctly");
    return setState({ ...state, loading: false });
  }

  let newPasswordHash = await Crypto.attemptHashWithSalt(state.new);

  const response = await R.put("/user/password", { newPasswordHash: newPasswordHash });
};

function SettingsPage(props) {
  const [state, setState] = React.useState({ loading: false, old: "", new: "", confirm: "" });

  return (
    <Page
      title="Estuary: Settings: Account"
      description="Update your settings for your account."
      url="https://estuary.tech/settings"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="SETTINGS" viewer={props.viewer} />}
      >
        <SingleColumnLayout>
          <H2>Settings</H2>
          <P style={{ marginTop: 8 }}>Update your user settings.</P>
        </SingleColumnLayout>

        <SingleColumnLayout>
          <H2>Change password</H2>
          <P style={{ marginTop: 8 }}>
            Please enter your old password and your new password to change your password.
          </P>

          <H3 style={{ marginTop: 24 }}>New password</H3>
          <Input
            style={{ marginTop: 8 }}
            placeholder="Pick something memorable"
            name="new"
            type="password"
            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
          />
          <aside className={styles.formAside}>
            Requirements: at least 8 characers, must use at least one letter and number.
          </aside>

          <H3 style={{ marginTop: 24 }}>Confirm new password</H3>
          <Input
            style={{ marginTop: 8 }}
            placeholder="Pick something memorable"
            name="confirm"
            type="password"
            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
            onSubmit={(e) => onSubmit(e, { ...state }, setState)}
          />

          <div className={styles.actions}>
            <Button loading={state.loading} onClick={(e) => onSubmit(e, { ...state }, setState)}>
              Change
            </Button>
          </div>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default SettingsPage;
