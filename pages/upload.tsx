import styles from '@pages/app.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import Button from '@components/Button';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import SingleColumnLayout from '@components/SingleColumnLayout';
import UploadList from '@components/UploadList';
import UploadZone from '@components/UploadZone';

import { H2, H3, P } from '@components/Typography';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  if (!viewer) {
    return {
      redirect: {
        permanent: false,
        destination: '/sign-in',
      },
    };
  }

  if (viewer.settings && viewer.settings.contentAddingDisabled) {
    return {
      redirect: {
        permanent: false,
        destination: '/upload-disabled',
      },
    };
  }

  return {
    props: { viewer, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

export default class UploadPage extends React.Component<any> {
  list = React.createRef<any>();

  state = {
    files: [],
  };

  _handleUpload = () => {
    return this.list.current.uploadAll();
  };

  _handleRemove = (id) => {
    this.setState({ files: this.state.files.filter((each) => each.id !== id) });
  };

  _handleFlush = () => {
    this.setState({ files: [] });
  };

  _handleFile = async (file) => {
    if (!file) {
      console.log('MISSING DATA');
      return;
    }

    // NOTE(jim): Prevents small files from being made directly into deals.
    if (file.size < this.props.viewer.settings.fileStagingThreshold) {
      return this.setState({
        files: [{ id: `file-${new Date().getTime()}`, data: file, estimation: null, price: null }, ...this.state.files],
      });
    }

    const response = await R.post(
      '/deals/estimate',
      {
        size: file.size,
        replication: this.props.viewer.settings.replication,
        durationBlks: this.props.viewer.settings.dealDuration,
        verified: this.props.viewer.settings.verified,
      },
      this.props.api
    );

    const local = await fetch('/api/fil-usd');
    const { price } = await local.json();

    const estimate = response && response.totalAttoFil ? response.totalAttoFil : null;

    return this.setState({
      files: [{ id: `file-${new Date().getTime()}`, data: file, estimation: estimate, price }, ...this.state.files],
    });
  };

  render() {
    console.log(this.state.files);
    const sidebarElement = <AuthenticatedSidebar active="UPLOAD" viewer={this.props.viewer} />;

    return (
      <Page title="Estuary: Upload data" description="Upload your data to the Filecoin Network." url={`${this.props.hostname}/upload`}>
        <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
          <SingleColumnLayout>
            <H2>Upload data</H2>
            <P style={{ marginTop: 16 }}>Add your public data to Estuary so anyone can retrieve it anytime.</P>
            <UploadZone onFile={this._handleFile} onFlush={this._handleFlush} host={this.props.api} />

            {this.state.files.length ? (
              <React.Fragment>
                <H3 style={{ marginTop: 64 }}>
                  Queued {U.pluralize('file', this.state.files.length)} {`(${this.state.files.length})`}
                </H3>
                <P style={{ marginTop: 16 }}>Our Estuary node is ready to accept your data, click upload all to upload everything or click upload to upload individual files.</P>

                <div className={styles.actions}>
                  <Button style={{ marginRight: 24, marginBottom: 24 }} onClick={this._handleUpload}>
                    Upload all
                  </Button>

                  <Button
                    style={{
                      marginBottom: 24,
                      background: 'var(--main-button-background-secondary)',
                      color: 'var(--main-button-text-secondary)',
                    }}
                    onClick={this._handleFlush}
                  >
                    Clear list
                  </Button>
                </div>

                <UploadList ref={this.list} files={this.state.files} viewer={this.props.viewer} onRemove={this._handleRemove} host={this.props.api} />
              </React.Fragment>
            ) : null}
          </SingleColumnLayout>
        </AuthenticatedLayout>
      </Page>
    );
  }
}
