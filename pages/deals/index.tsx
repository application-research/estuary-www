import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';
import * as R from '@common/requests';

import ProgressCard from '@components/ProgressCard';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import LoaderSpinner from '@components/LoaderSpinner';
import PageHeader from '@components/PageHeader';
import AuthenticatedLayout from '@components/AuthenticatedLayout';
import AuthenticatedSidebar from '@components/AuthenticatedSidebar';
import Button from '@components/Button';
import ActionRow from '@components/ActionRow';
import AlertPanel from '@components/AlertPanel';

import { H1, H2, H3, H4, P } from '@components/Typography';

const INCREMENT = 100;

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
    props: { viewer },
  };
}

export const ContentCard = ({ content, deals, id, root, failuresCount, viewer }): any => {
  const [state, setState] = React.useState({ showFiles: false, showFailures: false });

  let failureCount = 0;
  let successCount = 0;

  let dealElements =
    deals && deals.length ? (
      deals.map((d, index) => {
        const message = U.getDealStateMessage(d.deal, d.transfer, d.onChainState);
        if (message === 'Failed' || message === 'FailedAfterTransfer') {
          failureCount = failureCount + 1;

          if (!state.showFailures) {
            return null;
          }
        }

        if (message === 'ActiveOnChain') {
          successCount = successCount + 1;
        }

        return <ProgressCard key={`${d.ID}-${id}-${index}`} contentId={id} deal={d.deal} chain={d.onChainState} transfer={d.transfer} message={message} marketing={false} />;
      })
    ) : (
      <div className={styles.empty}>Estuary has not peformed any deals for this file, yet.</div>
    );

  const retrievalURL = content ? `https://dweb.link/ipfs/${content.cid}` : null;

  let name = '...';
  if (content && content.name) {
    name = content.name;
  }
  if (name === 'aggregate') {
    name = '/';
  }

  const dealErrorURL = `/errors/${id}`;

  return (
    <div className={styles.group}>
      <table className={tstyles.table}>
        <tbody className={tstyles.tbody}>
          <tr className={tstyles.tr}>
            <th className={tstyles.th} style={{ width: '25%' }}>
              Name
            </th>
            <th className={tstyles.th} style={{ width: '50%' }}>
              Retrieval CID
            </th>
            <th className={tstyles.th} style={{ width: '12.5%' }}>
              ID
            </th>
            <th className={tstyles.th} style={{ width: '12.5%' }}>
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
          {root.aggregatedFiles} additional {U.pluralize('file', root.aggregatedFiles)} in this deal
        </div>
      ) : null}
      <div className={styles.titleSection}>
        Estuary made {dealElements.length} {U.pluralize('attempt', dealElements.length)}&nbsp;
        <a href={dealErrorURL} style={{ color: `var(--main-text)` }} target="_blank">
          (view logs)
        </a>
        &nbsp;
        {failureCount > 0 ? (
          <span style={{ color: `var(--main-text)`, textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setState({ ...state, showFailures: !state.showFailures })}>
            (toggle {failureCount} {U.pluralize('failure', failureCount)})
          </span>
        ) : null}
      </div>
      {viewer && viewer.settings ? (
        <React.Fragment>
          {successCount === viewer.settings.replication ? (
            <div className={styles.titleSection} style={{ backgroundColor: `var(--status-success-bright)`, fontFamily: 'MonoMedium' }}>
              Your data is backed up to the Filecoin Network
            </div>
          ) : (
            <div className={styles.titleSection} style={{ fontFamily: 'MonoMedium' }}>
              <LoaderSpinner style={{ border: `2px solid rgba(0, 0, 0, 0.1)`, borderTop: `2px solid #000` }} />
              &nbsp; Estuary is working on {viewer.settings.replication} successful on chain deals. {successCount} / {viewer.settings.replication}
            </div>
          )}
        </React.Fragment>
      ) : null}
      <div className={styles.deals}>{dealElements}</div>
    </div>
  );
};

class ContentStatus extends React.Component<any, any> {
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
    return <ContentCard {...this.state.status} viewer={this.props.viewer} id={this.props.id} root={this.props.root} />;
  }
}

export default class Dashboard extends React.Component<any, any> {
  state = {
    entities: [],
    offset: 0,
    limit: INCREMENT,
  };

  async componentDidMount() {
    const entities = await R.get(`/content/deals?offset=${this.state.offset}&limit=${this.state.limit}`);
    if (!entities || entities.error) {
      console.log(entities.error);
      return;
    }

    this.setState({ entities });
  }

  async getNext() {
    const offset = this.state.offset + INCREMENT;
    const limit = this.state.limit;
    const next = await R.get(`/content/deals?offset=${offset}&limit=${limit}`);

    if (!next || !next.length) {
      return;
    }

    this.setState({
      ...this.state,
      offset,
      limit,
      files: [...this.state.entities, ...next],
    });
  }

  render() {
    const statusElements = this.state.entities.length ? this.state.entities.map((s, index) => <ContentStatus viewer={this.props.viewer} id={s.id} key={s.id} root={s} />) : null;
    const sidebarElement = <AuthenticatedSidebar active="DEALS" viewer={this.props.viewer} />;
    const navigationElement = <Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />;

    return (
      <Page title="Estuary: Deals" description="Check the status of your Filecoin storage deals" url="https://estuary.tech/deals">
        <AuthenticatedLayout navigation={navigationElement} sidebar={sidebarElement}>
          <AlertPanel title="Storage deals are experiencing delays">
            Currently Filecoin deals are experiencing delays that are effecting the accuracy of receipts and status reporting. We are waiting for patches in the Lotus
            implementation of Filecoin to be deployed by miners.
          </AlertPanel>
          <PageHeader>
            <H2>Deals</H2>
            <P style={{ marginTop: 16 }}>All of your Filecoin deals and logs will appear here. Deals are automated and made on your behalf.</P>

            <div className={styles.actions}>
              <Button href="/upload">Upload data</Button>
            </div>
          </PageHeader>
          <div>{statusElements}</div>
          {this.state.entities && this.state.offset + this.state.limit === this.state.entities.length ? (
            <ActionRow style={{ paddingLeft: 16, paddingRight: 16 }} onClick={() => this.getNext()}>
              ➝ Next {INCREMENT}
            </ActionRow>
          ) : null}
        </AuthenticatedLayout>
      </Page>
    );
  }
}
