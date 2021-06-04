import styles from "@components/UploadFileContainer.module.scss";

import * as React from "react";
import * as U from "@common/utilities";
import * as C from "@common/constants";
import * as R from "@common/requests";

import LoaderSpinner from "@components/LoaderSpinner";
import Button from "@components/Button";
import ActionRow from "@components/ActionRow";
import Cookies from "js-cookie";

export default class UploadFileContainer extends React.Component {
  state = {
    mode: 1,
    data: null,
  };

  dropRef = React.createRef();

  componentDidMount() {
    let ref = this.dropRef.current;

    ref.addEventListener("dragenter", this.handleDragIn);
    ref.addEventListener("dragleave", this.handleDragOut);
    ref.addEventListener("dragover", this.handleDrag);
    ref.addEventListener("drop", this.handleDrop);
  }

  doFileUpload = async (file, filename) => {
    this.setState({ mode: 4, staging: false });

    if (file.size < this.props.viewer.settings.fileStagingThreshold) {
      this.setState({ data: { file, filename, estimate: 0, price: 0 }, mode: 4, staging: true });
      await U.delay(1000);
      return await this.upload();
    }

    const response = await R.post("/deals/estimate", {
      size: file.size,
      replication: this.props.viewer.settings.replication,
      durationBlks: this.props.viewer.settings.dealDuration,
      verified: this.props.viewer.settings.verified,
    });

    const local = await fetch("/api/fil-usd");
    const { price } = await local.json();

    const estimate = response && response.totalAttoFil ? response.totalAttoFil : null;

    this.setState({
      data: {
        file,
        filename,
        estimate,
        price,
      },
      mode: 2,
    });
  };

