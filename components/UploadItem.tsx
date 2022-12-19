import styles from '@components/UploadItem.module.scss';

import * as C from '@common/constants';
import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import ActionRow from '@components/ActionRow';
import LoaderSpinner from '@components/LoaderSpinner';
import ProgressBlock from '@components/ProgressBlock';
import Cookies from 'js-cookie';
import Link from 'next/link';

export class PinStatusElement extends React.Component<any> {
  state = { pinned: false, delegates: ['none'] };

  componentDidMount() {
    const checkPinStatus = () => {
      window.setTimeout(async () => {
        const response = await R.get(`/pinning/pins/${this.props.id}`, this.props.host);
        console.log(response);

        if (response.status === 'pinned') {
          console.log('stop loop');
          this.setState({ pinned: true, ...response });
          this.forceUpdate();
          return;
        }

        checkPinStatus();
      }, 5000);
    };

    checkPinStatus();
  }

  render() {
    if (this.state.pinned) {
      return (
        <React.Fragment>
          <ActionRow>This CID is pinned.</ActionRow>
          <ActionRow>Delegate {this.state.delegates && this.state.delegates.length > 0 ? this.state.delegates[0] : ""}</ActionRow>
        </React.Fragment>
      );
    }

    return (
      <ActionRow style={{ background: `#000`, color: `#fff` }}>
        This CID is now being pinned to IPFS in the background, it make take a few minutes. <LoaderSpinner style={{ marginLeft: 8, height: 10, width: 10 }} />
      </ActionRow>
    );
  }
}

export default class UploadItem extends React.Component<any> {
  state = {
    loaded: 0,
    total: this.props.file.data.size,
    secondsRemaining: 0,
    secondsElapsed: 0,
    bytesPerSecond: 0,
    staging: !this.props.file.estimation,
    final: null,
  };

  upload = async () => {
    if (this.state.loaded > 0) {
      console.log('already attempted', this.props.file.id);
      return;
    }

    if (!this.props.file) {
      alert('Broken file constructor.');
      return;
    }

    if (!this.props.file.data) {
      alert('Broken data file constructor.');
      return;
    }

    const formData = new FormData();

    const { data } = this.props.file;

    formData.append('data', data, data.filename);
    // TODO(jim):
    // We really don't need to be making this requests from the client
    const token = Cookies.get(C.auth);

    let xhr = new XMLHttpRequest();
    let startTime = new Date().getTime();
    let secondsElapsed = 0;

    xhr.upload.onprogress = async (event) => {
      if (!startTime) {
        startTime = new Date().getTime();
      }

      secondsElapsed = (new Date().getTime() - startTime) / 1000;
      let bytesPerSecond = event.loaded / secondsElapsed;
      let secondsRemaining = (event.total - event.loaded) / bytesPerSecond;

      this.setState({
        ...this.state,
        loaded: event.loaded,
        total: event.total,
        secondsElapsed,
        bytesPerSecond,
        secondsRemaining,
      });
    };

    xhr.upload.onerror = async () => {
      alert(`Error during the upload: ${xhr.status}`);
      startTime = null;
      secondsElapsed = 0;
    };

    xhr.onloadend = (event: any) => {
      if (!event.target || !event.target.response) {
        return;
      }

      startTime = null;
      secondsElapsed = 0;
      if (event.target.status === 200) {
        let json = {};
        try {
          json = JSON.parse(event.target.response);
        } catch (e) {
          console.log(e);
        }
        this.setState({ ...this.state, final: json });
      } else {
        alert(`[${event.target.status}]Error during the upload: ${event.target.response}`);
      }
    };

    let targetURL = `${C.api.host}/content/add`;
    if (this.props.viewer.settings.uploadEndpoints && this.props.viewer.settings.uploadEndpoints.length) {
      targetURL = this.props.viewer.settings.uploadEndpoints[0];
    }

    xhr.open('POST', targetURL);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
    this.setState({ ...this.state, loaded: 1 });
  };

