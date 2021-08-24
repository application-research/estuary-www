import styles from '@pages/app.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';
import * as C from '@common/constants';
import * as Crypto from '@common/crypto';

import { useFissionAuth } from '@common/useFissionAuth';

import ProgressCard from '@components/ProgressCard';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import SingleColumnLayout from '@components/SingleColumnLayout';
import EmptyStatePlaceholder from '@components/EmptyStatePlaceholder';
import Input from '@components/Input';
import Button from '@components/Button';
import LoaderSpinner from '@components/LoaderSpinner';

import { H1, H2, H3, H4, P, CodeBlock } from '@components/Typography';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);
  const host = context.req.headers.host;
  const protocol = host.split(':')[0] === 'localhost' ? 'http' : 'https';

  if (!viewer) {
    return {
      redirect: {
        permanent: false,
        destination: '/sign-in',
      },
    };
  }

  return {
    props: { host, protocol, viewer },
  };
}

const onGetMinerHex = async (e, state, setState) => {
  if (U.isEmpty(state.miner)) {
    alert('Miner is required');
    return;
  }

  const response = await R.get(`/user/miner/claim/${state.miner}`);

  if (response && response.error) {
    alert('Failed to get hex message.');
    return;
  }

  setState({ ...state, hexmsg: response.hexmsg });
  console.log(response);
};

const onClaimMiner = async (e, state, setState) => {
  if (U.isEmpty(state.miner)) {
    alert('Miner is required');
    return;
  }

  if (U.isEmpty(state.signature)) {
    alert('Signature is required');
    return;
  }

  const response = await R.post(`/user/miner/claim/${state.miner}`, {
    miner: state.miner,
    claim: state.signature,
  });

  if (response && response.error) {
    alert(`Failed to claim your miner ${state.miner}.`);
    return;
  }

  if (response && response.success) {
    alert(`Success! You can control this miner`);
    return;
  }
};

function YourMinerPage(props: any) {
  const { viewer } = props;

  const [state, setState] = React.useState({ loading: false, miner: '', hexmsg: '', signature: '' });

  const sidebarElement = <AuthenticatedSidebar active="SETTINGS" viewer={viewer} />;

  console.log(viewer);

  return (
    <Page title="Estuary: Your miners (WIP)" description="Claim and manage your storage provider.">
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <SingleColumnLayout>
          <H2>Your miners</H2>
          <P style={{ marginTop: 16 }}>
            By following these steps, you will be able to claim your miner and manage some aspects of it through Estuary. (Miner Management Section WIP)
          </P>
        </SingleColumnLayout>

        <SingleColumnLayout>
          <H3>Get signature</H3>
          <P style={{ marginTop: 16 }}>Please enter your provider/miner ID to obtain a hex message and a command to run on Lotus.</P>

          {!U.isEmpty(state.hexmsg) ? (
            <CodeBlock style={{ marginTop: 16 }}>
              lotus wallet sign {state.miner} {state.hexmsg}
            </CodeBlock>
          ) : null}

          <H4 style={{ marginTop: 32 }}>Miner ID</H4>
          <Input
            style={{ marginTop: 8 }}
            placeholder="ex: f01000"
            name="miner"
            value={state.miner}
            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value, hexmsg: '' })}
          />

          {U.isEmpty(state.hexmsg) ? (
            <div className={styles.actions}>
              <Button loading={state.loading} onClick={(e) => onGetMinerHex(e, { ...state }, setState)}>
                Get hex message
              </Button>
            </div>
          ) : null}
        </SingleColumnLayout>

        {!U.isEmpty(state.hexmsg) ? (
          <SingleColumnLayout>
            <H3>Claim your miner</H3>
            <P style={{ marginTop: 16 }}>Use the signature provided to claim your miners.</P>

            <H4 style={{ marginTop: 32 }}>Signature</H4>
            <Input
              style={{ marginTop: 8 }}
              placeholder="Copy and paste the signature"
              name="signature"
              value={state.signature}
              onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
            />

            <div className={styles.actions}>
              <Button loading={state.loading} onClick={(e) => onClaimMiner(e, { ...state }, setState)}>
                Claim
              </Button>
            </div>
          </SingleColumnLayout>
        ) : null}
      </AuthenticatedLayout>
    </Page>
  );
}

export default YourMinerPage;
