import styles from '@pages/app.module.scss';

import * as R from '@common/requests';
import { useState } from 'react';
import Button from './Button';
import CopyButton from './CopyButton';
import Input from './Input';
import { H4, P } from './Typography';

function CreateKeyModalBody(props: any) {
  const [state, setState] = useState({ token: null, label: null, loading: false, copied: false });

  const onSubmit = async () => {
    setState({ ...state, loading: true });
    var authToken;
    if (props.expiry == false) {
      authToken = await R.post(`/user/api-keys?expiry=false&label=${state.label}`, { expiry: false }, props.api);
    } else {
      authToken = await R.post(`/user/api-keys?label=${state.label}`, {}, props.api);
    }
    setState({ ...state, token: authToken.token, loading: false });
  };
  if (!state.token) {
    return (
      <div className={styles.group} style={{ paddingTop: '16px' }}>
        <P>Provide a label to associate with the key you are creating.</P>
        <H4 style={{ marginTop: '16px' }}>Label</H4>
        <Input
          style={{ marginTop: '8px', width: '416px', display: 'inline-block' }}
          placeholder="Pick something memorable"
          name="label"
          onChange={(e) => setState({ ...state, label: e.target.value })}
          onSubmit={(_) => onSubmit()}
        />
        <Button style={{ marginLeft: '16px' }} loading={state.loading ? state.loading : undefined} type="submit" onClick={onSubmit}>
          Create key
        </Button>
      </div>
    );
  } else {
    return (
      <div className={styles.group} style={{ paddingTop: '16px' }}>
        <P style={{ maxWidth: '620px' }}>
          Copy and save the following API key corresponding to your "<b>{state.label}</b>" label.
          {/* once db is omitting token, add language: "For security purposes, we do not store this API key. If it is lost or compromised, please revoke
          and create a new key." */}
        </P>
        <H4 style={{ marginTop: '16px', width: '488px', display: 'inline-block' }}>{state.token}</H4>
        <CopyButton content={state.token} />
      </div>
    );
  }
}

export default CreateKeyModalBody;
