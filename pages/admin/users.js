import styles from "~/pages/app.module.scss";
import tstyles from "~/pages/table.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as R from "~/common/requests";

import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";
import SingleColumnLayout from "~/components/SingleColumnLayout";
import EmptyStatePlaceholder from "~/components/EmptyStatePlaceholder";

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

function AdminUsersPage(props) {
  const [state, setState] = React.useState({ users: [] });

  React.useEffect(async () => {
    const response = await R.get("/admin/users");
    if (response && response.error) {
      return;
    }

    setState({ users: response });
  }, []);

  return (
    <Page
      title="Estuary: Admin: Users"
      description="All the users using this Estuary node."
      url="https://estuary.tech/admin/users"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="ADMIN_USERS" viewer={props.viewer} />}
      >
        <table className={tstyles.table}>
          <tbody className={tstyles.tbody}>
            <tr className={tstyles.tr}>
              <th className={tstyles.th} style={{ width: "96px" }}>
                id
              </th>
              <th className={tstyles.th}>Username</th>
              <th className={tstyles.th} style={{ width: "136px" }}>
                Space
              </th>
              <th className={tstyles.th} style={{ width: "136px" }}>
                Files
              </th>
            </tr>
            {state.users && state.users.length
              ? state.users.map((data, index) => {
                  return (
                    <tr className={tstyles.tr} key={data.username}>
                      <td className={tstyles.td}>{data.id}</td>
                      <td className={tstyles.td}>{data.username}</td>
                      <td className={tstyles.td}>{U.bytesToSize(data.spaceUsed)}</td>
                      <td className={tstyles.td}>{data.numFiles}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminUsersPage;
