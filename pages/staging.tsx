import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import Button from '@components/Button';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import PageHeader from '@components/PageHeader';

import { H2, H3, P } from '@components/Typography';
import StagingZoneReadinessTable from '@root/components/StagingZoneReadinessTable';

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
    props: { viewer, api: process.env.ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function StagingPage(props) {
  const [state, setState] = React.useState({ files: [] });

  React.useEffect(() => {
    const run = async () => {
      const files = await R.get('/content/staging-zones', props.api);
      console.log(files);

      if (!files || files.error) {
        return;
      }

      setState({ files });
    };

    run();
  }, []);

  console.log(props.viewer);

  const sidebarElement = <AuthenticatedSidebar active="STAGING" viewer={props.viewer} />;

  return (
    <Page title="Estuary: Staging" description="Data before a Filecoin deal is made" url={`${props.hostname}/staging`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <PageHeader>
          <H2>Staging zone</H2>
          <P style={{ marginTop: 16 }}>
            When you upload data under the size of {U.bytesToSize(props.viewer.settings.fileStagingThreshold)}, the data will be staged here. After a few hours a storage deal will
            be made.
          </P>

          <div className={styles.actions}>
            <Button href="/upload">Upload data</Button>
          </div>
        </PageHeader>

        {state.files.map((bucket, index) => (
          <div key={`ephemeral-staging-bucket-${index}`} style={{ marginBottom: 64 }}>
            <PageHeader>
              <H3>ephemeral-staging-bucket-{index}</H3>
            </PageHeader>

            <div className={styles.group}>
              <table className={tstyles.table}>
                <tbody className={tstyles.tbody}>
                  <tr className={tstyles.tr}>
                    <th className={tstyles.th}>Created at</th>
                    <th className={tstyles.th}>Items</th>
                    <th className={tstyles.th}>Size</th>
                    <th className={tstyles.th}>Accepted size range</th>
                  </tr>
                  <tr className={tstyles.tr}>
                    <td className={tstyles.td}>{U.toDate(bucket.zoneOpened)}</td>
                    <td className={tstyles.td}>{bucket.contents.length}</td>
                    <td className={tstyles.td}>{U.bytesToSize(bucket.curSize)}</td>
                    <td className={tstyles.td}>
                      {U.bytesToSize(bucket.minSize)} - {U.bytesToSize(bucket.maxSize)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <StagingZoneReadinessTable readiness={bucket.readiness} />
            </div>

            {bucket.contents && bucket.contents.length ? (
              <div className={styles.group}>
                <table className={tstyles.table}>
                  <tbody className={tstyles.tbody}>
                    <tr className={tstyles.tr}>
                      <th className={tstyles.th} style={{ width: '88px' }}>
                        Local ID
                      </th>

                      <th className={tstyles.th} style={{ width: '30%' }}>
                        Name
                      </th>
                      <th className={tstyles.th}>Estuary retrieval url</th>
                      <th className={tstyles.th}>Dweb retrieval url</th>
                      <th className={tstyles.th} style={{ width: '104px' }}>
                        Size
                      </th>
                      <th className={tstyles.th} style={{ width: '120px' }}>
                        User ID
                      </th>
                    </tr>

                    {bucket.contents.map((data, index) => {
                      const estuaryRetrievalUrl = U.formatEstuaryRetrievalUrl(data.cid);
                      const dwebRetrievalUrl = U.formatDwebRetrievalUrl(data.cid);
                      return (
                        <tr key={`${data.cid['/']}-${data.id}`} className={tstyles.tr}>
                          <td className={tstyles.td} style={{ fontSize: 12, fontFamily: 'Mono', opacity: 0.4 }}>
                            {String(data.id).padStart(9, '0')}
                          </td>
                          <td className={tstyles.td}>{data.name}</td>
                          <td className={tstyles.tdcta}>
                            <a href={estuaryRetrievalUrl} target="_blank" className={tstyles.cta}>
                              {estuaryRetrievalUrl}
                            </a>
                          </td>
                          <td className={tstyles.tdcta}>
                            <a className={tstyles.cta} href={dwebRetrievalUrl} target="_blank">
                              {dwebRetrievalUrl}
                            </a>
                          </td>
                          <td className={tstyles.td}>{U.bytesToSize(data.size)}</td>
                          <td className={tstyles.td}>{data.userId}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        ))}
      </AuthenticatedLayout>
    </Page>
  );
}

export default StagingPage;
