import S from '@pages/index.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import * as C from '@common/constants';
import Button from '@components/Button';
import Input from '@components/Input';
import LoaderSpinner from '@components/LoaderSpinner';
import Navigation from '@components/Navigation';
import Page from '@components/Page';
import RetrievalCommands from '@components/RetrievalCommands';
import SingleColumnLayout from '@components/SingleColumnLayout';
import StatRow from '@components/StatRow';
import { CodeBlock, H1, H2, H3, P } from '@components/Typography';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import { Link, Stack, Typography, Box, Container } from '@mui/material';

// NOTE(jim): test CIDs
// QmPBHAjRLZqvJwcBUTiVxNtvugToAnTyJxpzTCgKZVHsvw/

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
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

const mainPrimary = `#0BFF48`;
const darkGreen = `#0A7225`;
const blue = `#01BAE1`;

const CssTextField = styled(TextField)({
  transition: 'all 0.3s ease-in-out',
  width: '100%',
  // '& .MuiInputBase-root': { height: '6vh' },

  '& label': { color: 'gray', fontSize: '2vh', paddingLeft: '16px' },

  '& .MuiInputBase-input': { color: 'white', height: '3vh' },

  '& label.Mui-focused': {
    transition: 'all 0.3s ease-in-out',
    color: mainPrimary,
  },
  '& .MuiInput-underline:after': {
    transition: 'all 0.3s ease-in-out',
    borderBottomColor: darkGreen,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      transition: 'all 0.3s ease-in-out',
      borderColor: mainPrimary,
    },
    '&:hover fieldset': {
      transition: 'all 0.3s ease-in-out',
      borderColor: darkGreen,
    },
    '&.Mui-focused fieldset': {
      transition: 'all 0.3s ease-in-out',
      borderColor: darkGreen,
      fontSize: '2vh',
      paddingLeft: '16px',
    },
  },
});

