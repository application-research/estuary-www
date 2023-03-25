import styles from '@pages/new-index.module.scss';

import * as React from 'react';
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as C from '@common/constants';
import * as Logos from '@components/PartnerLogoSVG';
import { Link, Box, Container, Stack, Tabs, Typography, AppBar, Grid, Paper } from '@mui/material';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';

import Navigation from '@components/Navigation';
import Page from '@components/Page';
import HomeHero from '@root/components/HomeHero';
import { log } from 'console';
import { styled } from '@mui/material/styles';
import { codeStyle } from './utils/codeStyle';
import { alpha } from '@mui/material/styles';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { HomeFaqs } from '@root/components/home-faqs';

import Footer from '../components/footer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DataStore from '@root/components/DataStore';
import { Fade, Slide } from 'react-awesome-reveal';

const curl = `curl -L -X POST 'https://api.estuary.tech/content/add' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_API_KEY' \
-F 'data=@"/path/to/file"'`;

const node = `const https = require("https");
const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");

const key = \`YOUR_API_KEY\`;

var form = new FormData();
const path = \`\$\{__dirname\}/YOUR_FILE_ON_YOUR_COMPUTER.mp4\`;
form.append("data", fs.createReadStream(path));

const headers = form.getHeaders();
console.log(headers);

fetch("https://upload.estuary.tech/content/add", {
  method: "POST",
  body: form,
  headers: {
    Authorization: \`Bearer $\{key\}\`,
    ...headers,
  },
})
  .then(function(res) {
    return res.json();
  })
  .then(function(json) {
    console.log(json);
  });
`;

const browser = `const formData = new FormData();

const { data } = THE_SOURCE_OF_YOUR_FILE_FROM_INPUT;

formData.append('data', data, data.filename);

let xhr = new XMLHttpRequest();

let targetURL = "https://upload.estuary.tech/content/add";

xhr.open('POST', targetURL);
xhr.setRequestHeader('Authorization', \`Bearer \$\{YOUR_API_KEY\}\`);
xhr.send(formData);`;

const go = `package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {
  url := "https://upload.estuary.tech/content/add"
  method := "POST"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)
  req.Header.Add("Authorization", "Bearer YOUR_API_KEY")
  req.Header.Add("Accept", "application/json")
  res, err := client.Do(req)
  defer res.Body.Close()
  body, err := ioutil.ReadAll(res.Body)
  fmt.Println(string(body))
}`;

const python = `import requests

url = "https://upload.estuary.tech/content/add"

payload={}
headers = {
  'Accept': 'application/json'
  'Authorization': 'Bearer YOUR_API_KEY'
}

response = requests.request("POST", url, headers=headers, data=payload)`;

const retrieve = `lotus client retrieve --miner MINER_ID DATA_CID OUTPUT_FILE_NAME`;

const mainPrimary = `#0BFF48`;
const darkGreen = `#0A7225`;
const lightBlack = `#0C0B0B`;

