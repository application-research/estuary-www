import * as C from '@common/constants';
import * as R from '@common/requests';
import * as U from '@common/utilities';
import React from 'react';

function EquinixBot(props: any) {
  const [state, setState] = React.useState({
    date: null,
    deviceValue: null,
    environmentDevices: null,
    estimatedRenderCost: null,
    loading: false,
    success: false,
    successFailureRates: null,
    totalCost: null,
    thirdyDaysCost: null,
  });

  React.useEffect(() => {
    let interval = setInterval(() => {
      const run = async () => {
        const environment = await R.post('/api/v1/environment/equinix/list/usages', C.staticEnvironmentPayload, C.api.metricsHost);

        setState({ ...state, environmentDevices: environment });

        if (deviceName !== null && deviceValue !== null && totalCost !== null) {
          sendDataToSlack();
        }
      };
      run();
    }, 604800); //run every 7 days

    return () => {
      clearInterval(interval);
    };
  }, []);

  const estimatedRenderCost = 2460 / 4;

  const deviceValues =
    state.environmentDevices != undefined && state.environmentDevices['total'] != undefined
      ? state.environmentDevices['device_usages'].map((device) => device['usages'][0]['total'])
      : null;

  const deviceName =
    state.environmentDevices != undefined && state.environmentDevices['device_usages'] != undefined
      ? state.environmentDevices['device_usages'].map((device) => device['Info']['name'])
      : null;

  const totalCost =
    state.environmentDevices != undefined && (state.environmentDevices['total'] != undefined && state.environmentDevices['device_usages']) != undefined
      ? Math.floor(state.environmentDevices['total']) + estimatedRenderCost
      : null;

  let values = [];

  if (state.environmentDevices != undefined && state.environmentDevices['device_usages'] != undefined) {
    deviceName.forEach((name, index) => {
      values.push(`\n🛠️ ${name}: $${deviceValues[index]}`);
    });
  }

  const deviceValue = values.map((item, index) => item);
  const date = `Cost from the last 7 days: ${C.afterWeekly} to ${C.before} `;

  let thirdyDaysCost = totalCost ? totalCost * 4 : 'undefined';

  let sendDataToSlack = async () => {
    setState({ ...state, loading: true });
    try {
      fetch('/api/equinix-stats', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date,
          deviceValue: deviceValue,
          estimatedRenderCost: estimatedRenderCost,
          thirdyDaysCost: thirdyDaysCost,
          totalCost: totalCost,
        }),
      });
    } catch (e) {
      console.log(e);
    }

    setState({
      ...state,
      date: date,
      deviceValue: deviceValue,
      estimatedRenderCost: estimatedRenderCost,
      thirdyDaysCost: thirdyDaysCost,
      loading: false,
      success: true,
      totalCost: totalCost,
    });
  };

  return (
    <div style={{ display: 'grid', rowGap: '24px', justifyContent: 'center', paddingTop: '80px' }}>
      <h2>Infrastructure Bot</h2>
      <p>This bot will send infrastructure costs to slack every 7 days</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);
  return {
    props: { viewer, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

export default EquinixBot;
