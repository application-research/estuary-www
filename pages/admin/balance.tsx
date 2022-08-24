import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import SingleColumnLayout from '@components/SingleColumnLayout';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import Block from '@components/Block';
import Input from '@components/Input';
import Button from '@components/Button';

import { H1, H2, H3, H4, P } from '@components/Typography';

const sendEscrow = async (state, setState, host) => {
  setState({ ...state, loading: true });

  if (!window.confirm('Are you sure you want to transfer this amount?')) {
    setState({ ...state, loading: false });
    return;
  }

  const response = await R.post(`/admin/add-escrow/${state.amount}`, {}, host);
  console.log(response);

  if (response.error) {
    alert('Something went wrong, please try again.');
    setState({ ...state, loading: false, amount: 0 });
    return;
  }

  await getBalance(state, setState, host);
};

const getBalance = async (state, setState, host) => {
  const response = await R.get('/admin/balance', host);
  if (response.error) {
    console.log(response.error);
    return;
  }

  setState({ ...state, ...response, amount: 0, loading: false });
};

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

function AdminBalancePage(props) {
  const [state, setState] = React.useState({
    amount: 0,
    loading: false,
    account: null,
    balance: null,
    verifiedClientBalance: null,
    marketAvailable: null,
    marketEscrow: null,
    marketLocked: null,
  });

  React.useEffect(() => {
    const run = async () => {
      getBalance(state, setState, props.api);
    };

    run();
  }, []);

  const sidebarElement = <AuthenticatedSidebar active="ADMIN_BALANCE" viewer={props.viewer} />;

  return (
    <Page title="Estuary: Admin: Manage Balance" description="The balance remaining in the Estuary node for Filecoin deals." url={`${props.hostname}/admin/balance`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <SingleColumnLayout>
          <H2>Manage Balance</H2>
          <P style={{ marginTop: 16 }}>Your Filecoin address. None of the funds here are used for storage or retrieval deals.</P>

          <Block style={{ marginTop: 24 }} label="Account address (BLS)">
            {state.account}
          </Block>
          <Block style={{ marginTop: 2 }} label="Balance">
            {U.inFIL(state.balance)}
          </Block>
          <Block style={{ marginTop: 2 }} label="Verified data cap">
            {state.verifiedClientBalance !== null ? U.bytesToSize(state.verifiedClientBalance) : 0}
          </Block>

          <H3 style={{ marginTop: 56 }}>Move Filecoin into Estuary Escrow</H3>
          <P style={{ marginTop: 16 }}>Enter the amount of Filecoin you would like to move into Estuary Escrow for Filecoin storage and retrieval deals.</P>

          <H4 style={{ marginTop: 24 }}>Filecoin amount</H4>
          <Input
            style={{ marginTop: 8 }}
            placeholder="ex: 0.2"
            name="amount"
            type="number"
            value={state.amount}
            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
            onSubmit={() => sendEscrow(state, setState, props.api)}
          />

          <div className={styles.actions}>
            <Button loading={state.loading ? state.loading : undefined} onClick={() => sendEscrow(state, setState, props.api)}>
              Move amount
            </Button>
          </div>

          <H3 style={{ marginTop: 56 }}>Estuary Escrow</H3>
          <P style={{ marginTop: 16 }}>The Escrow available is the amount of Filecoin you have available to make storage deals and retrieval deals on the Filecoin Network.</P>

          <Block style={{ marginTop: 24 }} label="Escrow available">
            {U.inFIL(state.marketAvailable)}
          </Block>
          <Block style={{ marginTop: 2 }} label="Total in escrow">
            {U.inFIL(state.marketEscrow)}
          </Block>
          <Block style={{ marginTop: 2 }} label="Market locked">
            {U.inFIL(state.marketLocked)}
          </Block>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminBalancePage;
