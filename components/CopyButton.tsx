import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import { useState } from 'react';

function CopyButton(props: any) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={tstyles.tdbutton}
      onClick={async () => {
        navigator.clipboard.writeText(props.content).then(() => {
          setCopied(true);
        });
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default CopyButton;
