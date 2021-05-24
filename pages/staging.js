import styles from "~/pages/app.module.scss";
import tstyles from "~/pages/table.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as R from "~/common/requests";

import ProgressCard from "~/components/ProgressCard";
import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";
import EmptyStatePlaceholder from "~/components/EmptyStatePlaceholder";
import SingleColumnLayout from "~/components/SingleColumnLayout";
import Button from "~/components/Button";

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

function StagingPage(props) {
  const [state, setState] = React.useState({ files: null });

  React.useEffect(async () => {
    const files = await R.get("/content/staging-zones");
    console.log(files);

    if (!files || files.error) {
      return;
    }

    setState({ files });
  }, []);

  console.log(props.viewer);

  return (
    <Page
      title="Estuary: Staging"
      description="Data before a Filecoin deal is made"
      url="https://estuary.tech/staging"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="FILES" viewer={props.viewer} />}
      >
        WIP
      </AuthenticatedLayout>
    </Page>
  );
}

export default StagingPage;
