import styles from '@pages/app.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import ActionRow from '@components/ActionRow';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import Button from '@components/Button';
import Input from '@components/Input';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import SingleColumnLayout from '@components/SingleColumnLayout';

import { H2, H4, P } from '@components/Typography';

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
    props: { viewer, api: process.env.ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function UploadCIDPage(props: any) {
  const [state, setState] = React.useState({
    success: false,
    loading: false,
    filename: '',
    cid: '',
  });

  const sidebarElement = <AuthenticatedSidebar active="UPLOAD_CID" viewer={props.viewer} />;
  const estuaryRetrievalUrl = !U.isEmpty(state.cid) ? U.formatEstuaryRetrievalUrl(state.cid) : null;
  const dwebRetrievalUrl = !U.isEmpty(state.cid) ? U.formatDwebRetrievalUrl(state.cid) : null;

  return (
    <Page title="Estuary: Upload: CID" description="Use an existing IPFS CID to make storage deals." url={`${props.hostname}/upload-cid`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        {!state.success ? (
          <SingleColumnLayout>
            <H2>Upload CID</H2>
            <P style={{ marginTop: 16 }}>
              Use an existing IPFS content address to make Filecoin storage deals. If you use any CID under {U.bytesToSize(props.viewer.settings.fileStagingThreshold)}, we will
              aggregate your files into a single deal.
            </P>

            <H4 style={{ marginTop: 32 }}>CID</H4>
            <Input
              style={{ marginTop: 8 }}
              placeholder="Type or paste your CID"
              value={state.cid}
              name="cid"
              onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
            />
            {U.isEmpty(state.cid) ? null : (
              <aside className={styles.formAside}>
                Check your CID
                <div>
                  <H4>Estuary retrieval url</H4>
                  <a href={estuaryRetrievalUrl} target="_blank">
                    {estuaryRetrievalUrl}
                  </a>
                </div>
                <div>
                  <H4>Dweb retrieval url</H4>
                  <a href={dwebRetrievalUrl} target="_blank">
                    {dwebRetrievalUrl}
                  </a>
                </div>
              </aside>
            )}

            <H4 style={{ marginTop: 24 }}>New filename (optional)</H4>
            <Input
              style={{ marginTop: 8 }}
              placeholder="Type in a new filename"
              value={state.filename}
              name="filename"
              onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
              onSubmit={async () => {
                setState({ ...state, loading: true });

                if (U.isEmpty(state.cid)) {
                  alert('You must provide a CID');
                  return setState({ ...state, loading: false });
                }

                const response = await R.post(
                  `/content/add-ipfs`,
                  {
                    filename: state.filename,
                    root: state.cid,
                  },
                  props.api
                );
                console.log(response);
                if (response && response.error) {
                  alert(response.error);
                  return setState({ success: false, filename: '', cid: '', loading: false });
                }
                setState({ ...state, loading: false, filename: '', cid: '', success: true });
              }}
            />

            <H4 style={{ marginTop: 24 }}>Default deal settings</H4>
            <div style={{ maxWidth: '568px' }}>
              <ActionRow style={{ marginTop: 12 }}>Replicated across {props.viewer.settings.replication} storage providers.</ActionRow>
              <ActionRow>
                Stored for {props.viewer.settings.dealDuration} filecoin-epochs ({((props.viewer.settings.dealDuration * 30) / 60 / 60 / 24).toFixed(2)} days).
              </ActionRow>
              {props.viewer.settings.verified ? <ActionRow>This deal is verified.</ActionRow> : <ActionRow>This deal is not verified.</ActionRow>}
            </div>

            <div className={styles.actions}>
              <Button
                loading={state.loading ? state.loading : undefined}
                style={{ marginRight: 24, marginBottom: 24 }}
                onClick={async () => {
                  setState({ ...state, loading: true });
                  if (U.isEmpty(state.cid)) {
                    alert('You must provide a CID');
                    return setState({ ...state, loading: false });
                  }

                  const response = await R.post(
                    `/content/add-ipfs`,
                    {
                      name: state.filename,
                      root: state.cid,
                    },
                    props.api
                  );
                  console.log(response);
                  if (response && response.error) {
                    alert(response.error);
                    return setState({ success: false, filename: '', cid: '', loading: false });
                  }

                  setState({ ...state, loading: false, filename: '', cid: '', success: true });
                }}
              >
                Make Filecoin deal
              </Button>

              <Button
                style={{
                  marginBottom: 24,
                  background: 'var(--main-button-background-secondary)',
                  color: 'var(--main-button-text-secondary)',
                }}
                href="/upload"
              >
                Upload manually
              </Button>
            </div>
          </SingleColumnLayout>
        ) : (
          <SingleColumnLayout>
            <H2>Success</H2>
            <P style={{ marginTop: 16 }}>The content address will now be stored on the Filecoin Network shortly.</P>

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
                  background: 'var(--main-button-background-secondary)',
                  color: 'var(--main-button-text-secondary)',
                }}
                href="/upload"
              >
                Upload manually
              </Button>
            </div>
          </SingleColumnLayout>
        )}
      </AuthenticatedLayout>
    </Page>
  );
}

export default UploadCIDPage;
