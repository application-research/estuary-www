import * as R from '@common/requests';
import * as U from '@common/utilities';
import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';
import * as React from 'react';

import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import PageHeader from '@components/PageHeader';

import { H2, P } from '@components/Typography';
import ActionRow from '@root/components/ActionRow';
import FilesTable from '@root/components/FilesTable';

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
    props: { viewer, ...context.params, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function StagingZonePage(props) {
  const getNext = async (state, setState) => {
    const offset = state.offset + INCREMENT;
    const limit = state.limit;
    const next = await R.get(`/content/staging-zones/${props.id}/contents?offset=${offset}&limit=${limit}`, props.api);

    if (!next || !next.length) {
      return;
    }

    setState({
      ...state,
      offset: offset,
      limit: limit,
      contents: [...state.contents, ...next],
    });
  };

  const [state, setState] = React.useState({
    contentID: null,
    zoneOpened: null,
    minSize: null,
    maxSize: null,
    curSize: null,
    contents: [],
    limit: INCREMENT,
    offset: 0,
  });

  React.useEffect(() => {
    const run = async () => {
      const zone = await R.get(`/content/staging-zones/${props.id}`, props.api);
      delete zone.contents; // remove omitted key to avoid accidentally emptying contents state
      const contents = await R.get(`/content/staging-zones/${props.id}/contents?offset=${state.offset}&limit=${state.limit}`, props.api);

      if (!zone || zone.error || !contents || contents.error) {
        return;
      }

      setState({ ...state, ...zone, contents: contents });
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar active="STAGING" viewer={props.viewer} />;
  return (
    <Page title="Estuary: Staging" description="Data before a Filecoin deal is made" url={`${props.hostname}/staging`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <PageHeader>
          <H2>Staging zone</H2>
          <P style={{ marginTop: 16 }}>
            When you upload data under the size of {U.bytesToSize(props.viewer.settings.fileStagingThreshold)}, the data will be staged here. After the total size of staged data
            reaches this size, a storage deal will be made within a few minutes.
          </P>
        </PageHeader>

        <div className={styles.group}>
          <table className={tstyles.table}>
            <tbody className={tstyles.tbody}>
              <tr className={tstyles.tr}>
                <th className={tstyles.th}>Zone ID</th>
                <th className={tstyles.th}>Created at</th>
                <th className={tstyles.th}>Size</th>
                <th className={tstyles.th}>Accepted size range</th>
              </tr>
              <tr className={tstyles.tr}>
                <td className={tstyles.td}>{state.contentID}</td>
                <td className={tstyles.td}>{U.toDate(state.zoneOpened)}</td>
                <td className={tstyles.td}>{U.bytesToSize(state.curSize)}</td>
                <td className={tstyles.td}>
                  {U.bytesToSize(state.minSize)} - {U.bytesToSize(state.maxSize)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.group}>
          <FilesTable files={state.contents} />

          {state.contents && state.offset + state.limit === state.contents.length ? (
            <ActionRow style={{ paddingLeft: 16, paddingRight: 16 }} onClick={() => getNext(state, setState)}>
              ➝ Next {INCREMENT}
            </ActionRow>
          ) : null}
        </div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default StagingZonePage;
