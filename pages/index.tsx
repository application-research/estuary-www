import styles from '@pages/new-index.module.scss';

import * as React from 'react';
import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as C from '@common/constants';

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

  const codeMap = { 1: curl, 2: node, 3: browser, 4: go, 5: python };
  const codeText = codeMap[`${selected}`];

  return (
    <Page title="Estuary" description={description} url={props.hostname}>
      <Navigation active="INDEX" isAuthenticated={props.viewer} />

      <section className={styles.section}>
        <p className={styles.paragraph}>
          How easy is it for developers to upload data to Filecoin through Estuary? <span>As easy as copy and paste. However you do need an API key.</span>
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

        <p className={styles.paragraph} style={{ fontSize: 16 }}>
          If you have an account you can use Estuary until you hit your size limit, otherwise the service is closed off to sign ups. Thanks for using us.
        </p>
      </section>
    </Page>
  );
}

export default IndexPage;
