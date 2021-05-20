import styles from "~/pages/app.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as R from "~/common/requests";

import ProgressCard from "~/components/ProgressCard";
import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";
import SingleColumnLayout from "~/components/SingleColumnLayout";
import EmptyStatePlaceholder from "~/components/EmptyStatePlaceholder";

import { H1, H2, P } from "~/components/Typography";

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

function SettingsPage(props) {
  return (
    <Page
      title="Estuary: Settings"
      description="Update your settings for your account."
      url="https://estuary.tech/settings"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="SETTINGS" viewer={props.viewer} />}
      >
        <SingleColumnLayout>
          <EmptyStatePlaceholder>Coming soon</EmptyStatePlaceholder>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default SettingsPage;
