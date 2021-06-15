import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';

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
    props: { viewer, ...context.params },
  };
}

function DealPage(props: any) {
  const [state, setState] = React.useState({ deal: null, transfer: null, onChainState: null });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get(`/deals/status/${props.id}`);
      console.log(response);
      if (response && !response.error) {
        setState({ ...response });
      }
    };

    run();
  }, []);

  let fileURL;
  if (state.transfer) {
    fileURL = `https://dweb.link/ipfs/${state.transfer.baseCid}`;
  }

  return (
    <Page
      title={`Estuary: Deal: ${props.id}`}
      description={`Deal status and transfer information`}
      url={`https://estuary.tech/deals/${props.id}`}
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated active="DEAL_BY_ID" />}
        sidebar={<AuthenticatedSidebar viewer={props.viewer} />}
      >
        {state.deal ? (
          <React.Fragment>
            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Created date</th>
                  <th className={tstyles.th}>Failed</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.deal.CreatedAt}</td>
                  <td className={tstyles.td}>{String(state.deal.failed)}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Deal Database ID</th>
                  <th className={tstyles.th}>Content ID</th>
                  <th className={tstyles.th}>Network Deal ID</th>
                  <th className={tstyles.th}>Miner</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.deal.ID}</td>
                  <td className={tstyles.td}>{state.deal.content}</td>
                  <td className={tstyles.tdcta}>
                    <a className={tstyles.cta} href={`/receipts/${state.deal.dealId}`}>
                      {state.deal.dealId}
                    </a>
                  </td>
                  <td className={tstyles.tdcta}>
                    <a className={tstyles.cta} href={`/miners/stats/${state.deal.miner}`}>
                      {state.deal.miner}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Data Transfer Channel</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.deal.dtChan}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Proposal CID + inspection link</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.tdcta}>
                    <a className={tstyles.cta} href={`/proposals/${state.deal.propCid}`}>
                      https://estuary.tech/proposals/{state.deal.propCid}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Base CID + retrieval link</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.tdcta}>
                    <a className={tstyles.cta} href={fileURL} target="_blank">
                      {fileURL}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Channel ID</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.transfer.channelId.ID}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Channel Initiator</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.transfer.channelId.Initiator}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Channel Responder</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.transfer.channelId.Responder}</td>
                </tr>
              </tbody>
            </table>

            {!U.isEmpty(state.transfer.message) ? (
              <table className={tstyles.table}>
                <tbody className={tstyles.tbody}>
                  <tr className={tstyles.tr}>
                    <th className={tstyles.th}>Message</th>
                  </tr>

                  <tr className={tstyles.tr}>
                    <td className={tstyles.td}>{state.transfer.message}</td>
                  </tr>
                </tbody>
              </table>
            ) : null}

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Received</th>
                  <th className={tstyles.th}>Sent</th>
                  <th className={tstyles.th}>Status</th>
                  <th className={tstyles.th}>Message</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{U.bytesToSize(state.transfer.received)}</td>
                  <td className={tstyles.td}>{U.bytesToSize(state.transfer.sent)}</td>
                  <td className={tstyles.td}>{state.transfer.status}</td>
                  <td className={tstyles.td}>{state.transfer.statusMessage}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Remote peer</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.transfer.remotePeer}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Self peer</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.transfer.selfPeer}</td>
                </tr>
              </tbody>
            </table>

            {state.onChainState ? (
              <React.Fragment>
                <table className={tstyles.table}>
                  <tbody className={tstyles.tbody}>
                    <tr className={tstyles.tr}>
                      <th className={tstyles.th}>Sector Start Epoch</th>
                    </tr>

                    <tr className={tstyles.tr}>
                      <td className={tstyles.td}>
                        {state.onChainState.sectorStartEpoch > 0
                          ? U.toDateSinceEpoch(state.onChainState.sectorStartEpoch)
                          : state.onChainState.sectorStartEpoch}{' '}
                        ({state.onChainState.sectorStartEpoch})
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className={tstyles.table}>
                  <tbody className={tstyles.tbody}>
                    <tr className={tstyles.tr}>
                      <th className={tstyles.th}>Last Updated Epoch</th>
                    </tr>

                    <tr className={tstyles.tr}>
                      <td className={tstyles.td}>
                        {state.onChainState.lastUpdatedEpoch > 0
                          ? U.toDateSinceEpoch(state.onChainState.lastUpdatedEpoch)
                          : state.onChainState.lastUpdatedEpoch}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className={tstyles.table}>
                  <tbody className={tstyles.tbody}>
                    <tr className={tstyles.tr}>
                      <th className={tstyles.th}>Slash Epoch</th>
                    </tr>

                    <tr className={tstyles.tr}>
                      <td className={tstyles.td}>
                        {state.onChainState.slashEpoch > 0
                          ? U.toDateSinceEpoch(state.onChainState.slashEpoch)
                          : state.onChainState.slashEpoch}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        ) : null}
      </AuthenticatedLayout>
    </Page>
  );
}

export default DealPage;
