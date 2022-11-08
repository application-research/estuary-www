import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';
import * as C from '@common/constants';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import PageHeader from '@components/PageHeader';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import Block from '@components/Block';
import Input from '@components/Input';
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

  if (viewer.perms < 10) {
    return {
      redirect: {
        permanent: false,
        destination: '/home',
      },
    };
  }

  return {
    props: { viewer, api: process.env.ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function AdminContentPage(props: any) {
  const [state, setState] = React.useState({ loading: false, content: [] });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get('/admin/cm/offload/candidates', props.api);
      console.log(response);

      if (response && response.error) {
        return;
      }

      setState({ ...state, content: response });
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar active="ADMIN_CONTENT" viewer={props.viewer} />;

  return (
    <Page title="Estuary: Admin: Content" description="Manage the content on Estuary" url={`${props.hostname}/admin/content`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <PageHeader>
          <H2>Content</H2>
          <P style={{ marginTop: 16 }}>All of the pinned data on this Estuary node.</P>
        </PageHeader>

        <div className={styles.group}>
          <table className={tstyles.table}>
            <tbody className={tstyles.tbody}>
              <tr className={tstyles.tr}>
                <th className={tstyles.th} style={{ width: '128px' }}>
                  name
                </th>
                <th className={tstyles.th} style={{ width: '112px' }}>
                  local id
                </th>
                <th className={tstyles.th}>cid</th>
                <th className={tstyles.th} style={{ width: '128px' }}>
                  replication
                </th>
                <th className={tstyles.th} style={{ width: '128px' }}>
                  size
                </th>
                <th className={tstyles.th} style={{ width: '104px' }}>
                  options
                </th>
              </tr>
              {state.content && state.content.length
                ? state.content.map((data, index) => {
                    const fileURL = `${C.api.host}/gw/ipfs/${data.cid}`;
                    return (
                      <tr className={tstyles.tr} key={`${data.id}-${data.name}-${data.cid}`}>
                        <td className={tstyles.td}>{data.name === 'aggregate' ? '/' : data.name}</td>

                        <td className={tstyles.tdcta}>
                          <a className={tstyles.cta} href={`/content/${data.id}`}>
                            {data.id}
                          </a>
                        </td>

                        <td className={tstyles.tdcta}>
                          <a href={fileURL} target="_blank" className={tstyles.cta}>
                            {fileURL}
                          </a>
                        </td>
                        <td className={tstyles.td}>{data.replication} times</td>
                        <td className={tstyles.td}>{U.bytesToSize(data.size)}</td>
                        {!props.offloaded ? (
                          <td className={tstyles.td}>
                            <button
                              className={tstyles.tdbutton}
                              onClick={async () => {
                                const confirm = window.confirm('Are you sure you want to delete this data?');

                                if (!confirm) {
                                  return;
                                }

                                const response = await R.post(`/admin/cm/offload/${data.id}`, {}, props.api);

                                if (response && response.error) {
                                  return alert(response.error);
                                }

                                const content = await R.get('/admin/cm/offload/candidates', props.api);

                                if (content && content.error) {
                                  return alert(content.error);
                                }

                                setState({ ...state, content });
                              }}
                            >
                              Offload
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminContentPage;
