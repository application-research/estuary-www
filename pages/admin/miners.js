import styles from "~/pages/app.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as R from "~/common/requests";

import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";
import SingleColumnLayout from "~/components/SingleColumnLayout";
import GridSection from "~/components/GridSection";
import EmptyStatePlaceholder from "~/components/EmptyStatePlaceholder";
import Block from "~/components/Block";
import Input from "~/components/Input";
import Button from "~/components/Button";
import MinerTable from "~/components/MinerTable";

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

function AdminMinersPage(props) {
  const [state, setState] = React.useState({
    loading: false,
    suspend_miner: "",
    miner: "",
    reason: "",
  });

  React.useEffect(async () => {
    let map = {};
    const response = await R.get("/admin/miners/stats");

    for (let m of response) {
      map[m.miner] = m;
    }

    console.log(map);

    const list = await R.get("/public/miners");

    const miners = list.map((each) => {
      if (map[each.addr]) {
        return {
          ...each,
          ...map[each.addr],
        };
      }

      return each;
    });

    setState({ ...state, miners });
  }, []);

  return (
    <Page
      title="Estuary: Admin: Add miner"
      description="Add a miner to make Filecoin storage deals with"
      url="https://estuary.tech/admin/miners"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="ADMIN_MINERS" viewer={props.viewer} />}
      >
        <div>
          <GridSection>
            <H2>Manage miners</H2>
            <P style={{ marginTop: 8 }}>
              Add, remove or reinstate any miner you would like to make deals with using Estuary's
              escrow.
            </P>

            <H3 style={{ marginTop: 24 }}>Add Miner by ID</H3>
            <Input
              style={{ marginTop: 8 }}
              placeholder="ex: f0100"
              value={state.miner}
              name="miner"
              onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
            />

            <div className={styles.actions}>
              <Button
                loading={state.loading ? state.loading : undefined}
                onClick={async () => {
                  if (U.isEmpty(state.miner)) {
                    alert("Please provide a miner.");
                    return;
                  }

                  setState({ ...state, loading: true });
                  const request = R.post(`/admin/miners/add/${state.miner}`, {});
                  setState({ ...state, miner: "", loading: false });
                }}
              >
                Add
              </Button>

              <Button
                style={{
                  marginLeft: 24,
                  background: "var(--main-button-background-secondary)",
                  color: "var(--main-button-text-secondary)",
                }}
                loading={state.loading ? state.loading : undefined}
                onClick={async () => {
                  if (U.isEmpty(state.miner)) {
                    alert("Please provide a miner.");
                    return;
                  }

                  setState({ ...state, loading: true });
                  const request = R.post(`/admin/miners/rm/${state.miner}`, {});
                  setState({ ...state, miner: "", loading: false });
                }}
              >
                Remove
              </Button>

              <Button
                style={{
                  marginLeft: 24,
                  background: "var(--main-button-background-secondary)",
                  color: "var(--main-button-text-secondary)",
                }}
                loading={state.loading ? state.loading : undefined}
                onClick={async () => {
                  if (U.isEmpty(state.miner)) {
                    alert("Please provide a miner.");
                    return;
                  }

                  setState({ ...state, loading: true });
                  const request = R.put(`/admin/miners/unsuspend/${state.miner}`, {});
                  setState({ ...state, miner: "", loading: false });
                }}
              >
                Reinstate
              </Button>
            </div>
          </GridSection>

          <GridSection>
            <H2>Suspend miner</H2>
            <P style={{ marginTop: 8 }}>
              You can suspend a miner. Your Estuary node will no longer make deals with this miner.
            </P>

            <H3 style={{ marginTop: 24 }}>Miner</H3>
            <Input
              style={{ marginTop: 8 }}
              placeholder="ex: f0100"
              value={state.suspend_miner}
              name="suspend_miner"
              onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
            />
            <H3 style={{ marginTop: 8 }}>Reason</H3>
            <Input
              style={{ marginTop: 8 }}
              placeholder="ex: miner ask is too high."
              value={state.reason}
              name="reason"
              onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
            />

            <div className={styles.actions}>
              <Button
                loading={state.loading ? state.loading : undefined}
                onClick={async () => {
                  if (U.isEmpty(state.suspend_miner)) {
                    alert("Please provide a miner to suspend.");
                    return;
                  }

                  setState({ ...state, loading: true });
                  const request = R.post(`/admin/miners/suspend/${state.suspend_miner}`, {
                    reason: state.reason,
                  });

                  if (request && request.error) {
                    alert(request.error);
                    return;
                  }

                  setState({ ...state, miner: "", suspend_miner: "", reason: "", loading: false });
                }}
              >
                Suspend {state.suspend_miner}
              </Button>
            </div>
          </GridSection>

          <MinerTable miners={state.miners} />
        </div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminMinersPage;
