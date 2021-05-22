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
import Block from "~/components/Block";
import Input from "~/components/Input";
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

function AdminInvitesPage(props) {
  const [state, setState] = React.useState({ invites: [] });

  React.useEffect(async () => {
    const response = await R.get("/admin/invites");
    console.log(response);
    setState({ ...state, invites: response && response.length ? response : [] });
  }, []);

  return (
    <Page
      title="Estuary: Admin: Invite"
      description="Create invite keys for new users."
      url="https://estuary.tech/admin/invite"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="ADMIN_INVITES" viewer={props.viewer} />}
      >
        <div className={styles.group}>
          <SingleColumnLayout>
            <H2>Create Invite</H2>
            <P style={{ marginTop: 8 }}>
              You can create a single use key with any string that you like.
            </P>

            <H3 style={{ marginTop: 24 }}>Invite key</H3>
            <Input
              style={{ marginTop: 8 }}
              placeholder="Pick something memorable"
              value={state.key}
              name="key"
              onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
              onSubmit={async () => {
                setState({ ...state, loading: true });
                await R.post(`/admin/invite/${state.key}`, {});
                setState({ ...state, loading: false, key: false });
              }}
            />

            <div className={styles.actions}>
              <Button
                loading={state.loading ? state.loading : undefined}
                onClick={async () => {
                  setState({ ...state, loading: true });
                  await R.post(`/admin/invite/${state.key}`, {});
                  setState({ ...state, loading: false, key: false });
                }}
              >
                Create invite
              </Button>
            </div>
          </SingleColumnLayout>

          <table className={tstyles.table}>
            <tbody className={tstyles.tbody}>
              <tr className={tstyles.tr}>
                <th className={tstyles.th}>Estuary invite key</th>
                <th className={tstyles.th} style={{ width: "136px" }}>
                  Creator
                </th>
                <th className={tstyles.th} style={{ width: "136px" }}>
                  Recipient
                </th>
              </tr>
              {state.invites && state.invites.length
                ? state.invites.map((data, index) => {
                    return (
                      <tr key={data.code} className={tstyles.tr}>
                        <td className={tstyles.td}>{data.code}</td>
                        <td className={tstyles.td}>{data.createdBy}</td>
                        <td className={tstyles.td}>{data.claimedBy}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminInvitesPage;
