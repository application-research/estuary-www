import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';
import * as R from '@common/requests';

import Cookie from 'js-cookie';
import ProgressCard from '@components/ProgressCard';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import SingleColumnLayout from '@components/SingleColumnLayout';
import Button from '@components/Button';

import { H1, H2, H3, P } from '@components/Typography';

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
    props: { viewer },
  };
}

function APIPage(props: any) {
  const viewerToken = Cookie.get(C.auth);
  console.log(viewerToken);
  const [state, setState] = React.useState({ keys: [], loading: false });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get('/user/api-keys');
      console.log(response);

      if (response && !response.error) {
        setState({ ...state, keys: response });
      }
    };

    run();
  }, []);

  return (
    <Page
      title="Estuary: API"
      description="Generate and manage your API keys."
      url="https://estuary.tech/api"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="API" viewer={props.viewer} />}
      >
        <div>
          <SingleColumnLayout>
            <H2>API</H2>
            <P style={{ marginTop: 8 }}>Generate an API key or manage your existing keys</P>

            <div className={styles.actions}>
              <Button
                style={{
                  marginBottom: 24,
                  marginRight: 24,
                }}
                loading={state.loading ? state.loading : undefined}
                onClick={async () => {
                  setState({ ...state, loading: true });
                  const request = await R.post(`/user/api-keys`, {});

                  const keys = await R.get('/user/api-keys');
                  if (keys && !keys.error) {
                    setState({ ...state, loading: false, keys });
                    return;
                  }
                }}
              >
                Create a key
              </Button>

              <Button
                style={{
                  marginBottom: 24,
                  background: 'var(--main-button-background-secondary)',
                  color: 'var(--main-button-text-secondary)',
                }}
                href="https://docs.estuary.tech"
              >
                Read docs
              </Button>
            </div>
          </SingleColumnLayout>

          <div className={styles.group}>
            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Key</th>
                  <th className={tstyles.th} style={{ width: '136px' }}>
                    Options
                  </th>
                </tr>
                {state.keys && state.keys.length
                  ? state.keys.map((k, index) => {
                      return (
                        <tr key={k.token} className={tstyles.tr}>
                          <td className={tstyles.td}>
                            {k.token}{' '}
                            {viewerToken === k.token ? (
                              <strong>(current browser session)</strong>
                            ) : null}
                          </td>
                          <td className={tstyles.td}>
                            <button
                              onClick={async () => {
                                const confirm = window.confirm(
                                  'Are you sure you want to delete this key?'
                                );
                                if (!confirm) {
                                  return;
                                }

                                const response = await R.del(`/user/api-keys/${k.token}`);
                                if (viewerToken === k.token) {
                                  window.location.href = '/';
                                  return;
                                }

                                const keys = await R.get('/user/api-keys');
                                if (keys && !keys.error) {
                                  setState({ ...state, keys });
                                }
                              }}
                              className={tstyles.tdbutton}
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default APIPage;
