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

export const ContentCard = ({ content, deals, id, groups }) => {
  let dealElements =
    deals && deals.length ? (
      deals.map((d, index) => <ContentDeal key={`${d.ID}-${index}`} data={d} contentId={id} />)
    ) : (
      <div className={styles.empty}>Estuary has not peformed any deals for this file, yet.</div>
    );

  const retrievalURL = content ? `https://dweb.link/ipfs/${content.cid}` : null;

  let name = "...";
  if (content && content.name) {
    name = content.name;
  }
  if (name === "aggregate") {
    name = "/";
  }

  const subfiles = groups[id] ? groups[id] : [];
  console.log({ subfiles });

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
            <td className={tstyles.td}>{name}</td>

            <td className={tstyles.tdcta}>
              <a className={tstyles.cta} href={retrievalURL} target="_blank">
                {retrievalURL}
              </a>
            </td>

            <td className={tstyles.td}>{id}</td>

            <td className={tstyles.td}>{content ? U.bytesToSize(content.size, 2) : null}</td>
          </tr>
          {subfiles.map((each) => {
            const subRetrievalURL = each ? `https://dweb.link/ipfs/${each.cid}` : null;

            return (
              <tr className={tstyles.tr} key={each.id}>
                <td className={tstyles.td}>{each.name}</td>

                <td className={tstyles.tdcta}>
                  <a className={tstyles.cta} href={retrievalURL} target="_blank">
                    {subRetrievalURL}
                  </a>
                </td>

                <td className={tstyles.td}>{each.id}</td>

                <td className={tstyles.td}>{each ? U.bytesToSize(each.size, 2) : null}</td>
              </tr>
            );
          })}
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
    return <ContentCard id={this.props.id} {...this.state.status} groups={this.props.groups} />;
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

    const groups = {};
    const list = [];
    for (let item of entities) {
      if (!item.aggregatedIn) {
        list.push(item);
        continue;
      }

      if (item.aggregatedIn) {
        if (!groups[item.aggregatedIn]) {
          groups[item.aggregatedIn] = [];
        }

        groups[item.aggregatedIn].push(item);
        continue;
      }
    }

    this.setState({ entities: list, groups });
  }

  render() {
    const statusElements = this.state.entities.length
      ? this.state.entities
          .map((s, index) => <ContentStatus id={s.id} key={s.id} groups={this.state.groups} />)
          .reverse()
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