  upload = async () => {
    if (!this.state.data) {
      alert("No data provided");
      return;
    }

    const formData = new FormData();

    formData.append("data", this.state.data.file, this.state.data.filename);

    console.log(formData);

    this.setState({ mode: 4 });
    this.props.onUploadFile({ staging: this.state.staging });

    // TODO(jim):
    // We really don't need to be making this requests from the client
    const token = Cookies.get(C.auth);

    let xhr = new XMLHttpRequest();
    let startTime = null;
    let secondsElapsed = 0;

    xhr.upload.onprogress = async (event) => {
      if (!startTime) {
        startTime = new Date().getTime();
      }

      secondsElapsed = (new Date().getTime() - startTime) / 1000;
      let bytesPerSecond = event.loaded / secondsElapsed;
      let secondsRemaining = (event.total - event.loaded) / bytesPerSecond;

      this.props.onProgress({
        loaded: event.loaded,
        total: event.total,
        secondsElapsed,
        bytesPerSecond,
        secondsRemaining,
      });
    };

    xhr.upload.onload = async () => {
      this.setState({ mode: 1 });
      startTime = null;
      secondsElapsed = 0;
    };

    xhr.upload.onerror = async () => {
      alert(`Error during the upload: ${xhr.status}`);
      this.setState({ mode: 1 });
      startTime = null;
      secondsElapsed = 0;
    };

    xhr.onloadend = (event) => {
      console.log(event);
      if (event.target && event.target.status === 200 && event.target.response) {
        let json = {};
        try {
          json = JSON.parse(event.target.response);
        } catch (e) {
          console.log(e);
        }
        startTime = null;
        secondsElapsed = 0;
        this.props.onUploadFinished(json);
      }
    };

    xhr.open("POST", `${C.api.host}/content/add`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  };

  handleSelectFile = (e) => {
    e.persist();
    console.log("select file: ", e.target);
    if (e.target.files.length == 0) {
      return;
    }
    const file = e.target.files[0];
    const filename = e.target.files[0].name;

    this.doFileUpload(file, filename);
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("dropped a thing: ", e.dataTransfer.files);

    if (this.state.mode !== 3) {
      return;
    }

    if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) {
      return;
    }

    if (e.dataTransfer.files.length > 1) {
      alert("You can only upload one file at a time.");
      return;
    }

    const file = e.dataTransfer.files[0];

    this.setState({ loading: true });

    this.doFileUpload(file, file.name);
  };

  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClearState({ staging: false, cid: null });
    this.setState({ mode: 3 });
  };

  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClearState({ staging: false, cid: null });
    this.setState({ mode: 3 });
  };

  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ mode: 1 });
  };

  render() {
    const backgrounds = {
      2: "#fff",
      3: "var(--main-text)",
      4: "var(--main-text)",
    };

    const colors = {
      2: "#000",
      3: "#fff",
      4: "#fff",
    };

    const statusText = {
      1: "Ready",
      3: "Ready for file drop",
      4: "Processing data",
    };

    const style = {
      background: backgrounds[this.state.mode],
      color: colors[this.state.mode],
    };

    const showLoader = this.state.mode === 4 || this.props.uploadFinished;
    let status = statusText[this.state.mode];
    if (this.props.uploadFinished) {
      status = "Upload finished, now processing";
    }

    let cta = (
      <div className={styles.actions}>
        <Button
          htmlFor="FILE_UPLOAD_TARGET"
          type="file"
          style={{ marginRight: 24, marginBottom: 24 }}
        >
          Upload a file
        </Button>

        <Button
          style={{
            marginBottom: 24,
            background: "var(--main-button-background-secondary)",
            color: "var(--main-button-text-secondary)",
          }}
          href="/upload-cid"
        >
          Use a CID instead
        </Button>
      </div>
    );

    if (showLoader || this.state.mode === 4 || this.state.mode === 3) {
      cta = null;
    }

    if (this.state.mode === 2) {
      cta = (
        <div className={styles.actions}>
          <Button onClick={this.upload}>Make storage deal</Button>

          <Button
            style={{
              marginLeft: 24,
              background: "var(--main-button-background-secondary)",
              color: "var(--main-button-text-secondary)",
            }}
            onClick={() => {
              this.setState({ data: null, mode: 1 });
            }}
          >
            Cancel
          </Button>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div ref={this.dropRef} className={styles.drop} style={style}>
          {this.state.mode !== 2 ? (
            <React.Fragment>
              <div className={styles.top}>
                {showLoader ? (
                  <LoaderSpinner
                    style={{
                      height: 48,
                      width: 48,
                    }}
                  />
                ) : (
                  "Waiting for your file..."
                )}
              </div>
              <div className={styles.bottom}>
                <div className={styles.bottomLeft}>{status}</div>
                <div className={styles.bottomRight}>...</div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className={styles.top}>{this.state.data.filename}</div>
              <div className={styles.bottom}>
                <div className={styles.bottomLeft}>Ready to upload</div>
                <div className={styles.bottomRight}>{this.state.data.file.type}</div>
              </div>
            </React.Fragment>
          )}
        </div>

        {this.state.mode === 2 ? (
          <React.Fragment>
            {this.state.data.estimate ? (
              <ActionRow>
                Will cost {U.convertFIL(this.state.data.estimate)} FIL ⇄{" "}
                {(
                  Number(U.convertFIL(this.state.data.estimate)) * Number(this.state.data.price)
                ).toFixed(2)}{" "}
                USD
              </ActionRow>
            ) : null}
            <ActionRow>{U.bytesToSize(this.state.data.file.size)}</ActionRow>
            <ActionRow>
              Replicated across {this.props.viewer.settings.replication} miners.
            </ActionRow>
            <ActionRow>
              Stored for {this.props.viewer.settings.dealDuration} filecoin-epochs (
              {((this.props.viewer.settings.dealDuration * 30) / 60 / 60 / 24).toFixed(2)} days).
            </ActionRow>
            {this.props.viewer.settings.verified ? (
              <ActionRow>This deal is verified.</ActionRow>
            ) : (
              <ActionRow>This deal is not verified.</ActionRow>
            )}
          </React.Fragment>
        ) : null}

        {this.props.children}

        {cta}

        <input
          className={styles.invisible}
          onChange={this.handleSelectFile}
          type="file"
          id="FILE_UPLOAD_TARGET"
        />
      </React.Fragment>
    );
  }
}
