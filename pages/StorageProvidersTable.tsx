import style from '@pages/StorageProvidersTable.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import DealsIcon from '@root/components/icons/DealsIcon';
import ErrorIcon from '@root/components/icons/ErrorIcon';
import UserCheckedIcon from '@root/components/icons/UserCheckedIcon';
import SignalIcon from '@root/components/icons/SignalIcon';

export interface MinerDataProps {
  miner: string;
  dealCount: number;
  errorCount: number;
}

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, ...context.params, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function StorageProvidersTable(props: any) {
  const [state, setState] = React.useState([]);

  let minerNames = [];
  let eachMiner = [];
  let minerData: MinerDataProps[] = [];

  React.useEffect(() => {
    const run = async () => {
      const miners = await R.get('/public/miners/', process.env.NEXT_PUBLIC_ESTUARY_API);

      for (let miner of miners) {
        minerNames.push(miner.addr);
      }

      minerNames.map((miner) => {
        eachMiner.push(miner);
      });

      eachMiner.map(async (miner) => {
        const response = await R.get(`/public/miners/stats/${miner}`, process.env.NEXT_PUBLIC_ESTUARY_API);

        minerData.push(response);
        if (minerData.length == minerNames.length) {
          return setState(minerData);
        }
      });
    };

    run();
  }, []);

  return (
    <table className={style.table}>
      <div>{minerData}</div>
      <tr>
        <th className={style.th} style={{ color: 'black', fontSize: '12px' }}>
          Index
          <SignalIcon className={style.svgIcon} style={{ height: '20px' }} />
        </th>
        <th className={style.th} style={{ color: 'black', fontSize: '12px' }}>
          <span className={style.thLabel}>Storage Provider's ID</span> <UserCheckedIcon className={style.svgIcon} style={{ height: '20px' }} />
        </th>
        <th className={style.th} style={{ color: 'black', fontSize: '12px' }}>
          <span className={style.thLabel}> Deals</span>
          <DealsIcon className={style.svgIcon} style={{ height: '20px' }} />
        </th>
        <th className={style.th} style={{ color: 'black', fontSize: '12px' }}>
          <span className={style.thLabel}> Error Count</span>
          <ErrorIcon className={style.svgIcon} style={{ height: '20px' }} />
        </th>
      </tr>

      {state.length !== null
        ? state.map((item, index) => {
            const { miner, dealCount, errorCount } = item;
            return (
              <tr className={style.tr}>
                <td className={style.td}>{index}</td>
                <td className={style.td}>{miner}</td>
                <td className={style.td}>{dealCount}</td>
                <td className={style.td}>{errorCount}</td>
              </tr>
            );
          })
        : null}
    </table>
  );
}

export default StorageProvidersTable;
