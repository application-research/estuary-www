import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import PageHeader from '@components/PageHeader';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import Block from '@components/Block';
import Input from '@components/Input';
import Button from '@components/Button';
import MinerTable from '@components/MinerTable';

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
    props: { viewer, api: process.env.ESTUARY_API, site: `https://${context.req.headers.host}` },
  };
}

const refresh = async (state, setState, host) => {
  let map = {};
  const response = await R.get('/admin/miners/stats', host);

  for (let m of response) {
    map[m.miner] = m;
  }

  console.log(map);

  const list = await R.get('/public/miners', host);

  const miners = list.map((each) => {
    if (map[each.addr]) {
      return {
        ...each,
        ...map[each.addr],
      };
    }

    return each;
  });

  setState({ ...state, miners, miner: '', loading: false, reason: '' });
};

function AdminMinersPage(props) {
  const [state, setState] = React.useState({
    loading: false,
    miner: '',
    reason: '',
    miners: null,
  });

  React.useEffect(() => {
    const run = async () => {
      await refresh(state, setState, props.api);
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar active="ADMIN_MINERS" viewer={props.viewer} />;

  return (
    <Page title="Estuary: Admin: Add storage provider" description="Add a storage provider to make Filecoin storage deals with" url={`{$props.site}/admin/providers`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <PageHeader>
          <H2>Storage providers</H2>
          <P style={{ marginTop: 16 }}>Add, remove suspend or reinstate any storage provider.</P>

          <H4 style={{ marginTop: 32 }}>Storage provider ID</H4>
          <Input style={{ marginTop: 8 }} placeholder="ex: f0100" value={state.miner} name="miner" onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })} />

          <div className={styles.actions}>
            <Button
              style={{ marginRight: 24, marginBottom: 24 }}
              loading={state.loading ? state.loading : undefined}
              onClick={async () => {
                if (U.isEmpty(state.miner)) {
                  alert('Please provide a storage provider to add.');
                  return;
                }

                setState({ ...state, loading: true });
                const request: any = await R.post(`/admin/miners/add/${state.miner}`, {}, props.api);
                if (request && request.error) {
                  alert(request.error);
                  setState({ ...state, miner: '', loading: false });
                  return;
                }

                alert(`${state.miner} has been added.`);
                await refresh(state, setState, props.api);
              }}
            >
              Add
            </Button>

            <Button
              style={{
                marginRight: 24,
                marginBottom: 24,
                background: 'var(--main-button-background-secondary)',
                color: 'var(--main-button-text-secondary)',
              }}
              loading={state.loading ? state.loading : undefined}
              onClick={async () => {
                if (U.isEmpty(state.miner)) {
                  alert('Please provide a storage provider to remove.');
                  return;
                }

                setState({ ...state, loading: true });
                const request: any = await R.post(`/admin/miners/rm/${state.miner}`, {}, props.api);
                if (request && request.error) {
                  alert(request.error);
                  setState({ ...state, miner: '', loading: false });
                  return;
                }

                alert(`${state.miner} has been removed.`);
                await refresh(state, setState, props.api);
              }}
            >
              Remove
            </Button>

            <Button
              style={{
                marginRight: 24,
                marginBottom: 24,
                background: 'var(--main-button-background-secondary)',
                color: 'var(--main-button-text-secondary)',
              }}
              loading={state.loading ? state.loading : undefined}
              onClick={async () => {
                if (U.isEmpty(state.miner)) {
                  alert('Please provide a storage provider to reinstate.');
                  return;
                }

                setState({ ...state, loading: true });
                const request: any = await R.put(`/admin/miners/unsuspend/${state.miner}`, {}, props.api);
                if (request && request.error) {
                  alert(request.error);
                  setState({ ...state, miner: '', loading: false });
                  return;
                }

                alert(`${state.miner} has been reinstated.`);
                await refresh(state, setState, props.api);
              }}
            >
              Reinstate
            </Button>

            <Button
              style={{ background: 'var(--main-button-background-secondary)', color: 'var(--main-button-text-secondary)' }}
              loading={state.loading ? state.loading : undefined}
              onClick={async () => {
                if (U.isEmpty(state.miner)) {
                  alert('Please provide a storage provider to suspend.');
                  return;
                }

                setState({ ...state, loading: true });

                const reason = window.prompt('What is the reason?');
                const request: any = await R.post(
                  `/admin/miners/suspend/${state.miner}`,
                  {
                    reason: U.isEmpty(reason) ? 'N/A' : reason,
                  },
                  props.api
                );

                if (request && request.error) {
                  alert(request.error);
                  setState({ ...state, miner: '', loading: false });
                  return;
                }

                alert(`${state.miner} has been suspended for reason: ${reason}`);
                await refresh(state, setState, props.api);
              }}
            >
              Suspend
            </Button>
          </div>
        </PageHeader>

        <div className={styles.group}>{state.miners ? <MinerTable miners={state.miners} /> : null}</div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminMinersPage;
