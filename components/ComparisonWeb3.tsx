import styles from '@components/Comparison.module.scss';
import tstyles from '@pages/table.module.scss';
import Link from 'next/link';

function ComparisonWeb3(props: any) {
  return (
    <div className={styles.container} style={props.style}>
      <table className={tstyles.table}>
        <tbody className={tstyles.tbody}>
          <tr className={tstyles.tr}>
            <th className={tstyles.th} style={{ width: '30%' }}>
              Feature
            </th>
            <th className={tstyles.th} style={{ width: '30%' }}>
              https://estuary.tech
            </th>
            <th className={tstyles.th} style={{ width: '30%' }}>
              Web3 Storage
            </th>
            <th className={tstyles.th} style={{ width: '30%' }}>
              NFT Storage
            </th>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Marketing tagline</strong>
            </td>

            <td className={tstyles.td}>Use any browser or our API to store public data on IPFS and Filecoin</td>

            <td className={tstyles.td}>Build apps backed by Filecoin, no infrastructure required</td>

            <td className={tstyles.td}>A brand new service in BETA, built specifically for storing off-chain NFT data</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Requires you to run infrastructure</strong>
            </td>

            <td className={tstyles.td}>No</td>

            <td className={tstyles.td}>No</td>

            <td className={tstyles.td}>No</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Maximum file size</strong>
            </td>

            <td className={tstyles.td}>Unlimited, or as much as the infrastructure has the hardware for</td>

            <td className={tstyles.td}>Potentially 32GB</td>

            <td className={tstyles.td}>Potentially 32GB</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Uses Amazon S3</strong>
            </td>

            <td className={tstyles.td}>No</td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Uses Cloudflare</strong>
            </td>

            <td className={tstyles.td}>No</td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Documentation</strong>
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Live code documentation</strong>
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>No</td>

            <td className={tstyles.td}>No</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Uses IPFS Cluster</strong>
            </td>

            <td className={tstyles.td}>No, however Estuary's shuttle system serves the same function.</td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Requires API key</strong>
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>GUI</strong>
              <br />
              <br />
              All of these products have a website you can visit. You can use the website to upload files and view your files.
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Admin GUI</strong>
              <br />
              <br />
              Manage storage providers, users, and content to offload per node.
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>No</td>

            <td className={tstyles.td}>No</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>CAR support</strong>
            </td>

            <td className={tstyles.td}>Yes, optional</td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>No</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Invite only</strong>
            </td>

            <td className={tstyles.td}>Yes, users must apply</td>

            <td className={tstyles.td}>No, anyone can use Web3 Storage</td>

            <td className={tstyles.td}>No, anyone can use NFT Storage</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Programming language requirement</strong>
            </td>

            <td className={tstyles.td}>Any</td>

            <td className={tstyles.td}>JavaScript/TypeScript</td>

            <td className={tstyles.td}>JavaScript/TypeScript</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Public feedback form</strong>
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>No</td>

            <td className={tstyles.td}>No</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>NPM module required</strong>
            </td>

            <td className={tstyles.td}>No, there is no NPM module</td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>No, optional</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Command line support</strong>
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Yes</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>NFT education and support</strong>
            </td>

            <td className={tstyles.td}>Partial</td>

            <td className={tstyles.td}>Partial</td>

            <td className={tstyles.td}>Yes</td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <table className={tstyles.table}>
        <tbody className={tstyles.tbody}>
          <tr className={tstyles.tr}>
            <th className={tstyles.th} style={{ width: '30%' }}>
              Feature
            </th>
            <th className={tstyles.th} style={{ width: '30%' }}>
              Any Estuary Node
            </th>
            <th className={tstyles.th} style={{ width: '30%' }}>
              Web3 Storage
            </th>
            <th className={tstyles.th} style={{ width: '30%' }}>
              NFT Storage
            </th>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Offline deals</strong>
            </td>

            <td className={tstyles.td}>No</td>

            <td className={tstyles.td}>Yes, in testing</td>

            <td className={tstyles.td}>Yes, in testing</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Filecoin address and payment automation for deals</strong>
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>No</td>

            <td className={tstyles.td}>No</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Makes Filecoin storage deals</strong>
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>Uses Estuary, Textile's BidBot and other promising options in development</td>

            <td className={tstyles.td}>Uses Estuary, Textile's BidBot and other promising options in development</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Makes Filecoin retrieval deals</strong>
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>-</td>

            <td className={tstyles.td}>-</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Aggregates smaller files into Filecoin storage deals for providers</strong>
            </td>

            <td className={tstyles.td}>Yes, batches into 4GB deals.</td>

            <td className={tstyles.td}>-</td>

            <td className={tstyles.td}>-</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Filecoin deal replication</strong>
            </td>

            <td className={tstyles.td}>6x providers out of 98 options (Sept 1st, 2021)</td>

            <td className={tstyles.td}>-</td>

            <td className={tstyles.td}>-</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Provider deal logs and history</strong>
              <br />
              <br />
              Logs around deal success, errors, ask, lotus version, and other useful information.
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>-</td>

            <td className={tstyles.td}>-</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Provider profile pages</strong>
              <br />
              <br />
              Example:{' '}
              <Link href="/providers/stats/f02620" target="_blank">
                here
              </Link>
              .
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>-</td>

            <td className={tstyles.td}>-</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Tools to verify data is actually on Filecoin</strong>
              <br />
              <br />
              Example:{' '}
              <Link href="/verify-cid?cid=QmVrrF7DTnbqKvWR7P7ihJKp4N5fKmBX29m5CHbW9WLep9" target="_blank">
                here
              </Link>
              .
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>-</td>

            <td className={tstyles.td}>-</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Reputation system</strong>
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>-</td>

            <td className={tstyles.td}>-</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Run your own deal maker / node</strong>
              <br />
              <br />
              Can you run your own version of the entire platform / software?
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>-</td>

            <td className={tstyles.td}>-</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Provider control</strong>
              <br />
              <br />
              Can the provider control whether or not they will be sent deals? Can an administrator suspend providers temporarily?
            </td>

            <td className={tstyles.td}>Yes</td>

            <td className={tstyles.td}>-</td>

            <td className={tstyles.td}>-</td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Maximum deal piece size</strong>
            </td>

            <td className={tstyles.td}>32GB</td>

            <td className={tstyles.td}>-</td>

            <td className={tstyles.td}>-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonWeb3;