const Tab = styled(TabUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px;
  margin: 6px 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #0c0b0b;
  }

  &:focus {
    color: #fff;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: ${mainPrimary};

    color: #1a1919;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  background-color: #1a1919;

  border-radius: 12px;
  color: #fff;
`;

// box-shadow: 0px 4px 8px grey;
const TabsList = styled(TabsListUnstyled)(
  ({ theme }) => `
  min-width: 400px;
  background-color: #1A1919;
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 4px #0BFF48;
  `
);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Protocols = [
  { name: 'encloud', image: 'https://user-images.githubusercontent.com/28320272/221002893-555c3532-77b0-4110-aed7-68acef95f03a.png', link: 'https://encloud.tech/' },
  { name: 'clubnft', image: 'https://user-images.githubusercontent.com/28320272/221002481-9c645e32-44c9-4676-bdd3-3a9a58de4743.svg', link: 'https://www.clubnft.com/' },
  { name: 'bacalau', image: 'https://user-images.githubusercontent.com/28320272/202938869-73f5fcc1-7d0c-4e4c-b2d0-bd1d62ceac39.png', link: 'https://www.bacalhau.org/' },
  { name: 'opsci', image: 'https://user-images.githubusercontent.com/28320272/202937956-0c12b60d-8a38-4e9b-9749-3420598276f8.png', link: 'https://opsci.io/' },
  { name: 'cancer', image: 'https://user-images.githubusercontent.com/28320272/202939283-c78969dd-2f06-42dd-8823-cb6d23ff3818.png', link: 'https://www.cancerimagingarchive.net/' },
  { name: 'GreenFilecoin', image: 'https://user-images.githubusercontent.com/28320272/202937974-6d191fae-264f-40b0-b18e-3071b8009802.png', link: 'https://green.filecoin.io/' },
  { name: 'labDao', image: 'https://user-images.githubusercontent.com/28320272/202940852-dda0b5d6-7bb4-4ea3-9c86-ec6bc6286104.svg', link: 'https://www.labdao.xyz/' },
  { name: 'HashAxis', image: 'https://user-images.githubusercontent.com/28320272/202942456-d921ed27-c0c1-4d9e-98ae-f0189e740bc1.svg', link: 'https://hashaxis.com/' },
  { name: 'gitopia', image: 'https://user-images.githubusercontent.com/28320272/202940154-8c54b568-70cd-4063-b21d-38aee052a063.png', link: 'https://gitopia.com/' },
  { name: 'sxxFuture', image: 'https://user-images.githubusercontent.com/28320272/204052332-56be823b-b058-4232-96a5-ef3d569dcc56.png', link: 'https://sxxfuture.com/' },
  { name: 'web3Mint', image: 'https://user-images.githubusercontent.com/28320272/203404877-791e53c6-7ec6-48b6-960a-f65c4aa46e29.png', link: 'https://w3bmint.xyz/' },
  { name: 'VividLabs', image: 'https://user-images.githubusercontent.com/310223/156037345-f93054de-d222-47e9-9653-cd957fc0fcc5.svg', link: 'https://www.vividlabs.com/' },
  { name: 'appGala', image: 'https://user-images.githubusercontent.com/28320272/202942649-b7237e6a-4c38-487a-b167-07a3833917a5.png', link: 'https://app.gala.games/' },
  { name: 'openData', image: 'https://user-images.githubusercontent.com/28320272/203404943-0d4d5e2f-195b-4b1e-ab2b-e88fae6a3aac.png', link: 'https://opendata.cityofnewyork.us/' },
  { name: 'chainsafe', image: 'https://user-images.githubusercontent.com/28320272/202939033-a899fadf-5438-44d4-aa09-1c76e660072c.png', link: 'https://chainsafe.io/' },
  { name: 'glif', image: 'https://user-images.githubusercontent.com/28320272/203406224-c17a8fd5-fae9-49a0-97c9-3ebf4e704d4f.png', link: 'https://wallet.glif.io/' },
  { name: 'kodaot', image: 'https://user-images.githubusercontent.com/28320272/203411306-01912ea7-9503-4d6a-9501-e243c7123d89.png', link: 'https://kodadot.xyz/' },
  { name: 'Archive', image: 'https://user-images.githubusercontent.com/28320272/203411654-adf169fb-0493-446a-8393-19d932d93618.png', link: 'https://archive.org/' },
  { name: 'sendata', image: 'https://user-images.githubusercontent.com/28320272/212118753-fed66bc4-2b7d-4682-ac99-f86ab2ea37f6.png', link: 'https://www.sendata.io/' },
  {
    name: 'nbsPool',
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMUAAAA7CAMAAAD8fr6rAAACfFBMVEVHcEz///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////88FegUAAAA03RSTlMAEDDgIGDwgEDAcFCQoNABCQKwBCLuMv7XAzPW7X79Q1sYREeDiidUFAw4vDy2BynG6yHfiXdIFblF6sf68Z6W9lH86S6PdhuOQR7LPQtk92gWwW8GhDdc4av7yYdsxVXeWU8rE/inaW6lI5V9NTkOqBw7LZ8RbY0k7CYlmE2Byk7RtefkVqJYrYZrc0bZGposzw+ySUrO3bS3DTTaL/OUYmOk4q/TnCq4dbuFzXy/GReCeq4Km4yXP+WsYTpLk1qz5gWxuuP03PKZ79jbPtVdHX8o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',
    link: 'https://nbfspool.com/#/',
  },
];

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

const description = 'Use any browser and our API to store public data on IPFS and Filecoin.';

function Question(props: any) {
  return (
    <div className={styles.question}>
      <div className={styles.questionQuery}>{props.query}</div>
      <div className={styles.answer}>{props.children}</div>
    </div>
  );
}

function IndexPage(props: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imagesContainerRef = useRef(null);

  const [selected, setSelected] = React.useState(1);
  const [stats, setStats] = React.useState({
    dealsOnChain: 137752,
    totalBytesUploaded: 87817919,
    totalFilesStored: 87817919,
    totalObjectsRef: 2835708131,
    totalStorage: 456545754350356,
    totalStorageMiner: 215,
    totalUsers: 778,
  });

  const codeMap = { 1: curl, 2: node, 3: browser, 4: go, 5: python };
  const codeText = codeMap[`${selected}`];

  React.useEffect(() => {
    const load = async () => {
      try {
        const stats = await R.get('/api/v1/stats/info', C.api.metricsHost);
        setStats({ ...stats });
      } catch (e) {
        console.log(e);
      }
    };

    load();
  }, []);

  // console.log('props.viewer: ', props.viewer);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let settings = {
    infinite: true,
    dots: false,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    speed: 5000,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    cssEase: 'linear',
    nextArrow: <></>,
    prevArrow: <></>,
  };

  return (
    <Box
      sx={{
        backgroundColor: lightBlack,
        position: 'relative',
      }}
    >
      <Navigation active="INDEX" isAuthenticated={props.viewer} />
      <Container maxWidth="lg">
        <Page title="Estuary" description={description} url={props.hostname}>
          <Fade cascade damping={0.3} triggerOnce={true}>
            <div
              className=" h-40 bg-secondary rounded-xl w-56 absolute 
              top-[2%] right-0 -mr-24 blur-custom  z-10 opacity-100  "
            ></div>
            <div className=" h-40  bg-darkGreen rounded-xl w-56 absolute top-[20%] left-0  blur-custom z-10 opacity-100  "></div>

            <HomeHero />

            <div className="flex justify-evenly items-center relative h-85 ">
              <div className="w-1/2 absolute top-0 left-0 ">
                <h1 className="text-4xl mb-8 font-semibold">Estuary is free with an invite</h1>
                <h1 className="text-xl text-gray-400">Get an Api key first and get started</h1>
              </div>

              <div className="w-1/2 absolute top-0 right-0 ">
                <TabsUnstyled defaultValue={0}>
                  <TabsList>
                    <Tab>Node</Tab>
                    <Tab>Python</Tab>
                    <Tab>Browser</Tab>
                    <Tab>Go</Tab>
                    <Tab>Curl</Tab>
                  </TabsList>

                  <TabPanel value={0}>
                    <SyntaxHighlighter language="javascript" style={codeStyle} className="">
                      {node}
                    </SyntaxHighlighter>
                  </TabPanel>
                  <TabPanel value={1}>
                    <SyntaxHighlighter language="javascript" style={codeStyle}>
                      {python}
                    </SyntaxHighlighter>
                  </TabPanel>
                  <TabPanel value={2}>
                    <SyntaxHighlighter language="javascript" style={codeStyle}>
                      {browser}
                    </SyntaxHighlighter>
                  </TabPanel>
                  <TabPanel value={3}>
                    <SyntaxHighlighter language="javascript" style={codeStyle}>
                      {go}
                    </SyntaxHighlighter>
                  </TabPanel>
                  <TabPanel value={4}>
                    <SyntaxHighlighter language="javascript" style={codeStyle}>
                      {curl}
                    </SyntaxHighlighter>
                  </TabPanel>
                </TabsUnstyled>
              </div>
            </div>
          </Fade>

          <Fade cascade damping={0.2} triggerOnce={true}>
            <Typography variant="h4" component="h1" className="text-4xl mb-16 font-semibold mt-28 ">
              Estuary is used By
            </Typography>
            <Slider {...settings}>
              {Protocols.map((slide, index) => (
                <div key={index}>
                  <Link href={slide.link} target="_blank">
                    <img src={slide.image} width="200rem" height="7vh" style={{ objectFit: 'contain' }} />
                  </Link>
                </div>
              ))}
            </Slider>

            <DataStore />

            <Box
              sx={{
                color: 'white',

                mt: 10,
                mb: 10,
              }}
            >
              <Container maxWidth="lg" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '32px', fontWeight: 'bold' }}>
                  Okay , but how much data has been uploaded using your service ?
                </Typography>

                <Box
                  sx={{
                    background: '#070707',
                    px: 1,
                    py: 4,
                    mt: 5,
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '16px',
                    boxShadow: `0px 4px 4px ${mainPrimary}`,
                  }}
                  className=" border-2 border-secondary "
                >
                  <Stack direction="column" spacing={3} sx={{ ml: 10 }} className=" lg:ml-24 ml-4">
                    <Stack direction="row" spacing={6} sx={{}}>
                      <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px', fontWeight: 'medium', width: '39rem' }}>
                        successful Filecoin storage deals
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ boxShadow: `0px 4px 4px ${mainPrimary}` }}
                        className="    h-10   text-white border-2 rounded-sm border-secondary bg-black  px-6 py-1 text-lg font-bold"
                      >
                        {stats.dealsOnChain.toLocaleString('en-US')}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={6} sx={{}}>
                      <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px', fontWeight: 'medium', width: '39rem' }}>
                        total objects retrievable through any IPFS gateway.
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ boxShadow: `0px 4px 4px ${mainPrimary}` }}
                        className="  h-10  text-white border-2 rounded-sm border-secondary bg-black   px-6 py-1 text-lg font-bold"
                      >
                        {stats.totalObjectsRef.toLocaleString('en-US')}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={6} sx={{}}>
                      <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px', fontWeight: 'medium', width: '39rem' }}>
                        total objects uploaded to Filecoin.
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ boxShadow: `0px 4px 4px ${mainPrimary}` }}
                        className="  h-10  text-white border-2 rounded-sm border-secondary bg-black   px-6 py-1 text-lg font-bold"
                      >
                        {Number(stats.totalObjectsRef * 6).toLocaleString('en-US')}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={6} sx={{}}>
                      <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px', fontWeight: 'medium', width: '39rem' }}>
                        total pinned data retrievable from any IPFS gateway.
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ boxShadow: `0px 4px 4px ${mainPrimary}` }}
                        className="lg:h-12 h-16 text-white border-2 rounded-sm border-secondary bg-black   px-6 py-1 text-lg font-bold"
                      >
                        {U.bytesToSize(stats.totalStorage)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={6} sx={{}}>
                      <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px', fontWeight: 'medium', width: '39rem' }}>
                        total data backed up to Filecoin.
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ boxShadow: `0px 4px 4px ${mainPrimary}` }}
                        className="lg:h-12 h-16   text-white border-2 rounded-sm border-secondary bg-black   px-6 py-1 text-lg font-bold"
                      >
                        {U.bytesToSize(stats.totalStorage * 6)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={6} sx={{}}>
                      <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px', fontWeight: 'medium', width: '39rem' }}>
                        storage providers work with us to achieve these goals.
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ boxShadow: `0px 4px 4px ${mainPrimary}` }}
                        className="  h-10  text-white border-2 rounded-sm border-secondary bg-black   px-6 py-1 text-lg font-bold"
                      >
                        {stats.totalStorageMiner}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={6} sx={{}}>
                      <Typography variant="body2" sx={{ color: 'white', px: 2, mt: '6px', fontSize: '20px', fontWeight: 'medium', width: '39rem' }}>
                        products, including the ones above, use Filecoin through Estuary.
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ boxShadow: `0px 4px 4px ${mainPrimary}` }}
                        className="  h-10  text-white border-2 rounded-sm border-secondary bg-black   px-6 py-1 text-lg font-bold"
                      >
                        {stats.totalUsers}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Container>
            </Box>

            <HomeFaqs />
          </Fade>
        </Page>
      </Container>
      <Footer />
    </Box>
  );
}

export default IndexPage;

{
  /*    
      <section className={styles.section}>
        <p className={styles.paragraph}>
          How easy is it for developers to upload data to Filecoin? <span>As easy as copy and paste. However you do need an API key.</span>
        </p>

        <div className={styles.tabs}>
          <div className={styles.tab} onClick={() => setSelected(1)} style={selected !== 1 ? { background: `rgba(0, 0, 0, 0.2)` } : null}>
            CURL
          </div>
          <div className={styles.tab} onClick={() => setSelected(2)} style={selected !== 2 ? { background: `rgba(0, 0, 0, 0.2)` } : null}>
            NODE
          </div>
          <div className={styles.tab} onClick={() => setSelected(3)} style={selected !== 3 ? { background: `rgba(0, 0, 0, 0.2)` } : null}>
            BROWSER
          </div>
          <div className={styles.tab} onClick={() => setSelected(4)} style={selected !== 4 ? { background: `rgba(0, 0, 0, 0.2)` } : null}>
            GO
          </div>
          <div className={styles.tab} onClick={() => setSelected(5)} style={selected !== 5 ? { background: `rgba(0, 0, 0, 0.2)` } : null}>
            PYTHON
          </div>
        </div>

        <pre className={styles.code}>{codeText}</pre>

        <p className={styles.paragraph}>
          Do you have public domain data? Want to try it yourself? <span>Estuary is free with an invite. Get an invite, and then you can get an API key.</span>
        </p>

        <div className={styles.action}>
          <a className={styles.actionButton} href="https://docs.estuary.tech/get-invite-key">
            Get an invite
          </a>

          <a className={styles.actionButton} href="https://docs.estuary.tech">
            Learn more
          </a>
        </div>
      </section> */
}

{
  /* <section className={styles.section}>
            <p className={styles.paragraph}>Who used Estuary to store their data on Filecoin?</p>

            <div className={styles.logos}>
              <div className={styles.logoColumn}>
                <div className={styles.logoBox}>
                  <Logos.Zora height="35px" className={styles.logo} />
                </div>
              </div>
              <div className={styles.logoColumn}>
                <div className={styles.logoBox}>
                  <Logos.Portrait height="35px" className={styles.logo} />
                </div>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://www.sendata.io/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/212118753-fed66bc4-2b7d-4682-ac99-f86ab2ea37f6.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <div className={styles.logoBox}>
                  <Logos.NBFS height="30px" width="160px" className={styles.logo} />
                </div>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://archive.org/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/203411654-adf169fb-0493-446a-8393-19d932d93618.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://kodadot.xyz/" target="_blank">
                  <img height="60vh" src="https://user-images.githubusercontent.com/28320272/203411306-01912ea7-9503-4d6a-9501-e243c7123d89.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://wallet.glif.io/" target="_blank">
                  <img height="80vh" src="https://user-images.githubusercontent.com/28320272/203406224-c17a8fd5-fae9-49a0-97c9-3ebf4e704d4f.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://chainsafe.io/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202939033-a899fadf-5438-44d4-aa09-1c76e660072c.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://opendata.cityofnewyork.us/" target="_blank">
                  <img height="80vh" src="https://user-images.githubusercontent.com/28320272/203404943-0d4d5e2f-195b-4b1e-ab2b-e88fae6a3aac.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://app.gala.games/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202942649-b7237e6a-4c38-487a-b167-07a3833917a5.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://www.vividlabs.com/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/310223/156037345-f93054de-d222-47e9-9653-cd957fc0fcc5.svg" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://w3bmint.xyz/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/203404877-791e53c6-7ec6-48b6-960a-f65c4aa46e29.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://sxxfuture.com/" target="_blank">
                  <img height="35vh" src="https://user-images.githubusercontent.com/28320272/204052332-56be823b-b058-4232-96a5-ef3d569dcc56.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://gitopia.com/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202940154-8c54b568-70cd-4063-b21d-38aee052a063.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://hashaxis.com/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202942456-d921ed27-c0c1-4d9e-98ae-f0189e740bc1.svg" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://www.labdao.xyz/" target="_blank">
                  <img height="45vh" src="https://user-images.githubusercontent.com/28320272/202940852-dda0b5d6-7bb4-4ea3-9c86-ec6bc6286104.svg" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://green.filecoin.io/" target="_blank">
                  <img height="70vh" src="https://user-images.githubusercontent.com/28320272/202937974-6d191fae-264f-40b0-b18e-3071b8009802.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://www.cancerimagingarchive.net/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202939283-c78969dd-2f06-42dd-8823-cb6d23ff3818.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://opsci.io/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202937956-0c12b60d-8a38-4e9b-9749-3420598276f8.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://www.bacalhau.org/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202938869-73f5fcc1-7d0c-4e4c-b2d0-bd1d62ceac39.png" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://www.clubnft.com/" target="_blank">
                  <img height="45vh" src="https://user-images.githubusercontent.com/28320272/221002481-9c645e32-44c9-4676-bdd3-3a9a58de4743.svg" />
                </a>
              </div>
              <div className={styles.logoColumn}>
                <a className={styles.logoBox} href="https://encloud.tech/" target="_blank">
                  <img height="100vh" src="https://user-images.githubusercontent.com/28320272/221002893-555c3532-77b0-4110-aed7-68acef95f03a.png" />
                </a>
              </div>
            </div>
          </section> */
}

{
  /* <Question query="Will Estuary ever charge money?">
              Estuary.tech is free while the service is in development. We will let the public know a year in advance before we charge money for anything you depend on. For now,
              there is no limit to uploads, but for each file there is a 32 GiB max size. Check out{' '}
              <a href="https://storage.market" target="_blank">
                https://storage.market
              </a>{' '}
              to see how our price compares to other Web2 and Web3 products.
            </Question>

            <Question query="Is there an upload limit?">For now, there is no limit to uploads, but for each file there is a 32 GiB max size.</Question>

            <Question query="Does Estuary use Filecoin?">Yes, we store your data on Filecoin across 6 storage providers per file.</Question>

            <Question query="Will I be able to pay you for namespaced or dedicated infrastructure?">
              Yes, check out our{' '}
              <a href="https://fw.services" target="_blank">
                roadmap
              </a>
              .
            </Question>

            <Question query="Why are you in alpha?">
              Waiting for the{' '}
              <a href="https://fvm.filecoin.io" target="_blank">
                FVM
              </a>{' '}
              launch and Filecoin retrievals to work in the Filecoin Ecosystem. Because we aim to be a complete kitchen sink example of how to build a data onboarding service and
              platform on top of Filecoin, we're going to wait until we are feature complete to fully launch. This includes smaller features like Metamask authentication, and
              bigger features like provisioning our infrastructure for users who need dedicated resources. Check out our{' '}
              <a href="https://fw.services" target="_blank">
                roadmap
              </a>
              .
            </Question>

            <Question query="Wait are you a pinning service or not?">
              Estuary.tech provides storage through{' '}
              <a target="_blank" href="https://proto.school/content-addressing">
                immutable content address pinning
              </a>
              . This is just like any <a href="https://github.com/ipfs/kubo">IPFS Node</a>, or popular services like <a href="https://www.pinata.cloud/">Pinata</a> and{' '}
              <a href="https://web3.storage/" target="_blank">
                Web3 Storage
              </a>
              .
            </Question>

            <Question query="Wait I need to prove that I used Filecoin for a grant I have, how do I do this with Estuary?">
              All deals have receipts before and after getting on chain. Every piece of data gets uploaded to Filecoin six times. See the example of a{' '}
              <a href="https://estuary.tech/verify-cid?cid=QmPBHAjRLZqvJwcBUTiVxNtvugToAnTyJxpzTCgKZVHsvw" target="_blank">
                storage deal receipt
              </a>
              . Each Receipt has instructions of how to retrieve.
            </Question>

            <Question query="How is your uptime?">
              It needs improvement, check out{' '}
              <a href="https://status.estuary.tech/" target="_blank">
                BetterUptime
              </a>{' '}
              for more stats. We are doing better than 94% for most of our services.
            </Question>

            <Question query="Is Estuary open source?">
              Every single line, check out{' '}
              <a href="https://github.com/application-research" target="_blank">
                GitHub
              </a>
              . We also encourage you to run your own Estuary node and rename it to provide your own service.
            </Question>

            <Question query="Wait, I can run my own Estuary.tech?">
              Yes you just need to fork{' '}
              <a href="https://github.com/application-research/estuary" target="_blank">
                Estuary
              </a>{' '}
              and{' '}
              <a href="https://github.com/application-research/estuary-www" target="_blank">
                Estuary-WWW
              </a>{' '}
              and rename everything and you're good to go! You can do everything we can do.
            </Question>

            <Question query="Can I talk to you or provide feedback?">
              We are available 24/7 in the <a href="https://filecoin.io/slack">Filecoin Slack</a>. Join the #ecosystem-dev channel. Or give us feedback through this{' '}
              <a href="https://docs.estuary.tech/give-feedback" target="_blank">
                form
              </a>{' '}
              here.
            </Question>

            <Question query="What else should I know?">
              You can follow us on{' '}
              <a href="https://www.twitter.com/estuary_tech" target="_blank">
                Twitter
              </a>
              !
            </Question> */
}

{
  /* <p className={styles.paragraph}>
            If you choose to use Estuary you agree to our{' '}
            <a href="https://docs.estuary.tech/terms" target="_blank">
              Terms of Service
            </a>
            .
          </p> */
}
{
  /* </section> */
}

{
  /* <section className={styles.section}>
            <p className={styles.paragraph}>Okay, but how much data has been uploaded using your service?</p>

            <ul className={styles.statsList}>
              <li className={styles.statsListItem}>
                <strong>{stats.dealsOnChain.toLocaleString('en-US')}</strong> successful Filecoin storage deals.
              </li>
              <li className={styles.statsListItem}>
                <strong>{stats.totalObjectsRef.toLocaleString('en-US')}</strong> total objects retrievable through any IPFS gateway.
              </li>
              <li className={styles.statsListItem}>
                <strong>{Number(stats.totalObjectsRef * 6).toLocaleString('en-US')}</strong> total objects uploaded to Filecoin.
              </li>
              <li className={styles.statsListItem}>
                <strong>{U.bytesToSize(stats.totalStorage)}</strong> total pinned data retrievable from any IPFS gateway.
              </li>
              <li className={styles.statsListItem}>
                <strong>{U.bytesToSize(stats.totalStorage * 6)}</strong> total data backed up to Filecoin.
              </li>
              <li className={styles.statsListItem}>
                <strong>{stats.totalStorageMiner}</strong> storage providers work with us to achieve these goals.
              </li>
              <li className={styles.statsListItem}>
                <strong>{stats.totalUsers}</strong> products, including the ones above, use Filecoin through Estuary.
              </li>
            </ul>
          </section> */
}
{
  /* <section className={styles.section}>
            <p className={styles.paragraph}>
              So when you upload your data, it goes to 7 places for 540 days!{' '}
              <span>After those days our machine will renew again for another 540 days. It is like permanent storage.</span>
            </p>

            <div className={styles.action}>
              <div className={styles.card}>
                <div className={styles.cardTitle}>Our Estuary IPFS node</div>
                <div className={styles.cardParagraph}>This is like a hot cache! You can retrieve your data from any public IPFS gateway.</div>
                <div className={styles.cardParagraph}>
                  Pinning example:{' '}
                  <a target="_blank" href="https://shuttle-1.estuary.tech/gw/ipfs/QmPBHAjRLZqvJwcBUTiVxNtvugToAnTyJxpzTCgKZVHsvw/">
                    https://shuttle-1.estuary.tech/gw/ipfs/QmPBHAjRLZqvJwcBUTiVxNtvugToAnTyJxpzTCgKZVHsvw/
                  </a>
                </div>
                <div className={styles.cardParagraph}>
                  Receipt example:{' '}
                  <a target="_blank" href="https://estuary.tech/verify-cid?cid=QmPBHAjRLZqvJwcBUTiVxNtvugToAnTyJxpzTCgKZVHsvw">
                    https://estuary.tech/verify-cid?cid=QmPBHAjRLZqvJwcBUTiVxNtvugToAnTyJxpzTCgKZVHsvw
                  </a>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Filecoin Storage Provider #1</div>
                <div className={styles.cardParagraph}>
                  Example:{' '}
                  <a target="_blank" href="https://estuary.tech/providers/stats/f01345523">
                    https://estuary.tech/providers/stats/f01345523
                  </a>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Filecoin Storage Provider #2</div>
                <div className={styles.cardParagraph}>
                  Example:{' '}
                  <a target="_blank" href="https://estuary.tech/providers/stats/f01392893">
                    https://estuary.tech/providers/stats/f01392893
                  </a>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Filecoin Storage Provider #3</div>
                <div className={styles.cardParagraph}>
                  Example:{' '}
                  <a target="_blank" href="https://estuary.tech/providers/stats/f022352">
                    https://estuary.tech/providers/stats/f022352
                  </a>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Filecoin Storage Provider #4</div>
                <div className={styles.cardParagraph}>
                  Example:{' '}
                  <a target="_blank" href="https://estuary.tech/providers/stats/f01096124">
                    https://estuary.tech/providers/stats/f01096124
                  </a>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Filecoin Storage Provider #5</div>
                <div className={styles.cardParagraph}>
                  Example:{' '}
                  <a target="_blank" href="https://estuary.tech/providers/stats/f01199442">
                    https://estuary.tech/providers/stats/f01199442
                  </a>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardTitle}>Filecoin Storage Provider #6</div>
                <div className={styles.cardParagraph}>
                  Example:{' '}
                  <a target="_blank" href="https://estuary.tech/providers/stats/f0763337">
                    https://estuary.tech/providers/stats/f0763337
                  </a>
                </div>
              </div>
            </div>
          </section> */
}

{
  /* <section className={styles.section}>
            <p className={styles.paragraph}>FAQ</p> */
}