const onCheckCID = async (state, setState, host) => {
  setState({ ...state, working: true, data: null });
  await U.delay(2000);
  const response = await R.get(`/public/by-cid/${state.cid}`, host);

  if (response.error) {
    return setState({ ...state, working: false, data: { error: response.error } });
  }

  if (history.pushState) {
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
    cid: '',
    data: null,
    working: true,
  });

  React.useEffect(() => {
    const load = async () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());

      if (!params) {
        return setState({ ...state, working: false });
      }

      let cid = params.cid ? params.cid : '';
      if (U.isEmpty(cid)) {
        return setState({ ...state, working: false });
      }

      setState({ ...state, cid });
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

  if (state.data && state.data.error) {
    status = 5;
  }

  if (state.working) {
    status = 1;
  }

  let statusElement = null;
  if (status === 1) {
    statusElement = (
      <div className={S.scustomBlack} style={{ marginTop: 48 }}>
        <H3 style={{ marginBottom: 16 }}>Searching...</H3>
        <LoaderSpinner />
      </div>
      // <div className="p-5 rounded-lg flex-col justify-center items-center mt-16 w-10/12">
      //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
      //     Searching...
      //   </Typography>

      //   <LoaderSpinner style={{ borderTop: '2px solid #62EEDD' }} />
      // </div>
    );
  }

  if (status === 2) {
    statusElement = (
      <div className={S.scustomBlack} style={{ marginTop: 48 }}>
        <H3>✅ This CID is verified on Estuary</H3>
        <P style={{ marginTop: 8 }}>Here is more information about this CID that is pinned by Estuary.</P>
      </div>
      // <div className="mt-16 border-2 border-pink-400 bg-lightBlack p-5 rounded-md w-10/12">
      //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16, fontSize: '20px' }}>
      //     ✅ This CID is verified on Estuary
      //   </Typography>

      //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16, fontSize: '16px' }}>
      //     Here is more information about this CID that is pinned by Estuary.
      //   </Typography>
      // </div>
    );
  }

  if (status === 3) {
    statusElement = (
      <div className={S.scustomBlack} style={{ marginTop: 48 }}>
        <H3>Enter a CID</H3>
        <P style={{ marginTop: 8 }}>If this Estuary Node pinned your CID and stored the data on Filecoin, you will be able to find it here.</P>
      </div>
      // <div className="mt-16 border-2 border-pink-600 bg-lightBlack p-5 rounded-md w-10/12">
      //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
      //     Enter a CID
      //   </Typography>

      //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
      //     If this Estuary Node pinned your CID and stored the data on Filecoin, you will be able to find it here.
      //   </Typography>
      // </div>
    );
  }

  if (status === 4) {
    statusElement = (
      <div className={S.scustomBlack} style={{ marginTop: 48 }}>
        <H3>This CID is not found</H3>
        <P style={{ marginTop: 8 }}>It might be pinned by a IPFS Node, you can use the dweb.link URL to check</P>
      </div>
      // <div className="mt-16 bg-light Black p-5 border-2 border-purple-300 rounded-md w-10/12">
      //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
      //     This CID is not found
      //   </Typography>

      //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
      //     It might be pinned by a IPFS Node, you can use the dweb.link URL to check
      //   </Typography>
      // </div>
    );
  }

  if (status === 5) {
    statusElement = (
      <div className={S.scustomBlack} style={{ marginTop: 48 }}>
        <H3>Request Error</H3>
        <P style={{ marginTop: 8 }}>There was an error verifying this CID</P>
        <CodeBlock style={{ marginTop: 8, fontSize: 10 }}>
          {state.data.error.code}: {state.data.error.details}
        </CodeBlock>
      </div>

      // <div className="mt-16 bg-lightBlack p-5  border-2 border-purple-900 rounded-md   max-w-full ">
      //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
      //     Request Error
      //   </Typography>

      //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
      //     There was an error verifying this CID
      //   </Typography>
      //   <Typography variant="h6" style={{ border: '2px solid red', backgroundColor: 'black', color: 'white', marginBottom: 16 }}>
      //     {state.data.error.code}: {state.data.error.details}
      //   </Typography>
      // </div>
    );
  }

  const cid = state.data && state.data.content ? state.data.content.cid : state.cid;
  const estuaryRetrievalUrl = U.formatEstuaryRetrievalUrl(cid);
  const dwebRetrievalUrl = U.formatDwebRetrievalUrl(cid);

  console.log(state);

  return (
    <Page title="Estuary: Verify CID" description={description} url={props.hostname}>
      <Navigation active="INDEX" isAuthenticated={props.viewer} />

      {/* <SingleColumnLayout style={{ textAlign: 'center', marginBottom: 24 }}> */}

      <Container maxWidth="md" sx={{ color: 'white' }}>
        {/* <H1 style={{ margin: '0 auto 0 auto' }}>Verify your CID</H1>
        <P style={{ marginTop: 12, maxWidth: '768px', fontSize: '1.15rem', opacity: '0.7' }}>{description}</P> */}

        <Stack justifyContent="center" alignItems="center" sx={{ p: 4 }}>
          <Typography className="text-5xl font-bold mt-5">Verify your CID</Typography>
          <Typography className="text-2xl font-normal opacity-90 leading-relaxed mt-12 mb-12">{description}</Typography>

          <CssTextField
            label="Type in a CID..."
            id="cid"
            onChange={(e) => {
              const nextState = { ...state, [e.target.name]: e.target.value };
              setState(nextState);
            }}
            value={state.cid}
            inputProps={{ readOnly: state.working }}
            name="cid"
            onSubmit={() => onCheckCID(state, setState, props.api)}
          />

          {/* <div className={S.form}>
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
            /> */}

          {state.data && state.data.content ? (
            <React.Fragment>
              <div className=" w-10/12">
                {statusElement}
                <StatRow title="CID">{state.data.content.cid}</StatRow>
                <StatRow title="Estuary retrieval url">
                  <a className="text-emerald underline" href={estuaryRetrievalUrl} target="_blank">
                    {estuaryRetrievalUrl}
                  </a>
                </StatRow>

                {/* <Typography variant="h6" title="CID" style={{ backgroundColor: '#1A1919', color: 'white', marginBottom: 16 }}>
                  {state.data.content.cid}
                </Typography> */}

                {/* <Link
                  title="Estuary retrieval url"
                  href={estuaryRetrievalUrl}
                  variant="h6"
                  style={{ fontSize: '14px', backgroundColor: '#1A1919', color: 'white', marginBottom: 16 }}
                >
                  {estuaryRetrievalUrl}
                </Link>

                <Link title="Dweb retrieval url" href={dwebRetrievalUrl} variant="h6" style={{ fontSize: '14px', backgroundColor: '#1A1919', color: 'white', marginBottom: 16 }}>
                  {dwebRetrievalUrl}
                </Link> */}

                <StatRow title="Dweb retrieval url">
                  <a className="text-emerald underline" href={dwebRetrievalUrl} target="_blank">
                    {dwebRetrievalUrl}
                  </a>
                </StatRow>
                <StatRow title="Estuary Node ID">{state.data.content.id}</StatRow>

                <StatRow title="Size">
                  {state.data.content.size} bytes ⇄ {U.bytesToSize(state.data.content.size)}
                </StatRow>

                {/*               
                <Typography variant="h6" title="Estuary Node ID" style={{ backgroundColor: '#1A1919', color: 'white', marginBottom: 16 }}>
                  {state.data.content.id}
                </Typography>

                <Typography variant="h6" title="Size" style={{ backgroundColor: '#1A1919', color: 'white', marginBottom: 16 }}>
                  {state.data.content.size} bytes ⇄ {U.bytesToSize(state.data.content.size)}
                </Typography> */}
              </div>
            </React.Fragment>
          ) : U.isEmpty(state.cid) ? (
            statusElement
          ) : (
            <React.Fragment>
              <div className="  w-10/12">
                {statusElement}

                {/* <Link
                  title="Dweb retrieval url"
                  href={dwebRetrievalUrl}
                  variant="h6"
                  style={{
                    border: '2px solid red',
                    fontSize: '14px',
                    backgroundColor: '#1A1919',
                    color: 'white',
                    marginBottom: 16,
                    marginTop: 8,
                    display: 'block',
                  }}
                >
                  {dwebRetrievalUrl}
                </Link>

                <Link
                  title="Estuary retrieval url"
                  href={estuaryRetrievalUrl}
                  variant="h6"
                  style={{ fontSize: '14px', backgroundColor: '#1A1919', color: 'white', marginBottom: 16, display: 'block' }}
                >
                  {estuaryRetrievalUrl}
                </Link> */}

                <StatRow title="Estuary retrieval url">
                  <a className="text-emerald underline" href={estuaryRetrievalUrl} target="_blank">
                    {estuaryRetrievalUrl}
                  </a>
                </StatRow>

                <StatRow title="Dweb retrieval url">
                  <a className="text-emerald underline" href={dwebRetrievalUrl} target="_blank">
                    {dwebRetrievalUrl}
                  </a>
                </StatRow>
              </div>
            </React.Fragment>
          )}

          {state.data && state.data && state.data.deals && state.data.deals.length > 0 ? (
            <React.Fragment>
              <div className={S.scustomBlack} style={{ marginTop: 48 }}>
                <H3>✅ This CID is sealed on Filecoin</H3>
                <P style={{ marginTop: 8 }}>
                  Here are all of the providers that have guaranteed this data is accessible on Filecoin. The integrity of the underlying data is guaranteed by cryptographic proofs
                  for verifiability.
                </P>
              </div>
              {/* <div className="mt-16 border-2 border-red-900 bg-lightBlack p-5 rounded-md w-10/12 ">
                <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
                  ✅ This CID is sealed on Filecoin
                </Typography>

                <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
                  Here are all of the providers that have guaranteed this data is accessible on Filecoin. The integrity of the underlying data is guaranteed by cryptographic proofs
                  for verifiability.
                </Typography>
              </div>
               */}
              {state.data.deals.map((d) => {
                return (
                  // <div key={d.ID} className="mt-16  border-2 border-blue-700 bg-lightBlack p-5 rounded-md w-10/12 ">
                  //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
                  //     {d.miner}{' '}
                  //     <Link
                  //       title="Estuary retrieval url"
                  //       href={`/providers/stats/${d.miner}`}
                  //       target="_blank"
                  //       variant="h6"
                  //       style={{ fontSize: '14px', backgroundColor: '#1A1919', color: 'white', marginBottom: 16 }}
                  //     >
                  //       (view provider)
                  //     </Link>
                  //   </Typography>

                  //   <Typography title="Success date" variant="h6" style={{ color: 'white', marginBottom: 16 }}>
                  //     {U.toDate(d.sealedAt)}
                  //   </Typography>

                  //   <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
                  //     {d.dealId}{' '}
                  //     <Link
                  //       title="Retrieval deal ID"
                  //       href={`/receipts/${d.dealId}`}
                  //       target="_blank"
                  //       variant="h6"
                  //       style={{ fontSize: '14px', backgroundColor: '#1A1919', color: 'white', marginBottom: 16 }}
                  //     >
                  //       (view receipt)
                  //     </Link>
                  //   </Typography>

                  //   <Typography title="CLI retrieval" variant="h6" style={{ color: 'white', marginBottom: 16 }}>
                  //     <RetrievalCommands
                  //       miner={d.miner}
                  //       dealId={d.dealId}
                  //       cid={state.data.content.cid}
                  //       aggregatedIn={state.data.aggregatedIn ? state.data.aggregatedIn.cid : null}
                  //       selector={state.data.selector}
                  //     />
                  //   </Typography>
                  // </div>

                  <div key={d.ID} style={{ marginTop: 16 }}>
                    <StatRow title="Provider">
                      {d.miner}{' '}
                      <a className="text-emerald underline" href={`/providers/stats/${d.miner}`} target="_blank">
                        (view provider)
                      </a>
                    </StatRow>
                    <StatRow title="Success date">{U.toDate(d.sealedAt)}</StatRow>

                    <StatRow title="Retrieval deal ID">
                      {d.dealId}{' '}
                      <a className="text-emerald underline" href={`/receipts/${d.dealId}`} target="_blank">
                        (view receipt)
                      </a>
                    </StatRow>

                    <StatRow title="CLI retrieval">
                      <RetrievalCommands
                        miner={d.miner}
                        dealId={d.dealId}
                        cid={state.data.content.cid}
                        aggregatedIn={state.data.aggregatedIn ? state.data.aggregatedIn.cid : null}
                        selector={state.data.selector}
                      />
                    </StatRow>
                  </div>
                );
              })}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="mt-16 bg-lightBlack p-5 rounded-md w-10/12 ">
                <H3>This data is not on Filecoin</H3>
                <P style={{ marginTop: 8 }}>Check back later to see if we have successfully made deals for this data.</P>
              </div>

              {/* <div className="mt-16 bg-lightBlack   px-4 py-4 rounded-md w-10/12 ">
                <Typography variant="h6" style={{ color: 'white', marginBottom: 16 }}>
                  This data is not on Filecoin
                </Typography>

                <Typography variant="h6" style={{ fontSize: '14px', color: 'white', marginBottom: 16 }}>
                  Check back later to see if we have successfully made deals for this data.
                </Typography>
              </div> */}
            </React.Fragment>
          )}
          {/* </div> */}
        </Stack>
      </Container>
      {/* </SingleColumnLayout> */}
    </Page>
  );
}

export default VerifyCIDPage;
