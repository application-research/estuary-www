import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import ProgressCard from '@components/ProgressCard';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import PageHeader from '@components/PageHeader';
import Button from '@components/Button';

import { H1, H2, H3, H4, P } from '@components/Typography';

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
    props: { viewer, api: process.env.ESTUARY_API, site: `https://${context.req.headers.host}` },
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
    <Page title="Estuary: Staging" description="Data before a Filecoin deal is made" url={`${props.site}/staging`}>
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
                    <th className={tstyles.th}>Opening</th>
                    <th className={tstyles.th}>Closing</th>
                  </tr>
                  <tr className={tstyles.tr}>
                    <td className={tstyles.td}>{U.toDate(bucket.zoneOpened)}</td>
                    <td className={tstyles.td}>{U.toDate(bucket.closeTime)}</td>
                  </tr>
                </tbody>
              </table>
              <table className={tstyles.table}>
                <tbody className={tstyles.tbody}>
                  <tr className={tstyles.tr}>
                    <th className={tstyles.th}>Size</th>
                    <th className={tstyles.th}>Max Size</th>
                    <th className={tstyles.th}>Min size</th>
                    <th className={tstyles.th}>Max items</th>
                  </tr>
                  <tr className={tstyles.tr}>
                    <td className={tstyles.td}>{U.formatNumber(bucket.curSize)}</td>
                    <td className={tstyles.td}>{U.bytesToSize(bucket.maxSize)}</td>
                    <td className={tstyles.td}>{U.bytesToSize(bucket.minSize)}</td>
                    <td className={tstyles.td}>{U.formatNumber(bucket.maxItems)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {bucket.contents && bucket.contents.length ? (
              <div className={styles.group}>
                <table className={tstyles.table}>
                  <tbody className={tstyles.tbody}>
                    <tr className={tstyles.tr}>
                      <th className={tstyles.th} style={{ width: '80px' }}>
                        #
                      </th>

                      <th className={tstyles.th} style={{ width: '30%' }}>
                        Name
                      </th>
                      <th className={tstyles.th}>Retrieval link</th>
                      <th className={tstyles.th} style={{ width: '104px' }}>
                        Size
                      </th>
                      <th className={tstyles.th} style={{ width: '120px' }}>
                        User ID
                      </th>
                    </tr>

                    {bucket.contents.map((data, index) => {
                      const fileURL = `https://dweb.link/ipfs/${data.cid}`;
                      return (
                        <tr key={`${data.cid['/']}-${index}`} className={tstyles.tr}>
                          <td className={tstyles.td} style={{ fontSize: 12, fontFamily: 'Mono', opacity: 0.4 }}>
                            {String(index).padStart(7, '0')}
                          </td>
                          <td className={tstyles.td}>{data.name}</td>
                          <td className={tstyles.tdcta}>
                            <a href={fileURL} target="_blank" className={tstyles.cta}>
                              {fileURL}
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
