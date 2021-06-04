import styles from "@pages/app.module.scss";
import tstyles from "@pages/table.module.scss";

import * as React from "react";
import * as U from "@common/utilities";
import * as R from "@common/requests";

import Navigation from "@components/Navigation";
import Page from "@components/Page";
import ActionRow from "@components/ActionRow";
import AuthenticatedLayout from "@components/AuthenticatedLayout";
import AuthenticatedSidebar from "@components/AuthenticatedSidebar";
import SingleColumnLayout from "@components/SingleColumnLayout";
import EmptyStatePlaceholder from "@components/EmptyStatePlaceholder";
import Block from "@components/Block";
import Input from "@components/Input";
import Button from "@components/Button";

import { H1, H2, H3, P } from "@components/Typography";

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

function UploadCIDPage(props) {
  const [state, setState] = React.useState({
    success: false,
    loading: false,
    filename: "",
    cid: "",
  });

  return (
    <Page
      title="Estuary: Upload: CID"
      description="Use an existing IPFS CID to make storage deals."
      url="https://estuary.tech/upload-cid"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="UPLOAD_CID" viewer={props.viewer} />}
      >
        {!state.success ? (
          <div className={styles.group}>
            <SingleColumnLayout>
              <H2>Upload CID</H2>
              <P style={{ marginTop: 8 }}>
                Use an existing IPFS content address to make Filecoin storage deals. If you use any
                CID under {U.bytesToSize(props.viewer.settings.fileStagingThreshold)}, we will
                aggregate your files into a single deal.
              </P>

              <H3 style={{ marginTop: 24 }}>CID</H3>
              <Input
                style={{ marginTop: 8 }}
                placeholder="Type or paste your CID"
                value={state.cid}
                name="cid"
                onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
              />
              {U.isEmpty(state.cid) ? null : (
                <aside className={styles.formAside}>
                  Check your CID:{" "}
                  <a href={`https://dweb.link/ipfs/${state.cid}`} target="_blank">
                    https://dweb.link/ipfs/{state.cid}
                  </a>
                  .
                </aside>
              )}

              <H3 style={{ marginTop: 24 }}>New filename (optional)</H3>
              <Input
                style={{ marginTop: 8 }}
                placeholder="Type in a new filename"
                value={state.filename}
                name="filename"
                onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
                onSubmit={async () => {
                  setState({ ...state, loading: true });

                  if (U.isEmpty(state.cid)) {
                    alert("You must provide a CID");
                    return setState({ ...state, loading: false });
                  }

                  const response = await R.post(`/content/add-ipfs`, {
                    name: state.filename,
                    root: state.cid,
                  });
                  console.log(response);
                  if (response && response.error) {
                    alert(response.error);
                    return setState({ success: false, filename: "", cid: "", loading: false });
                  }
                  setState({ ...state, loading: false, filename: "", cid: "", success: true });
                }}
              />

              <H3 style={{ marginTop: 24 }}>Default deal settings</H3>
              <div style={{ maxWidth: "568px" }}>
                <ActionRow style={{ marginTop: 12 }}>
                  Replicated across {props.viewer.settings.replication} miners.
                </ActionRow>
                <ActionRow>
                  Stored for {props.viewer.settings.dealDuration} filecoin-epochs (
                  {((props.viewer.settings.dealDuration * 30) / 60 / 60 / 24).toFixed(2)} days).
                </ActionRow>
                {props.viewer.settings.verified ? (
                  <ActionRow>This deal is verified.</ActionRow>
                ) : (
                  <ActionRow>This deal is not verified.</ActionRow>
                )}
              </div>

              <div className={styles.actions}>
                <Button
                  loading={state.loading ? state.loading : undefined}
                  style={{ marginRight: 24, marginBottom: 24 }}
                  onClick={async () => {
                    setState({ ...state, loading: true });
                    if (U.isEmpty(state.cid)) {
                      alert("You must provide a CID");
                      return setState({ ...state, loading: false });
                    }

                    const response = await R.post(`/content/add-ipfs`, {
                      name: state.filename,
                      root: state.cid,
                    });
                    console.log(response);
                    if (response && response.error) {
                      alert(response.error);
                      return setState({ success: false, filename: "", cid: "", loading: false });
                    }

                    setState({ ...state, loading: false, filename: "", cid: "", success: true });
                  }}
                >
                  Make Filecoin deals
                </Button>

                <Button
                  style={{
                    marginBottom: 24,
                    background: "var(--main-button-background-secondary)",
                    color: "var(--main-button-text-secondary)",
                  }}
                  href="/upload"
                >
                  Upload manually
                </Button>
              </div>
            </SingleColumnLayout>
          </div>
        ) : (
          <div className={styles.group}>
            <SingleColumnLayout>
              <H2>Success</H2>
              <P style={{ marginTop: 8 }}>
                The content address will now be stored on the Filecoin Network shortly.
              </P>

              <div className={styles.actions}>
                <Button
                  style={{ marginRight: 24, marginBottom: 24 }}
                  onClick={async () => {
                    setState({ ...state, success: false });
                  }}
                >
                  Make another deal
                </Button>

                <Button
                  style={{
                    marginBottom: 24,
                    background: "var(--main-button-background-secondary)",
                    color: "var(--main-button-text-secondary)",
                  }}
                  href="/upload"
                >
                  Upload manually
                </Button>
              </div>
            </SingleColumnLayout>
          </div>
        )}
      </AuthenticatedLayout>
    </Page>
  );
}

export default UploadCIDPage;
