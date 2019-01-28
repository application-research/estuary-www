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

function APIPage(props) {
  const [state, setState] = React.useState({ keys: [], loading: false });

  React.useEffect(async () => {
    // TODO(why)
    // Response throws instead of returning an empty array.
    const response = await R.get("/user/api-keys");
    console.log(response);

    if (response && !response.error) {
      setState({ keys: response });
    }
  }, []);

  return (
    <Page
      title="Estuary: API"
      description="Generate and manage your API keys."
      url="https://estuary.tech/api"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated active="TEMPLATE" />}
        sidebar={<AuthenticatedSidebar viewer={props.viewer} />}
      >
        <div>
          <SingleColumnLayout>
            <H2>API</H2>
            <P style={{ marginTop: 8 }}>Generate an API key or manage your existing keys</P>

            <div className={styles.actions}>
              <Button
                loading={state.loading ? state.loading : undefined}
                onClick={async () => {
                  setState({ ...state, loading: true });
                  const request = R.post(`/user/api-keys`, {});
                  setState({ ...state, loading: false });
                }}
              >
                Create a key
              </Button>
            </div>
          </SingleColumnLayout>

          <table className={tstyles.table}>
            <tbody className={tstyles.tbody}>
              <tr className={tstyles.tr}>
                <th className={tstyles.th}>Key</th>
                <th className={tstyles.th} style={{ width: "136px" }}>
                  Options
                </th>
              </tr>
              {state.keys && state.keys.length
                ? state.keys.map((k, index) => {
                    return (
                      <tr key={k.token} className={tstyles.tr}>
                        <td className={tstyles.td}>{k.token}</td>
                        <td
                          className={tstyles.tdcta}
                          onClick={async () => {
                            const confirm = window.confirm(
                              "Are you sure you want to delete this key?"
                            );

                            const response = await R.del(`/user/api-keys/${k.token}`);

                            const keys = await R.get("/user/api-keys");

                            if (keys && !keys.error) {
                              setState({ keys });
                            }
                          }}
                        >
                          <span className={tstyles.cta}>Revoke</span>
                        </td>
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

export default APIPage;
