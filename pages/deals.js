import styles from "~/pages/app.module.scss";
import tstyles from "~/pages/table.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";
import * as R from "~/common/requests";

import ProgressCard from "~/components/ProgressCard";
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
    props: { viewer },
  };
}

const ContentDeal = (props) => (
  <ProgressCard
    key={props.data.ID}
    deal={props.data.deal}
    chain={props.data.onChainState}
    transfer={props.data.transfer}
  />
);

class ContentStatus extends React.Component {
  state = {
    status: {},
  };

  async componentDidMount() {
    const status = await R.get(`/content/status/${this.props.id}`);
    if (status.error) {
      return;
    }

    this.setState({ status });
  }

  render() {
    let { content, deals, failuresCount } = this.state.status;
    let onChain = deals ? deals.filter((deal) => deal.deal.dealId > 0) : [];
    let active = deals
      ? deals.filter((d) => d.onChainState && d.onChainState.sectorStartEpoch)
      : [];

    let dealElements = deals ? (
      deals.map((deal, index) => <ContentDeal key={`${deal.ID}-${index}`} data={deal} />)
    ) : (
      <div className={styles.empty}>Processing...</div>
    );

    return (
      <div className={styles.group}>
        <table className={tstyles.table}>
          <tbody className={tstyles.tbody}>
            <tr className={tstyles.tr}>
              <th className={tstyles.th}>Name</th>
              <th className={tstyles.th} style={{ width: "120px" }}>
                Content ID
              </th>
              <th className={tstyles.th} style={{ width: "116px" }}>
                Size
              </th>
            </tr>
            <tr className={tstyles.tr}>
              <td className={tstyles.td}>{content ? content.name : "Loading..."}</td>

              <td className={tstyles.td}>{this.props.id}</td>

              <td className={tstyles.td}>{content ? U.bytesToSize(content.size, 2) : null}</td>
            </tr>
          </tbody>
        </table>
        <table className={tstyles.table}>
          <tbody className={tstyles.tbody}>
            <tr className={tstyles.tr}>
              <th className={tstyles.th} style={{ width: "80px" }}>
                Deals
              </th>
              <th className={tstyles.th} style={{ width: "88px" }}>
                Active
              </th>
              <th className={tstyles.th} style={{ width: "96px" }}>
                On chain
              </th>
              {failuresCount ? (
                <th className={tstyles.th} style={{ width: "96px" }}>
                  Total errors
                </th>
              ) : null}
            </tr>
            <tr className={tstyles.tr}>
              <td className={tstyles.td}>{deals ? deals.length : 0}</td>

              <td className={tstyles.td}>
                {active.length} / {deals ? deals.length : 0}
              </td>

              <td className={tstyles.td}>
                {onChain.length} / {deals ? deals.length : 0}
              </td>

              {failuresCount ? (
                <td className={tstyles.tdcta}>
                  <a href={`/errors/${this.props.id}`} className={tstyles.cta}>
                    {failuresCount}
                  </a>
                </td>
              ) : null}
            </tr>
          </tbody>
        </table>
        <div className={styles.deals}>{dealElements}</div>
      </div>
    );
  }
}

export default class Dashboard extends React.Component {
  state = {
    entities: [],
  };

  async componentDidMount() {
    const entities = await R.get(`/content/list`);
    if (!entities || entities.error) {
      console.log(entities.error);
      return;
    }

    this.setState({ entities });
  }

  render() {
    const statusElements = this.state.entities
      .map((s, index) => <ContentStatus id={s.id} key={s.id} />)
      .reverse();

    return (
      <Page
        title="Estuary: Deals"
        description="Check the status of your Filecoin storage deals"
        url="https://estuary.tech/deals"
      >
        <AuthenticatedLayout
          navigation={<Navigation isAuthenticated />}
          sidebar={<AuthenticatedSidebar active="DEALS" viewer={this.props.viewer} />}
        >
          <div>{statusElements}</div>
        </AuthenticatedLayout>
      </Page>
    );
  }
}
