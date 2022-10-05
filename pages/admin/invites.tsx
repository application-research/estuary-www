import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import SingleColumnLayout from '@components/SingleColumnLayout';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import PageHeader from '@components/PageHeader';
import Block from '@components/Block';
import Input from '@components/Input';
import Button from '@components/Button';

import { H1, H2, H3, H4, P } from '@components/Typography';
import { v4 as uuidv4 } from 'uuid';

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

function AdminInvitesPage(props: any) {
  const [state, setState] = React.useState({ invites: [], key: '', loading: false });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get('/admin/invites', props.api);
      console.log(response);
      setState({ ...state, invites: response && response.length ? response.reverse() : [] });
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar active="ADMIN_INVITES" viewer={props.viewer} />;

  return (
    <Page title="Estuary: Admin: Invite" description="Create invite keys for new users." url={`${props.hostname}/admin/invite`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <PageHeader>
          <H2>Create Invite</H2>
          <P style={{ marginTop: 16 }}>You can create a single use key with any string that you like. If you do not provide a string we will generate a random invite for you.</P>

          <H4 style={{ marginTop: 32 }}>Invite key</H4>
          <Input
            style={{ marginTop: 8 }}
            placeholder="Pick something memorable"
            value={state.key}
            name="key"
            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
            onSubmit={async () => {
              setState({ ...state, loading: true });
              await R.post(`/admin/invite/${state.key}`, {}, props.api);
              const response = await R.get('/admin/invites', props.api);
              console.log(response);
              setState({
                ...state,
                loading: false,
                key: '',
                invites: response && response.length ? response.reverse() : [],
              });
            }}
          />

          <div className={styles.actions}>
            <Button
              loading={state.loading ? state.loading : undefined}
              onClick={async () => {
                if (U.isEmpty(state.key)) {
                  const generatedKey = `estuary-invite-${uuidv4()}`;
                  setState({ ...state, loading: true });
                  await R.post(`/admin/invite/${generatedKey}`, {}, props.api);
                  const response = await R.get('/admin/invites', props.api);
                  console.log(response);
                  return setState({
                    ...state,
                    loading: false,
                    key: '',
                    invites: response && response.length ? response.reverse() : [],
                  });
                }

                setState({ ...state, loading: true });
                await R.post(`/admin/invite/${state.key}`, {}, props.api);
                const response = await R.get('/admin/invites', props.api);
                console.log(response);
                setState({
                  ...state,
                  loading: false,
                  key: '',
                  invites: response && response.length ? response.reverse() : [],
                });
              }}
            >
              Create invite
            </Button>
          </div>
        </PageHeader>
        <div className={styles.group}>
          <table className={tstyles.table}>
            <tbody className={tstyles.tbody}>
              <tr className={tstyles.tr}>
                <th className={tstyles.th}>Estuary invite key</th>
                <th className={tstyles.th} style={{ width: '144px' }}>
                  Creator
                </th>
                <th className={tstyles.th} style={{ width: '144px' }}>
                  Recipient
                </th>
              </tr>
              {state.invites && state.invites.length
                ? state.invites.map((data, index) => {
                    return (
                      <tr key={data.code} className={tstyles.tr} style={{ opacity: !U.isEmpty(data.claimedBy) ? 0.2 : 1 }}>
                        <td className={tstyles.td}>
                          <div>
                            https://{window.location.hostname}/sign-up?invite={data.code}{' '}
                            <button
                              style={{ float: 'right', opacity: 0.5, outline: 'None', fontFamily: 'mono', marginRight: '1rem' }}
                              onClick={(e) => {
                                navigator.clipboard.writeText(`https://${window.location.hostname}/sign-up?invite=${data.code}`);
                                e.target.textContent = 'Copied!';
                                setTimeout((e) => (e.target.textContent = 'Copy'), 1000, e);
                              }}
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                        <td className={tstyles.td}>{data.createdBy}</td>
                        <td className={tstyles.td}>{data.claimedBy}</td>
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

export default AdminInvitesPage;
