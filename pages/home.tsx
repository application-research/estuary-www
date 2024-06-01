import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import ActionRow from '@components/ActionRow';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import Button from '@components/Button';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import PageHeader from '@components/PageHeader';

import { H2, P } from '@components/Typography';
import FilesTable from '@root/components/FilesTable';
import AlertPanel from '@components/AlertPanel';

const INCREMENT = 1000;

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

  return {
    props: { viewer, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

const getNext = async (state, setState, host) => {
  const offset = state.offset + INCREMENT;
  const limit = state.limit;
  const next = await R.get(`/content/contents?offset=${offset}&limit=${limit}`, host);

  if (!next || !next.length) {
    return;
  }

  setState({
    ...state,
    offset,
    limit,
    files: [...state.files, ...next],
  });
};

function HomePage(props: any) {
  const [state, setState] = React.useState({
    files: null,
    stats: null,
    threshold: null,
    offset: 0,
    limit: INCREMENT,
  });

  React.useEffect(() => {
    const run = async () => {
      const files = await R.get(`/content/contents?offset=${state.offset}&limit=${state.limit}`, props.api);
      const stats = await R.get('/user/stats', props.api);
      const threshold = await R.get('/user/utilization', props.api);

      if (files && !files.error) {
        setState({ ...state, files, stats, threshold });
      }
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar active="FILES" viewer={props.viewer} />;

  return (
    <Page title="Estuary: Home" description="Analytics about Filecoin and your data." url={`${props.hostname}/home`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        {/* <AlertPanel title="Storage deals are experiencing delays">
          Currently Filecoin deals are experiencing delays that are effecting the accuracy of receipts and status reporting. We are waiting for patches in the Lotus implementation
          of Filecoin to be deployed by miners.
        </AlertPanel> */}

        {state.files && !state.files.length ? (
          <PageHeader>
            <H2>Upload public data</H2>
            <P style={{ marginTop: 16 }}>
              Uploading your public data to IPFS and backing it up on Filecoin is easy. <br />
              <br />
              Lets get started!
            </P>

            <div className={styles.actions}>
              <Button href="/upload">Upload your first file</Button>
            </div>
          </PageHeader>
        ) : (
          <PageHeader>
            <H2>Files</H2>
            <P style={{ marginTop: 16 }}>All files and CIDs you upload to Estuary will appear here, along with links to retrieve the content from your preferred gateway.</P>

            <div className={styles.actions}>
              <Button href="/upload">Upload data</Button>
            </div>
          </PageHeader>
        )}

        { state.stats && state.threshold ? (
          <div className={ styles.group }>
            { state.stats.totalSize >= state.threshold.soft_limit_bytes && state.stats.totalSize < state.threshold.hard_limit_bytes ? (
              <AlertPanel title='Soft Limit Threshold Reached'>
                You are currently at { U.formatNumber((state.stats.totalSize / state.threshold.hard_limit_bytes) * 100) }% of
                storage utilization. Once your hard limit threshold is reached
                ({ U.bytesToSize(state.threshold.hard_limit_bytes) }), you will no longer be able to upload files. Please get
                in touch with the Estuary Team if you require additional storage.
              </AlertPanel>
            ) : null }
            { state.stats.totalSize >= state.threshold.hard_limit_bytes ? (
              <AlertPanel title='Hard Limit Threshold Reached'>
                You have reached your hard limit threshold { U.bytesToSize(state.threshold.hard_limit_bytes) }. Please get in touch
                with the Estuary Team if you require additional storage. You can find us in the Filecoin slack under the
                #ecosystem-dev channel.
              </AlertPanel>
            ) : null }
          </div>
        ) : null }

        {state.stats ? (
          <div className={styles.group}>
            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Total size bytes</th>
                  <th className={tstyles.th}>Total size</th>
                  <th className={tstyles.th}>Total number of pins</th>
                </tr>
                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{U.formatNumber(state.stats.totalSize)}</td>
                  <td className={tstyles.td}>{U.bytesToSize(state.stats.totalSize)}</td>
                  <td className={tstyles.td}>{U.formatNumber(state.stats.numPins)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}

        <div className={styles.group}>
          {state.files && state.files.length ? <FilesTable files={state.files} /> : null}

          {state.files && state.offset + state.limit === state.files.length ? (
            <ActionRow style={{ paddingLeft: 16, paddingRight: 16 }} onClick={() => getNext(state, setState, props.api)}>
              ➝ Next {INCREMENT}
            </ActionRow>
          ) : null}
        </div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default HomePage;
