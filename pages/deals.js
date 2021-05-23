import styles from "~/pages/app.module.scss";
import tstyles from "~/pages/table.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";
import * as R from "~/common/requests";

import ProgressCard from "~/components/ProgressCard";
import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import LoaderSpinner from "~/components/LoaderSpinner";
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
    contentId={props.contentId}
    deal={props.data.deal}
    chain={props.data.onChainState}
    transfer={props.data.transfer}
  />
);

export const ContentCard = ({ content, deals, id }) => {
  let dealElements =
    deals && deals.length ? (
      deals.map((d, index) => <ContentDeal key={`${d.ID}-${index}`} data={d} contentId={id} />)
    ) : (
      <div className={styles.empty}>Estuary has not peformed any deals for this file, yet.</div>
    );

  const retrievalURL = content ? `https://dweb.link/ipfs/${content.cid}` : null;

  return (
    <div className={styles.group}>
      <table className={tstyles.table}>
        <tbody className={tstyles.tbody}>
          <tr className={tstyles.tr}>
            <th className={tstyles.th} style={{ width: "25%" }}>
              Name
            </th>
            <th className={tstyles.th} style={{ width: "50%" }}>
              Retrieval CID
            </th>
            <th className={tstyles.th} style={{ width: "12.5%" }}>
              ID
            </th>
            <th className={tstyles.th} style={{ width: "12.5%" }}>
              Size
            </th>
          </tr>
          <tr className={tstyles.tr}>
            <td className={tstyles.td}>{content ? content.name : "Loading..."}</td>

            <td className={tstyles.tdcta}>
              <a className={tstyles.cta} href={retrievalURL} target="_blank">
                {retrievalURL}
              </a>
            </td>

            <td className={tstyles.td}>{id}</td>

            <td className={tstyles.td}>{content ? U.bytesToSize(content.size, 2) : null}</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.deals}>{dealElements}</div>
    </div>
  );
};

class ContentStatus extends React.Component {
  state = {
    status: null,
  };

  async componentDidMount() {
    const status = await R.get(`/content/status/${this.props.id}`);
    if (status.error) {
      return;
    }

    this.setState({ status });
  }

  render() {
    return <ContentCard id={this.props.id} {...this.state.status} />;
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
    const statusElements = this.state.entities.length
      ? this.state.entities.map((s, index) => <ContentStatus id={s.id} key={s.id} />).reverse()
      : null;

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
