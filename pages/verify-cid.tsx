import S from '@pages/index.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Page from '@components/Page';
import Navigation from '@components/Navigation';
import Button from '@components/Button';
import SingleColumnLayout from '@components/SingleColumnLayout';
import Input from '@components/Input';
import StatRow from '@components/StatRow';
import LoaderSpinner from '@components/LoaderSpinner';
import RetrievalCommands from '@components/RetrievalCommands';
import * as C from '@common/constants';
import { H1, H2, H3, H4, P } from '@components/Typography';

// NOTE(jim): test CIDs
// QmYNSTn2XrxDsF3qFdeYKSxjodsbswJV3mj1ffEJZa2jQL
// QmVrrF7DTnbqKvWR7P7ihJKp4N5fKmBX29m5CHbW9WLep9

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, api: process.env.ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function useWindowSize() {
  const [size, setSize] = React.useState([0, 0]);
  if (!process.browser) {
    return size;
  }

  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const getURIWithParam = (baseUrl, params) => {
  const Url = new URL(baseUrl);
  const urlParams = new URLSearchParams(Url.search);
  for (const key in params) {
    if (params[key] !== undefined) {
      urlParams.set(key, params[key]);
    }
  }
  Url.search = urlParams.toString();
  return Url.toString();
};

const onCheckCID = async (state, setState, host) => {
  setState({ ...state, working: true, data: null });
  await U.delay(2000);
  const response = await R.get(`/public/by-cid/${state.cid}`, host);

  if (response.error) {
    return setState({ ...state, working: false, data: null });
  }

  if (history.pushState) {
    console.log('Update search param.');
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set('cid', state.cid);
    let newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + searchParams.toString();
    window.history.pushState({ path: newurl }, '', newurl);
  }

  setTimeout(() => {
    setState({ ...state, data: response && response.length ? response[0] : null, working: false });
  });
};

function VerifyCIDPage(props: any) {
  const [width, height] = useWindowSize();
  const [state, setState] = React.useState({
    totalStorage: 0,
    totalFilesStored: 0,
    dealsOnChain: 0,
    cid: '',
    data: null,
    working: true,
  });

  React.useEffect(() => {
    const load = async () => {
      const stats = await R.get('/api/v1/stats/info', C.api.metricsHost);
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      if (!params) {
        return setState({ ...state, ...stats, working: false });
      }

      let cid = params.cid ? params.cid : '';
      if (U.isEmpty(cid)) {
        return setState({ ...state, ...stats, working: false });
      }

      setState({ ...state, ...stats, cid });
    };

    load();
  }, [width]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (U.isEmpty(state.cid)) {
        return;
      }

      onCheckCID(state, setState, props.api);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [state.cid]);

  const description = 'Verify that your CID is pinned by Estuary and that CID is sealed on the Filecoin Network by providers with instructions to retrieve it from anywhere.';

  let status = U.isEmpty(state.cid) ? 3 : 4;
  if (state.data && state.data.content) {
    status = 2;
  }

  if (state.working) {
    status = 1;
  }

  let statusElement = null;
  if (status === 1) {
    statusElement = (
      <div className={S.scustom} style={{ marginTop: 48 }}>
        <H3 style={{ marginBottom: 16 }}>Searching...</H3>
        <LoaderSpinner />
      </div>
    );
  }

  if (status === 2) {
    statusElement = (
      <div className={S.scustom} style={{ marginTop: 48 }}>
        <H3>✅ This CID is verified on Estuary</H3>
        <P style={{ marginTop: 8 }}>Here is more information about this CID that is pinned by Estuary.</P>
      </div>
    );
  }

  if (status === 3) {
    statusElement = (
      <div className={S.scustom} style={{ marginTop: 48 }}>
        <H3>Enter a CID</H3>
        <P style={{ marginTop: 8 }}>If this Estuary Node pinned your CID and stored the data on Filecoin, you will be able to find it here.</P>
      </div>
    );
  }

  if (status === 4) {
    statusElement = (
      <div className={S.scustom} style={{ marginTop: 48 }}>
        <H3>This CID is not found</H3>
        <P style={{ marginTop: 8 }}>It might be pinned by a IPFS Node, you can use the dweb.link URL to check</P>
      </div>
    );
  }

  const cid = state.data && state.data.content ? state.data.content.cid : state.cid;
  const estuaryRetrievalUrl = U.formatEstuaryRetrievalUrl(cid);
  const dwebRetrievalUrl = U.formatDwebRetrievalUrl(cid);

  return (
    <Page title="Estuary: Verify CID" description={description} url={props.hostname}>
      <Navigation active="INDEX" isAuthenticated={props.viewer} />

      <SingleColumnLayout style={{ textAlign: 'center', marginBottom: 24 }}>
        <H1 style={{ margin: '0 auto 0 auto' }}>Verify your CID</H1>
        <P style={{ marginTop: 12, maxWidth: '768px', fontSize: '1.15rem', opacity: '0.7' }}>{description}</P>

        <div className={S.form}>
          <Input
            placeholder="Type in a CID..."
            onChange={(e) => {
              const nextState = { ...state, [e.target.name]: e.target.value };
              setState(nextState);
            }}
            value={state.cid}
            readOnly={state.working}
            name="cid"
            onSubmit={() => onCheckCID(state, setState, props.api)}
          />

          {state.data && state.data.content ? (
            <React.Fragment>
              {statusElement}
              <StatRow title="CID">{state.data.content.cid}</StatRow>
              <StatRow title="Estuary retrieval url">
                <a href={estuaryRetrievalUrl} target="_blank">
                  {estuaryRetrievalUrl}
                </a>
              </StatRow>
              <StatRow title="Dweb retrieval url">
                <a href={dwebRetrievalUrl} target="_blank">
                  {dwebRetrievalUrl}
                </a>
              </StatRow>
              <StatRow title="Estuary Node ID">{state.data.content.id}</StatRow>
              <StatRow title="Size">
                {state.data.content.size} bytes ⇄ {U.bytesToSize(state.data.content.size)}
              </StatRow>
            </React.Fragment>
          ) : U.isEmpty(state.cid) ? (
            statusElement
          ) : (
            <React.Fragment>
              {statusElement}

              <StatRow title="Estuary retrieval url">
                <a href={estuaryRetrievalUrl} target="_blank">
                  {estuaryRetrievalUrl}
                </a>
              </StatRow>
              <StatRow title="Dweb retrieval url">
                <a href={dwebRetrievalUrl} target="_blank">
                  {dwebRetrievalUrl}
                </a>
              </StatRow>
            </React.Fragment>
          )}

          {state.data && state.data.deals && state.data.deals.length > 0 ? (
            <React.Fragment>
              <div className={S.scustom} style={{ marginTop: 48 }}>
                <H3>✅ This CID is sealed on Filecoin</H3>
                <P style={{ marginTop: 8 }}>
                  Here are all of the providers that have guaranteed this data is accessible on Filecoin. The integrity of the underlying data is guaranteed by cryptographic proofs
                  for verifiability.
                </P>
              </div>
              {state.data.deals.map((d) => {
                return (
                  <div key={d.ID} style={{ marginTop: 16 }}>
                    <StatRow title="Provider">
                      {d.miner}{' '}
                      <a href={`/providers/stats/${d.miner}`} target="_blank">
                        (view provider)
                      </a>
                    </StatRow>
                    <StatRow title="Success date">{U.toDate(d.sealedAt)}</StatRow>
                    <StatRow title="Retrieval deal ID">
                      {d.dealId}{' '}
                      <a href={`/receipts/${d.dealId}`} target="_blank">
                        (view receipt)
                      </a>
                    </StatRow>
                    <StatRow title="CLI retrieval">
                      <RetrievalCommands
                        miner={d.miner}
                        dealId={d.dealId}
                        cid={state.data.content.cid}
                        aggregatedIn={state.data.aggregatedIn?.cid}
                        selector={state.data.selector}
                      />
                    </StatRow>
                  </div>
                );
              })}
            </React.Fragment>
          ) : null}
        </div>
      </SingleColumnLayout>

      <div className={S.h}>
        <div className={S.ht}>
          <H2 style={{ maxWidth: '768px', fontWeight: 600 }}>https://estuary.tech stats</H2>
          <P style={{ marginTop: 12, maxWidth: '768px', fontSize: '1.15rem', opacity: '0.7' }}>
            This is the performance of our Estuary Node and how much data it has pinned and stored on the Filecoin Network.
          </P>
        </div>
      </div>

      <div className={S.stats}>
        <div className={S.sc}>
          <div className={S.scn}>{state.totalFilesStored ? state.totalFilesStored.toLocaleString() : '0'}</div>
          <div className={S.scl}>Total files</div>
        </div>
        <div className={S.sc}>
          <div className={S.scn}>{state.dealsOnChain}</div>
          <div className={S.scl}>Deals on chain</div>
        </div>
        <div className={S.sc}>
          <div className={S.scn}>{U.bytesToSize(state.totalStorage)}</div>
          <div className={S.scl}>Total pinned data</div>
        </div>
      </div>

      <div className={S.h}>
        <div className={S.actions}>
          <Button href="/">Add your data</Button>
        </div>
      </div>

      <div className={S.fb} style={{ marginTop: 188 }}>
        <a href="https://arg.protocol.ai" target="_blank" className={S.fcta}>
          ➝ Built by ARG
        </a>
      </div>
    </Page>
  );
}

export default VerifyCIDPage;
