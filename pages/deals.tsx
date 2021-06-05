import styles from "@pages/app.module.scss";
import tstyles from "@pages/table.module.scss";

import * as React from "react";
import * as U from "@common/utilities";
import * as C from "@common/constants";
import * as R from "@common/requests";

import ProgressCard from "@components/ProgressCard";
import Navigation from "@components/Navigation";
import Page from "@components/Page";
import LoaderSpinner from "@components/LoaderSpinner";
import SingleColumnLayout from "@components/SingleColumnLayout";
import AuthenticatedLayout from "@components/AuthenticatedLayout";
import AuthenticatedSidebar from "@components/AuthenticatedSidebar";
import Button from "@components/Button";

import { H1, H2, H3, P } from "@components/Typography";

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

const ContentDeal = (props: any) => (
  <ProgressCard
    key={props.data.ID}
    contentId={props.contentId}
    deal={props.data.deal}
    chain={props.data.onChainState}
    transfer={props.data.transfer}
    marketing={false}
  />
);

export const ContentCard = ({ content, deals, id, root, failuresCount }) => {
  const [state, setState] = React.useState({ showFiles: false });

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

  console.log("root", root);

  const dealErrorURL = `/errors/${id}`;

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
        </tbody>
      </table>
      {root && root.aggregatedFiles > 1 ? (
        <div className={styles.titleSection}>
          This deal has {root.aggregatedFiles} additional{" "}
          {U.pluralize("file", root.aggregatedFiles)}
        </div>
      ) : null}
      <div className={styles.titleSection}>
        {dealElements.length} Storage provider {U.pluralize("deal", dealElements.length)}{" "}
        <a href={dealErrorURL} style={{ color: `var(--main-text)` }} target="_blank">
          (view logs)
        </a>
      </div>
      <div className={styles.deals}>{dealElements}</div>
    </div>
  );
};

class ContentStatus extends React.Component<any> {
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
    return <ContentCard id={this.props.id} {...this.state.status} root={this.props.root} />;
  }
}

export default class Dashboard extends React.Component<any> {
  state = {
    entities: [],
  };

  async componentDidMount() {
    const entities = await R.get(`/content/deals`);
    if (!entities || entities.error) {
      console.log(entities.error);
      return;
    }

    this.setState({ entities });
  }

  render() {
    const statusElements = this.state.entities.length
      ? this.state.entities
          .map((s, index) => <ContentStatus id={s.id} key={s.id} root={s} />)
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
          <SingleColumnLayout>
            <H2>Deals</H2>
            <P style={{ marginTop: 8 }}>
              All of your Filecoin deals and logs will appear here. Deals are automated and made on
              your behalf.
            </P>

            <div className={styles.actions}>
              <Button href="/upload">Upload data</Button>
            </div>
          </SingleColumnLayout>
          <div>{statusElements}</div>
        </AuthenticatedLayout>
      </Page>
    );
  }
}
