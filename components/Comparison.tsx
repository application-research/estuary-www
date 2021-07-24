import styles from '@components/Comparison.module.scss';
import tstyles from '@pages/table.module.scss';

import * as React from 'react';
import * as U from '@common/utilities';
import * as C from '@common/constants';

function Comparison(props: any) {
  return (
    <div className={styles.container} style={props.style}>
      <table className={tstyles.table}>
        <tbody className={tstyles.tbody}>
          <tr className={tstyles.tr}>
            <th className={tstyles.th} style={{ width: '30%' }}>
              Feature
            </th>
            <th className={tstyles.th} style={{ width: '30%' }}>
              Estuary (this node)
            </th>
            <th className={tstyles.th} style={{ width: '30%' }}>
              Amazon S3
            </th>
            <th className={tstyles.th} style={{ width: '30%' }}>
              Alibaba Cloud
            </th>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Overviews</strong>
            </td>

            <td className={tstyles.td}>
              Anyone can run their own Estuary Node and participate in onboarding storage to Filecoin. <br />
              <br />
              Performance is dependent on the network operators configuration. <br />
              <br />
              The Application Research Group at Protocol Labs runs this Estuary node as a living example of the cost.
              <br /> <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              Amazon S3 provides easy-to-use management features so you can organize your data and configure finely-tuned access controls to meet your specific business,
              organizational, and compliance requirements. <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              High-performance, highly reliable and highly available OSS instances. Applicable to service scenarios characterized by high throughputs, hot files, and frequent
              access.
              <br />
              <br />
              &nbsp;
            </td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Durability</strong>
            </td>

            <td className={tstyles.td}>
              Depends on the network operator. <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              (LRS) 99.999999999% (11 9's) <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              (LRS) 99.999999999% (11 9's) <br />
              <br />
              &nbsp;
            </td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Network operator cost</strong>
              <br />
              <br />
              How much it costs to run infrastructure.
              <br />
            </td>

            <td className={tstyles.td}>
              We pay <strong>~$1,249.00 USD</strong> a month. You can run our entire stack on your own.
              <br />
              <br />
              ➝ 24 2.2 GHz Cores
              <br />
              ➝ 192 GB DDR4
              <br />
              ➝ 96 TB HHD
              <br />
              <br />
              Based on IPFS pinning needs, there is a variable cost depending on how much storage we keep pinned versus backed up on Filecoin.
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              You can't run your own Amazon S3 replica.
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              You can't run your own Alibaba replica. <br />
              <br />
              &nbsp;
            </td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Cost for your users</strong>
              <br />
              <br />
              What "we charge" or what "you could charge" if you were running your own Estuary Node.
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              Free for up to <strong>10 TB</strong> which includes verified on chain Filecoin deals. <br />
              <br />
              Additional storage upon request. We are still stress testing the limits of how much extra free storage could be possible.
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              ➝ First 50 TB / $0.023 per GB a month
              <br />
              ➝ Next 450 TB / $0.022 per GB a month
              <br />
              ➝ Over 500 TB / $0.021 per GB a month
              <br />
              ➝ 10 TB / $230 a month
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              ➝ 10 TB / $159.74 a month
              <br />
              ➝ 50 TB / $798.72 a month
              <br />
              <br />
              &nbsp;
            </td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Request cost</strong>
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              Free requests
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              PUT, COPY, POST, LIST requests (per 1,000 requests) = $0.005 <br />
              GET, SELECT, and all other requests (per 1,000 requests) = $0.0004 <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              Free requests under 100 million
              <br />
              <br />
              &nbsp;
            </td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Data transfer cost</strong>
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              Free data transfer in
              <br />
              Free public gateways handle data transfer out <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              Free data transfer in <br />
              Data transfer out / $0.09 per GB a month <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              10 TB data transfer in / $0.08 a month
              <br />
              100 GB data transfer out / $8.00 a month
              <br />
              10 TB data transfer out / $819.00 a month <br />
              <br />
              &nbsp;
            </td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Strategy</strong>
            </td>

            <td className={tstyles.td}>
              <strong>P2P distributed storage</strong>: Filecoin is a peer-to-peer network that stores files, with built-in economic incentives to ensure files are stored reliably
              over time.
              <br />
              <br />
              In Filecoin, users pay to store their files on storage miners. Storage miners are computers responsible for storing files and proving they have stored the files
              correctly over time. Anyone who wants to store their files or get paid for storing other users’ files can join Filecoin.
              <br />
              <br />
              <strong>Available storage, and the price of that storage, is not controlled by any single company.</strong> Instead, Filecoin facilitates open markets for storing and
              retrieving files that anyone can participate in.
              <br />
              <br />
              Every network operator who runs an Estuary Node will have their own Filecoin address that will pay for the cost of their users Filecoin storage deals. Estuary Nodes
              can make Filecoin storage deals against any of the thousands of miners that exist on the Filecoin Network. It all depends on which miners the network operator
              selects.
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              <strong>Cloud storage</strong>: Information is stored in data centers located anywhere in the world and maintained by Amazon Web Services. <br />
              <br />
              Amazon Web Services (AWS) is a subsidiary of Amazon providing on-demand cloud computing platforms and APIs to individuals, companies, and governments, on a metered
              pay-as-you-go basis.
              <br />
              <br />
              The cloud storage uses a chain of servers that includes both master control server and other storage servers. The servers are all linked with one another and it can
              be utilized depending upon your use and requirements, and billed accordingly.
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              <strong>Cloud storage</strong>: Information is stored in data centers located anywhere in the world and maintained by Alibaba Cloud.
              <br />
              <br />
              Alibaba Cloud (Chinese: 阿里云; pinyin: Ālǐyún; lit. 'Ali Cloud'), also known as Aliyun, is a cloud computing company, a subsidiary of Alibaba Group. Alibaba Cloud
              provides cloud computing services to online businesses and Alibaba's own e-commerce ecosystem. Its international operations are registered and headquartered in
              Singapore.
              <br />
              <br />
              The cloud storage uses a chain of servers that includes both master control server and other storage servers. The servers are all linked with one another and it can
              be utilized depending upon your use and requirements, and billed accordingly.
              <br />
              <br />
              &nbsp;
            </td>
          </tr>

          <tr className={tstyles.tr}>
            <td className={tstyles.td}>
              <strong>Locations</strong>
            </td>

            <td className={tstyles.td}>
              Anywhere, and everywhere.
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              US, JP, CN, BE, UK, DE, AU, IN, BR, SG, FI.
              <br />
              <br />
              &nbsp;
            </td>

            <td className={tstyles.td}>
              CN, HK, SG, AU, MY, ID, IN, JP, US, DE, UK, AE
              <br />
              <br />
              &nbsp;
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Comparison;
