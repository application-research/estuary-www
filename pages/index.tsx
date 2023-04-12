import styles from '@pages/new-index.module.scss';

import * as React from 'react';
import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as C from '@common/constants';
import * as Logos from '@components/PartnerLogoSVG';

import Navigation from '@components/Navigation';
import Page from '@components/Page';

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
        // const stats = await R.get('/api/v1/stats/info', C.api.metricsHost);
        setStats({ ...stats });
      } catch (e) {
        console.log(e);
      }
    };

    load();
  }, []);

  return (
    <Page title="Estuary" description={description} url={props.hostname}>
      <Navigation active="INDEX" isAuthenticated={props.viewer} />

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
      </section>

      <section className={styles.section}>
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
      </section>

      <section className={styles.section}>
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
      </section>

      <section className={styles.section}>
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
      </section>

      <section className={styles.section}>
        <p className={styles.paragraph}>FAQ</p>

        <Question query="Will Estuary ever charge money?">
          Estuary.tech is free while the service is in development. We will let the public know a year in advance before we charge money for anything you depend on. For now, there
          is no limit to uploads, but for each file there is a 32 GiB max size. Check out{' '}
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
          platform on top of Filecoin, we're going to wait until we are feature complete to fully launch. This includes smaller features like Metamask authentication, and bigger
          features like provisioning our infrastructure for users who need dedicated resources. Check out our{' '}
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
        </Question>

        <p className={styles.paragraph}>
          If you choose to use Estuary you agree to our{' '}
          <a href="https://docs.estuary.tech/terms" target="_blank">
            Terms of Service
          </a>
          .
        </p>
      </section>
    </Page>
  );
}

export default IndexPage;
