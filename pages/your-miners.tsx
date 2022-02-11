import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';
import * as C from '@common/constants';
import * as Crypto from '@common/crypto';

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
    props: { host, protocol, viewer, api: process.env.ESTUARY_API },
  };
}

const onGetMinerHex = async (e, state, setState, host) => {
  if (U.isEmpty(state.miner)) {
    alert('Miner is required');
    return;
  }

  const response = await R.get(`/user/miner/claim/${state.miner}`, host);

  if (response && response.error) {
    alert('Failed to get hex message.');
    return;
  }

  setState({ ...state, hexmsg: response.hexmsg });
  console.log(response);
};

const onClaimMiner = async (e, state, setState, host) => {
  if (U.isEmpty(state.miner)) {
    alert('Miner is required');
    return;
  }

  if (U.isEmpty(state.signature)) {
    alert('Signature is required');
    return;
  }

  const response = await R.post(
    `/user/miner/claim`,
    {
      miner: state.miner,
      claim: state.signature,
    },
    host
  );

  if (response && response.error) {
    console.log(response.error);
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
          {!viewer.miners || !viewer.miners.length ? (
            <P style={{ marginTop: 16 }}>By following these steps, you will be able to claim your provider/miner and manage some aspects of it through Estuary.</P>
          ) : (
            <P style={{ marginTop: 16 }}>Here are the providers/miners you have added.</P>
          )}

          {viewer.miners && viewer.miners.length ? (
            <table className={tstyles.table} style={{ marginTop: 48 }}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th} style={{ width: '128px' }}>
                    provider
                  </th>
                  <th className={tstyles.th}>options</th>
                </tr>

                {viewer.miners.map((data, index) => {
                  return (
                    <tr className={tstyles.tr} key={`provider-${index}`}>
                      <td className={tstyles.td}>{data}</td>
                      {!props.offloaded ? (
                        <td className={tstyles.td}>
                          <button
                            className={tstyles.tdbutton}
                            style={{ margin: '0 8px 8px 0' }}
                            onClick={async () => {
                              const answer = window.prompt('Pick a new name.');

                              if (U.isEmpty(answer)) {
                                window.alert('You did not provide a name, try again.');
                                return;
                              }

                              const response = await R.put(`/user/miner/set-info/${data}`, { name: answer }, props.api);

                              if (response && response.error) {
                                return alert(response.error);
                              }

                              window.alert(`Name changed to ${answer}.`);
                              window.location.reload();
                            }}
                          >
                            Change name
                          </button>
                          <button
                            className={tstyles.tdbutton}
                            style={{ margin: '0 8px 8px 0' }}
                            onClick={async () => {
                              const reason = window.prompt('Enter a reason (optional)');

                              const response = await R.post(`/user/miner/suspend/${data}`, { reason }, props.api);

                              if (response && response.error) {
                                return alert(response.error);
                              }

                              window.alert(`Provider is suspended. ${data} will not receive deals.`);
                              window.location.reload();
                            }}
                          >
                            Suspend
                          </button>
                          <button
                            className={tstyles.tdbutton}
                            style={{ margin: '0 8px 8px 0' }}
                            onClick={async () => {
                              const response = await R.put(`/user/miner/unsuspend/${data}`, {}, props.api);

                              window.alert(`Provider unsuspended.  ${data} will receive deals from Estuary.`);
                              window.location.reload();
                            }}
                          >
                            Unsuspend
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
        </SingleColumnLayout>

        <SingleColumnLayout>
          <H3>Get signature</H3>
          <P style={{ marginTop: 16 }}>To get started with adding a provider/miner, please enter your provider/miner ID to obtain a hex message and a command to run on Lotus.</P>

          {!U.isEmpty(state.hexmsg) ? <CodeBlock style={{ marginTop: 16 }}>lotus wallet sign YOUR_WORKER_ADDRESS {state.hexmsg}</CodeBlock> : null}

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
              <Button loading={state.loading} onClick={(e) => onGetMinerHex(e, { ...state }, setState, props.api)}>
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
              <Button loading={state.loading} onClick={(e) => onClaimMiner(e, { ...state }, setState, props.api)}>
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
