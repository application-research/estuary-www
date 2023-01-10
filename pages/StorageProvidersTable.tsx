import style from '@pages/StorageProvidersTable.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as React from 'react';

import LoaderSpinner from '@components/LoaderSpinner';
import { BreakpointEnum, useBreakpoint } from '@root/common/use-breakpoint';
import DealsIcon from '@root/components/icons/DealsIcon';
import ErrorIcon from '@root/components/icons/ErrorIcon';
import SignalIcon from '@root/components/icons/SignalIcon';
import UserCheckedIcon from '@root/components/icons/UserCheckedIcon';

export async function getServerSideProps({ context, res }) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

  return {
    props: { viewer, ...context.params, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function StorageProvidersTable(props: any) {
  const [state, setState] = React.useState([]);
  const [displayIcon, setDisplayIcon] = React.useState(false);

  const breakpoint = useBreakpoint();

  let minerNames = [];
  let eachMiner = [];
  let minerData = [];

  React.useEffect(() => {
    const isMobile = breakpoint === BreakpointEnum.XS || breakpoint === BreakpointEnum.SM;

    if (!isMobile) {
      setDisplayIcon(true);
    }
  }, [breakpoint]);

  React.useEffect(() => {
    const run = async () => {
      const miners = await R.get('/public/miners/', props.api);
      let undefinedMiner = 0;

      for (let miner of miners) {
        if (miner !== undefined && miner.status !== 500 && miner !== 'error') {
          minerNames.push(miner.addr);
        }
      }

      minerNames.map((miner) => {
        eachMiner.push(miner);
      });

      eachMiner.map(async (miner) => {
        const response = await R.get(`/public/miners/stats/${miner}`, props.api);

        if (response.miner !== undefined && response.status !== 500 && response !== 'error') {
          minerData.push(response);
        } else {
          undefinedMiner += 1;
        }

        if (minerData.length == minerNames.length - undefinedMiner) {
          return setState(minerData);
        }
      });
    };

    run();
  }, []);

  state.sort((b, a) => {
    return a.dealCount - b.dealCount;
  });

  return (
    <>
      {state.length == 0 ? (
        <div className={style.loaderContainer}>
          <LoaderSpinner />
          <p style={{ color: 'white', fontFamily: 'Mono', marginTop: '8px' }}>Data is Loading </p>
        </div>
      ) : (
        <table className={style.table} style={{ marginBottom: '80px' }}>
          <tr>
            <th className={style.th} style={{ color: 'black', fontSize: '12px' }}>
              Index
              <SignalIcon className={displayIcon ? style.svgIcon : style.displayNone} style={{ height: '20px' }} color={'black'} />
            </th>
            <th className={style.th} style={{ color: 'black', fontSize: '12px' }}>
              <span className={style.thLabel}> Provider ID</span>
              <UserCheckedIcon className={displayIcon ? style.svgIcon : style.displayNone} style={{ height: '20px' }} color={'black'} />
            </th>
            <th className={style.th} style={{ color: 'black', fontSize: '12px' }}>
              <span className={style.thLabel}> Deals</span>
              <DealsIcon className={displayIcon ? style.svgIcon : style.displayNone} style={{ height: '20px' }} color={'black'} />
            </th>
            <th className={style.th} style={{ color: 'black', fontSize: '12px' }}>
              <span className={style.thLabel}> Errors</span>
              <ErrorIcon className={displayIcon ? style.svgIcon : style.displayNone} style={{ height: '20px' }} color={'black'} />
            </th>
          </tr>

          {state.map((item, index) => {
            const { miner, dealCount, errorCount } = item;

            return (
              <tr className={style.tr}>
                <td className={style.td}>
                  <a href={`/providers/stats/${miner}`} className={style.link}>
                    {index}
                  </a>
                </td>
                <td className={style.td}>
                  <a href={`/providers/stats/${miner}`} className={style.link}>
                    {miner !== undefined ? miner : 'EMPTYYYY'}
                  </a>
                </td>
                <td className={style.td}>
                  <a href={`/providers/stats/${miner}`} className={style.link}>
                    {dealCount}
                  </a>
                </td>
                <td className={style.td}>
                  <a href={`/providers/stats/${miner}`} className={style.link}>
                    {errorCount}
                  </a>
                </td>
              </tr>
            );
          })}
        </table>
      )}
    </>
  );
}

export default StorageProvidersTable;
