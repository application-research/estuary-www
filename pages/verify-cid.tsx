import S from '@pages/index.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as R from '@common/requests';

import Page from '@components/Page';
import Navigation from '@components/Navigation';
import Card from '@components/Card';
import Button from '@components/Button';
import FeatureRow from '@components/FeatureRow';
import MarketingCube from '@components/MarketingCube';
import SingleColumnLayout from '@components/SingleColumnLayout';
import Input from '@components/Input';
import StatRow from '@components/StatRow';

import { H1, H2, H3, H4, P } from '@components/Typography';

// QmYNSTn2XrxDsF3qFdeYKSxjodsbswJV3mj1ffEJZa2jQL

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  if (!viewer) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  return {
    props: { viewer },
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

const onCheckCID = async (state, setState) => {
  const response = await R.get(`/content/by-cid/${state.cid}`);
  setTimeout(() => {
    setState({ ...state, data: response && response.length ? response[0] : null });
  });
};

const onDebouncedCheckCID = U.debounce((state, setState) => onCheckCID(state, setState));

function VerifyCIDPage(props: any) {
  const [width, height] = useWindowSize();
  const [state, setState] = React.useState({
    totalStorage: 0,
    totalFiles: 0,
    dealsOnChain: 0,
    cid: '',
    data: null,
  });

  React.useEffect(() => {
    const load = async () => {
      const stats = await R.get('/public/stats');
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      if (!params) {
        return setState({ ...state, ...stats });
      }

      let cid = params.cid ? params.cid : '';
      if (U.isEmpty(cid)) {
        return setState({ ...state, ...stats });
      }

      const response = await R.get(`/content/by-cid/${cid}`);
      setState({ ...state, ...stats, data: response && response.length ? response[0] : null, cid: cid });
    };

    load();
  }, [width]);

  const description = 'Verify that your CID is pinned by Estuary and that CID is sealed on the Filecoin Network by providers with instructions to retrieve it from anywhere.';

  return (
    <Page title="Estuary: Verify CID" description={description} url="https://estuary.tech">
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
              onDebouncedCheckCID(nextState, setState);
            }}
            value={state.cid}
            name="cid"
            onSubmit={() => onCheckCID(state, setState)}
          />

          {state.data && state.data.content ? (
            <React.Fragment>
              <H3 style={{ marginTop: 48 }}>✅ This CID is verified on Estuary</H3>
              <P style={{ marginTop: 8, marginBottom: 24 }}>Here is more information about this CID that is pinned by Estuary.</P>
              <StatRow title="CID">{state.data.content.cid}</StatRow>
              <StatRow title="Retrieval URL">
                <a href={`https://dweb.link/ipfs/${state.data.content.cid}`} target="_blank">
                  https://dweb.link/ipfs/{state.data.content.cid}
                </a>
              </StatRow>
              <StatRow title="Estuary Node ID">{state.data.content.id}</StatRow>
              <StatRow title="Size">
                {state.data.content.size} bytes ⇄ {U.bytesToSize(state.data.content.size)}
              </StatRow>
            </React.Fragment>
          ) : U.isEmpty(state.cid) ? (
            <React.Fragment>
              <H3 style={{ marginTop: 48 }}>Enter a CID</H3>
              <P style={{ marginTop: 8, marginBottom: 24 }}>If this Estuary Node pinned your CID and stored the data on Filecoin, you will be able to find it here.</P>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <H3 style={{ marginTop: 48 }}>This CID is not found</H3>
              <P style={{ marginTop: 8, marginBottom: 24 }}>It might be pinned by a IPFS Node, you can use the dweb.link URL to check</P>

              <StatRow title="Retrieval URL">
                {' '}
                <a href={`https://dweb.link/ipfs/${state.cid.trim()}`} target="_blank">
                  https://dweb.link/ipfs/{state.cid.trim()}
                </a>
              </StatRow>
            </React.Fragment>
          )}

          {state.data && state.data.deals ? (
            <React.Fragment>
              <H3 style={{ marginTop: 48 }}>✅ This CID is sealed on Filecoin</H3>
              <P style={{ marginTop: 8 }}>
                Here are all of the providers that have guaranteed this data is accessible on Filecoin. The integrity of the underlying data is guaranteed by cryptographic proofs
                for verifiability.
              </P>
              {state.data.deals.map((d) => {
                return (
                  <div key={d.ID} style={{ marginTop: 16 }}>
                    <StatRow title="Provider">
                      {d.miner}{' '}
                      <a href={`https://estuary.tech/providers/stats/${d.miner}`} target="_blank">
                        (view provider)
                      </a>
                    </StatRow>
                    <StatRow title="Success date">{U.toDate(d.sealedAt)}</StatRow>
                    <StatRow title="Retrieval deal ID">
                      {d.dealId}{' '}
                      <a href={`https://estuary.tech/receipts/${d.dealId}`} target="_blank">
                        (view receipt)
                      </a>
                    </StatRow>
                    <StatRow title="Lotus retrieval">
                      lotus client retrieve --miner {d.miner} {state.data.content.cid} data-{d.dealId}
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
          <div className={S.scn}>{state.totalFiles ? state.totalFiles.toLocaleString() : null}</div>
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
          ➝ Built by ꧁𓀨꧂
        </a>
      </div>
    </Page>
  );
}

export default VerifyCIDPage;