  render() {
    const isLoading = !this.state.final && this.state.loaded > 0;

    let targetURL = `${C.api.host}/content/add`;
    if (this.props.viewer.settings.uploadEndpoints && this.props.viewer.settings.uploadEndpoints.length) {
      targetURL = this.props.viewer.settings.uploadEndpoints[0];
    }

    // TODO(jim)
    // States getting messy here, need to refactor this component.
    // Not sure if this will be an ongoing problem of tracking pin status.
    let maybePinStatusElement = null;
    if (this.state.final) {
      maybePinStatusElement = <PinStatusElement id={this.state.final.estuaryId} host={this.props.host} />;
    }

    const estuaryRetrievalUrl = this.state.final ? U.formatEstuaryRetrievalUrl(this.state.final.cid) : null;
    const dwebRetrievalUrl = this.state.final ? U.formatDwebRetrievalUrl(this.state.final.cid) : null;

    return (
      <section className={styles.item}>
        {this.state.final ? (
          <React.Fragment>
            <ActionRow isHeading style={{ fontSize: '0.9rem', fontWeight: 500, background: `var(--status-success-bright)` }}>
              {this.props.file.data.name} uploaded to our node!
            </ActionRow>
            <ActionRow>
              <Link href={estuaryRetrievalUrl} target="_blank">
                {estuaryRetrievalUrl}
              </Link>
            </ActionRow>
            <ActionRow>
              <Link href={dwebRetrievalUrl} target="_blank">
                {dwebRetrievalUrl}
              </Link>
            </ActionRow>
            {maybePinStatusElement}
            {this.props.file.estimation ? (
              <ActionRow style={{ background: `var(--status-success-bright)` }}>Filecoin Deals are being mmade for {this.props.file.data.name}.</ActionRow>
            ) : (
              <ActionRow>{this.props.file.data.name} was added to a staging bucket for a batched Filecoin deal.</ActionRow>
            )}
            {this.props.file.estimation ? (
              <ActionRow onClick={() => window.open('/deals')}>→ See all Filecoin deals.</ActionRow>
            ) : (
              <ActionRow onClick={() => window.open('/staging')}>→ View all staging bucket data.</ActionRow>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className={styles.actions}>
              <div className={styles.left}>
                <ActionRow isHeading style={{ fontSize: '0.9rem', fontWeight: 500, background: isLoading ? `#000` : null, color: isLoading ? `#fff` : null }}>
                  {this.props.file.data.name} {isLoading ? <LoaderSpinner style={{ marginLeft: 8, height: 10, width: 10 }} /> : null}
                </ActionRow>
              </div>
              {!isLoading ? (
                <div className={styles.right}>
                  {this.state.final ? null : (
                    <span className={styles.button} onClick={this.upload}>
                      {this.props.file.estimination ? `Upload` : `Upload`}
                    </span>
                  )}
                  {!this.state.final ? (
                    <span className={styles.button} onClick={() => this.props.onRemove(this.props.file.id)}>
                      Remove
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
            {!isLoading ? (
              <React.Fragment>
                <ActionRow>{U.bytesToSize(this.props.file.data.size)}</ActionRow>
                {this.props.file.estimation ? (
                  <ActionRow>
                    Will cost {U.convertFIL(this.props.file.estimation)} FIL ⇄ {(Number(U.convertFIL(this.props.file.estimation)) * Number(this.props.file.price)).toFixed(2)} USD
                    and this Estuary Node will pay.
                  </ActionRow>
                ) : (
                  <ActionRow>{this.props.file.data.name} will be added to staging bucket for a batched deal later.</ActionRow>
                )}

                {this.props.file.estimation && this.props.viewer.settings.verified ? <ActionRow>The Filecoin deal will be verified.</ActionRow> : null}
              </React.Fragment>
            ) : null}
            <ActionRow style={{ background: isLoading ? `#000` : null, color: isLoading ? `#fff` : null }}>Data will be sent to {targetURL}</ActionRow>
          </React.Fragment>
        )}

        {isLoading ? (
          <ProgressBlock secondsRemaining={this.state.secondsRemaining} bytesPerSecond={this.state.bytesPerSecond} loaded={this.state.loaded} total={this.state.total} />
        ) : null}
      </section>
    );
  }
}
