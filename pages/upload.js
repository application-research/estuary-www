import styles from "~/pages/app.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";
import * as R from "~/common/requests";

import Cookies from "js-cookie";
import Page from "~/components/Page";
import Navigation from "~/components/Navigation";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";
import SingleColumnLayout from "~/components/SingleColumnLayout";
import UploadFileContainer from "~/components/UploadFileContainer";
import ProgressBlock from "~/components/ProgressBlock";
import Block from "~/components/Block";
import ActionRow from "~/components/ActionRow";

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

export default class UploadPage extends React.Component {
  state = {};

  async componentDidMount() {
    // Estimates are returning 500.
    // const response = await R.get("/deals/estimate");
    // console.log(response);
  }

  _handleUploadFile = () => {
    this.setState({
      loaded: 0,
      total: 0,
      cid: "",
      secondsElapsed: 0,
      bytesPerSecond: 0,
      secondsRemaining: 0,
    });
  };

  _handleProgress = (response) => {
    console.log(`Uploaded ${response.loaded} of ${response.total} bytes`);
    this.setState({
      loaded: response.loaded,
      total: response.total,
      secondsElapsed: response.secondsElapsed,
      bytesPerSecond: response.bytesPerSecond,
      secondsRemaining: response.secondsRemaining,
    });
  };

  _handleUploadFinished = ({ cid }) => {
    console.log("Upload finished.", cid);

    // NOTE(jim): You must reset all of the state, some state depends on it.
    this.setState({
      loaded: 0,
      total: 0,
      cid,
      secondsElapsed: 0,
      bytesPerSecond: 0,
      secondsRemaining: 0,
    });
  };

  render() {
    console.log(this.props.viewer);

    return (
      <Page
        title="Estuary: Upload data"
        description="Upload your data to the Filecoin Network."
        url="https://estuary.tech/upload"
      >
        <AuthenticatedLayout
          navigation={<Navigation isAuthenticated />}
          sidebar={<AuthenticatedSidebar viewer={this.props.viewer} />}
        >
          <SingleColumnLayout>
            <H2>Upload data</H2>
            <P style={{ marginTop: 8 }}>
              Add your public data to Estuary so anyone can retrieve it anytime.
            </P>

            <UploadFileContainer
              onProgress={this._handleProgress}
              onUploadFinished={this._handleUploadFinished}
              onUploadFile={this._handleUploadFile}
              uploadFinished={this.state.loaded > 0 && this.state.loaded === this.state.total}
              viewer={this.props.viewer}
            >
              {this.state.total ? (
                <ProgressBlock
                  style={{ marginTop: 2 }}
                  loaded={this.state.loaded}
                  total={this.state.total}
                  secondsRemaining={this.state.secondsRemaining}
                  secondsElapsed={this.state.secondsElapsed}
                  bytesPerSecond={this.state.bytesPerSecond}
                />
              ) : null}
            </UploadFileContainer>

            {!U.isEmpty(this.state.cid) ? (
              <React.Fragment>
                <H2 style={{ marginTop: 48 }}>Success</H2>
                <P style={{ marginTop: 8 }}>
                  Your data has been uploaded. Estuary will now make Filecoin Storage Deals on your
                  behalf to ensure proper storage.
                </P>

                <Block
                  style={{ marginTop: 24 }}
                  label="Your retrieval URL"
                  custom="➝ Go see Filecoin storage miner status."
                  onCustomClick={() => {
                    window.location.href = "/deals";
                  }}
                >
                  https://dweb.link/ipfs/{this.state.cid}
                </Block>

                <ActionRow>You can retrieve your data in a few minutes.</ActionRow>
              </React.Fragment>
            ) : null}
          </SingleColumnLayout>
        </AuthenticatedLayout>
      </Page>
    );
  }
}
