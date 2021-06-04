import styles from "@pages/app.module.scss";

import * as React from "react";
import * as U from "@common/utilities";
import * as R from "@common/requests";

import Navigation from "@components/Navigation";
import Page from "@components/Page";
import AuthenticatedLayout from "@components/AuthenticatedLayout";
import AuthenticatedSidebar from "@components/AuthenticatedSidebar";
import SingleColumnLayout from "@components/SingleColumnLayout";
import EmptyStatePlaceholder from "@components/EmptyStatePlaceholder";
import Block from "@components/Block";

import { H1, H2, P } from "@components/Typography";

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

  if (viewer.perms < 10) {
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

function AdminStatsPage(props) {
  const [state, setState] = React.useState({});

  React.useEffect(async () => {
    // TODO(why): Content stats can't be serialized to JSON.
    // const response = await R.get("/content/stats");
    const response = {};
    const disk = await R.get("/admin/disk-info");
    if (disk.error) {
      console.log(disk.error);
      return;
    }

    setState({ ...state, ...response, ...disk });
  }, []);

  return (
    <Page
      title="Estuary: Admin: Stats"
      description="Estuary node performance and behavior."
      url="https://estuary.tech/stats"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="ADMIN_STATS" viewer={props.viewer} />}
      >
        <SingleColumnLayout>
          <H2>Stats</H2>
          <P style={{ marginTop: 8 }}>Statistics around your Estuary node usage.</P>

          {state.bstoreFree ? (
            <React.Fragment>
              <Block style={{ marginTop: 24 }} label="Available free space">
                {U.bytesToSize(state.bstoreFree)}
              </Block>

              <Block style={{ marginTop: 2 }} label="Total space capacity">
                {U.bytesToSize(state.bstoreSize)}
              </Block>
            </React.Fragment>
          ) : null}
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminStatsPage;
