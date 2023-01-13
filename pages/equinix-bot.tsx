import * as C from '@common/constants';
import * as R from '@common/requests';
import * as U from '@common/utilities';
import Button from '@root/components/Button';
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
    const run = async () => {
      const environment = await R.post('/api/v1/environment/equinix/list/usages', C.staticEnvironmentPayload, C.api.metricsHost);

      setState({ ...state, environmentDevices: environment });
    };
    console.log(state.environmentDevices, 'devicess');
    run();
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

  console.log(
    `${date} \n${deviceValue} \n🌱 Estimated Render Cost (7 days): $${estimatedRenderCost} \n🏦 Total Cost (last 7 days): $${totalCost}, \nEstimated Total Cost for 30 days: $${thirdyDaysCost}`
  );
  return (
    <div>
      {deviceName !== null && deviceValue !== null && totalCost !== null ? (
        <Button
          loading={state.loading}
          onClick={async () => {
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
              loading: true,
              success: true,
              totalCost: totalCost,
            });
          }}
        >
          Send data to slack
        </Button>
      ) : (
        <></>
      )}
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
