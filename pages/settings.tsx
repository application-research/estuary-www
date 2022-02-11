import styles from '@pages/app.module.scss';

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

import { H1, H2, H3, H4, P } from '@components/Typography';

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

const onSubmit = async (event, state, setState, host) => {
  setState({ ...state, loading: true });

  if (U.isEmpty(state.new)) {
    alert('Please provide a new password');
    return setState({ ...state, loading: false });
  }

  if (!U.isValidPassword(state.new)) {
    return {
      error: 'Please provide a password thats at least 8 characters with at least one letter and one number',
    };
  }

  if (U.isEmpty(state.confirm)) {
    alert('Please confirm your new password');
    return setState({ ...state, loading: false });
  }

  if (state.new !== state.confirm) {
    alert('Please make sure you confirmed your new password correctly');
    return setState({ ...state, loading: false });
  }

  let newPasswordHash = await Crypto.attemptHashWithSalt(state.new);

  let response;
  try {
    response = await R.put('/user/password', { newPasswordHash: newPasswordHash }, host);
    await U.delay(1000);

    if (response.error) {
      alert(response.error);
      return setState({ ...state, new: '', confirm: '', loading: false });
    }
  } catch (e) {
    console.log(e);
    alert('Something went wrong');
    return setState({ ...state, new: '', confirm: '', loading: false });
  }

  alert('Your password has been changed.');
  return setState({ ...state, new: '', confirm: '', loading: false });
};

function SettingsPage(props: any) {
  const { viewer } = props;
  const [fissionUser, setFissionUser] = React.useState(null);
  const [state, setState] = React.useState({ loading: false, old: '', new: '', confirm: '' });
  const [address, setAddress] = React.useState('');
  const [balance, setBalance] = React.useState(0);

  console.log({ viewer });

  const sidebarElement = <AuthenticatedSidebar active="SETTINGS" viewer={viewer} />;

  if (!viewer) {
    return (
      <Page title="Estuary: Settings: Account" description="Update your settings for your account." url="https://estuary.tech/settings">
        <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
          <div style={{ padding: 24 }}>
            <LoaderSpinner /> This page will finish loading if you have Fission authentication enabled...
          </div>
        </AuthenticatedLayout>
      </Page>
    );
  }

  return (
    <Page title="Estuary: Settings: Account" description="Update your settings for your account." url="https://estuary.tech/settings">
      <AuthenticatedLayout navigation={<Navigation isAuthenticated isRenderingSidebar={!!sidebarElement} />} sidebar={sidebarElement}>
        <SingleColumnLayout>
          <H2>Settings</H2>
          <P style={{ marginTop: 16 }}>Update your user settings.</P>
        </SingleColumnLayout>

        <SingleColumnLayout>
          <H3>Change password</H3>
          <P style={{ marginTop: 16 }}>Please enter your new password to change your password.</P>

          <H4 style={{ marginTop: 32 }}>New password</H4>
          <Input
            style={{ marginTop: 8 }}
            placeholder="Pick something memorable"
            name="new"
            value={state.new}
            type="password"
            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
          />
          <aside className={styles.formAside}>Requirements: at least 8 characers, must use at least one letter and number.</aside>

          <H4 style={{ marginTop: 24 }}>Confirm new password</H4>
          <Input
            style={{ marginTop: 8 }}
            placeholder="Pick something memorable"
            name="confirm"
            value={state.confirm}
            type="password"
            onChange={(e) => setState({ ...state, [e.target.name]: e.target.value })}
            onSubmit={(e) => onSubmit(e, { ...state }, setState, props.api)}
          />

          <div className={styles.actions}>
            <Button loading={state.loading} onClick={(e) => onSubmit(e, { ...state }, setState, props.api)}>
              Change
            </Button>
          </div>

          <H3 style={{ marginTop: 64 }}>Default settings (read only)</H3>
          <P style={{ marginTop: 16 }}>Estuary is configured to default settings for deals. You can not change these values, yet.</P>

          {fissionUser ? (
            <React.Fragment>
              <H4 style={{ marginTop: 24 }}>Fission Filecoin balance</H4>
              <Input style={{ marginTop: 8 }} readOnly value={balance} />
              <aside className={styles.formAside}>Filecoin Balance in AttoFIL ({U.inFIL(balance)}).</aside>

              <H4 style={{ marginTop: 24 }}>Fission Filecoin address</H4>
              <Input style={{ marginTop: 8 }} readOnly value={address ? address : ''} />
              <aside className={styles.formAside}>
                This address is provided to your account when you <strong>sign in with Fission</strong>. To learn more visit <a href="/fission">Fission's website</a>.
              </aside>
            </React.Fragment>
          ) : null}

          <H4 style={{ marginTop: 24 }}>Replication</H4>
          <Input style={{ marginTop: 8 }} readOnly value={viewer.settings.replication} />
          <aside className={styles.formAside}>
            This is the amount of storage providers we will secure deals (sealed, on chain) with on the Filecoin Network. Once this happens we will stop.
          </aside>

          <H4 style={{ marginTop: 24 }}>Deal duration (30 second fil-epoch)</H4>
          <Input style={{ marginTop: 8 }} readOnly value={viewer.settings.dealDuration} />
          <aside className={styles.formAside}>
            Stored for {viewer.settings.dealDuration} filecoin-epochs ({((viewer.settings.dealDuration * 30) / 60 / 60 / 24).toFixed(2)} days). This Estuary node will auto renew
            deals if there is Filecoin in the address used to make deals.
          </aside>

          <H4 style={{ marginTop: 24 }}>Max staging wait (nanoseconds)</H4>
          <Input style={{ marginTop: 8 }} readOnly value={viewer.settings.maxStagingWait} />
          <aside className={styles.formAside}>
            The amount of time Estuary waits before making deals for a <a href="/staging">staging zone</a>. Currently Estuary waits {U.nanoToHours(viewer.settings.maxStagingWait)}{' '}
            hours.
          </aside>

          <H4 style={{ marginTop: 24 }}>Staging threshold (bytes)</H4>
          <Input style={{ marginTop: 8 }} readOnly value={viewer.settings.fileStagingThreshold} />
          <aside className={styles.formAside}>
            If you upload anything under {U.bytesToSize(viewer.settings.fileStagingThreshold)}, Estuary will initialize a staging area for those files.
          </aside>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default SettingsPage;
