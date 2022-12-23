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

import { H2, P } from '@components/Typography';
import Link from 'next/link';

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

function StagingPage(props) {
  const [state, setState] = React.useState({ zones: [] });

  React.useEffect(() => {
    const run = async () => {
      const zones = await R.get('/content/staging-zones', props.api);
      console.log(zones);

      if (!zones || zones.error) {
        return;
      }

      setState({ zones });
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
            When you upload data under the size of {U.bytesToSize(props.viewer.settings.fileStagingThreshold)}, the data will be staged here. After the total size of staged data
            reaches this size, a storage deal will be made within a few minutes.
          </P>

          <div className={styles.actions}>
            <Button href="/upload">Upload data</Button>
          </div>
        </PageHeader>

        <div className={styles.group}>
          <table className={tstyles.table}>
            <tbody className={tstyles.tbody}>
              <tr className={tstyles.tr}>
                <th className={tstyles.th}>Zone ID</th>
                <th className={tstyles.th}>Created at</th>
                <th className={tstyles.th}>Size</th>
                <th className={tstyles.th}>Accepted size range</th>
                <th className={tstyles.th}>Status</th>
              </tr>
              {state.zones.map((zone, index) => {
                var zoneHref = `/staging/${zone.id}`;
                return (
                  <tr className={tstyles.tr}>
                    <td className={tstyles.td}>
                      <Link href={zoneHref} className={tstyles.cta}>
                        {zone.id}
                      </Link>
                    </td>
                    <td className={tstyles.td}>{U.toDate(zone.createdAt)}</td>
                    <td className={tstyles.td}>{U.bytesToSize(zone.curSize)}</td>
                    <td className={tstyles.td}>
                      {U.bytesToSize(zone.minSize)} - {U.bytesToSize(zone.maxSize)}
                    </td>
                    <td className={tstyles.td}>{zone.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default StagingPage;
