import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as R from '@common/requests';
import Button from './Button';
import Input from './Input';
import { useEffect, useState } from 'react';
import { P } from './Typography';

function CreateKeyModalBody(props: any) {
  const [state, setState] = useState({ token: null, label: null, loading: false, copied: false });

  const onSubmit = async () => {
    setState({ ...state, loading: true });
    const authToken = await R.post(`/user/api-keys?label=${state.label}`, {}, props.api);
    setState({ ...state, token: authToken.token, loading: false });
  };
  if (!state.token) {
    return (
      <React.Fragment>
        <div className={styles.group} style={{ paddingTop: '16px' }}>
          <P>Provide a label to associate with the key you are creating.</P>
          <Input
            style={{ width: '328px', display: 'inline-block' }}
            placeholder="Pick something memorable"
            name="label"
            onChange={(e) => setState({ ...state, label: e.target.value })}
            onSubmit={(_) => onSubmit()}
          />
          <Button style={{ marginLeft: '16px' }} loading={state.loading ? state.loading : undefined} type="submit" onClick={onSubmit}>
            Create key
          </Button>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <P>
          Copy and save the following API key corresponding to your "<b>{state.label}</b>" label.
          {/* once db is omitting token, add language: "For security purposes, we do not store this API key. If it is lost or compromised, please revoke
          and create a new key." */}
        </P>
        <div className={styles.group} style={{ paddingTop: '24px' }}>
          <P style={{ width: '412px', display: 'inline-block' }}>
            <b>{state.token}</b>
          </P>
          <button
            onClick={async () => {
              navigator.clipboard.writeText(state.token).then(() => {
                setState({ ...state, copied: true });
              });
            }}
            className={tstyles.tdbutton}
          >
            {state.copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default CreateKeyModalBody;
