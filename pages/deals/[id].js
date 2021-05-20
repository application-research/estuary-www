import styles from "~/pages/app.module.scss";
import tstyles from "~/pages/table.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as R from "~/common/requests";

import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  if (!viewer) {
    return {
      redirect: {
        permanent: false,
        destination: "/sign-in",
      },
    };
  }

  return {
    props: { viewer, ...context.params },
  };
}

function DealPage(props) {
  const [state, setState] = React.useState({ deal: null });

  React.useEffect(async () => {
    const response = await R.get(`/deals/info/${props.id}`);

    if (response && !response.error) {
      setState({ deal: { ...response.Proposal, ...response.State } });
    }
  }, []);

  let fileURL;
  if (state.deal) {
    fileURL = `https://dweb.link/ipfs/${state.deal.Label}`;
  }

  return (
    <Page
      title={`Estuary: Deal: ID: ${props.id}`}
      description={`Errors for deal ID: ${props.id}`}
      url={`https://estuary.tech/errors/${props.id}`}
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
                  <th className={tstyles.th}>CID + retrieval link</th>
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
                  <th className={tstyles.th}>Start date</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>
                    {U.toDateSinceEpoch(state.deal.SectorStartEpoch)} ({state.deal.SectorStartEpoch}
                    )
                  </td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>End date</th>
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
                  <th className={tstyles.th}>Client collateral</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{U.inFIL(state.deal.ClientCollateral)}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Piece CID</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.deal.PieceCID["/"]}</td>
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
                  <td className={tstyles.td}>{state.deal.Client}</td>
                </tr>
              </tbody>
            </table>

            <table className={tstyles.table}>
              <tbody className={tstyles.tbody}>
                <tr className={tstyles.tr}>
                  <th className={tstyles.th}>Provider Miner</th>
                </tr>

                <tr className={tstyles.tr}>
                  <td className={tstyles.td}>{state.deal.Provider}</td>
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
          </React.Fragment>
        ) : null}
      </AuthenticatedLayout>
    </Page>
  );
}

export default DealPage;
