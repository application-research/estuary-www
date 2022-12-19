import tstyles from '@pages/table.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
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
    props: { viewer, ...context.params, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function ProposalPage(props: any) {
  const [state, setState] = React.useState({ deal: null });

  React.useEffect(() => {
    const run = async () => {
      const response = await R.get(`/deals/proposal/${props.cid}`, props.api);

      if (response && !response.error) {
        setState({ deal: { ...response.Proposal, ...response.State } });
      }
    };

    run();
  }, []);

  const estuaryRetrievalUrl = state.deal ? U.formatEstuaryRetrievalUrl(state.deal.Label) : null;
  const dwebRetrievalUrl = state.deal ? U.formatDwebRetrievalUrl(state.deal.Label) : null;

  const sidebarElement = <AuthenticatedSidebar viewer={props.viewer} />;

  return (
    <Page title={`Estuary: Proposal: CID: ${props.cid}`} description={`Deal proposals for proposal (prop) cid: ${props.cid}`} url={`${props.hostname}/proposals/${props.cid}`}>
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} active="PROPOSAL_BY_CID" />} sidebar={sidebarElement}>
        {state.deal ? (
          <React.Fragment>
            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Verified</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{String(state.deal.VerifiedDeal)}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Estuary retrieval url</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.tdcta}>
                    <Link className={tstyles.cta} href={estuaryRetrievalUrl} target="_blank">
                      {estuaryRetrievalUrl}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Dweb retrieval url</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.tdcta}>
                    <Link className={tstyles.cta} href={dwebRetrievalUrl} target="_blank">
                      {dwebRetrievalUrl}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Start</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>
                    {U.toDateSinceEpoch(state.deal.StartEpoch)} ({state.deal.StartEpoch})
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>End</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>
                    {U.toDateSinceEpoch(state.deal.EndEpoch)} ({state.deal.EndEpoch})
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Piece CID</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.deal.PieceCID['/']}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Piece Size</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{U.bytesToSize(state.deal.PieceSize)}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Deal making client</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{String(state.deal.Client)}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Provider</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.tdcta}>
                    <Link className={tstyles.cta} href={`/providers/stats/${state.deal.Provider}`}>
                      {state.deal.Provider}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Provider collateral</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{U.inFIL(state.deal.ProviderCollateral)}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Storage price per epoch</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{U.inFIL(state.deal.StoragePricePerEpoch)}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Total cost</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{U.inFIL(state.deal.StoragePricePerEpoch * (state.deal.EndEpoch - state.deal.StartEpoch))}</td>
                </tr>
              </tbody>
            </table>
          </React.Fragment>
        ) : null}
      </AuthenticatedLayout>
    </Page>
  );
}

export default ProposalPage;
