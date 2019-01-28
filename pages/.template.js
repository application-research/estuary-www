import styles from "~/pages/app.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";

import ProgressCard from "~/components/ProgressCard";
import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";
import EmptyStatePlaceholder from "~/components/EmptyStatePlaceholder";
import SingleColumnLayout from "~/components/SingleColumnLayout";

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

function TemplatePage(props) {
  return (
    <Page
      title="Estuary: Template"
      description="This is a template page."
      url="https://estuary.tech"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated active="TEMPLATE" />}
        sidebar={<AuthenticatedSidebar viewer={props.viewer} />}
      >
        <SingleColumnLayout>
          <EmptyStatePlaceholder>Feature coming soon</EmptyStatePlaceholder>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default TemplatePage;
