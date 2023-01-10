import * as C from '@common/constants';
import * as R from '@common/requests';
import Button from '@root/components/Button';
import React from 'react';

function EquinixBot(props: any) {
  const [state, setState] = React.useState({
    environmentDevices: null,
    successFailureRates: null,
    deviceValue: null,
    deviceName: null,
    totalCost: null,
    estimatedRenderCost: null,
    success: false,
    loading: false,
  });

  React.useEffect(() => {
    const run = async () => {
      const environment = await R.post('/api/v1/environment/equinix/list/usages', C.staticEnvironmentPayload, C.api.metricsHost);
      console.log('environment', environment);

      setState({ ...state, environmentDevices: environment });
    };
    console.log(state.environmentDevices, 'devicess');
    run();
  }, []);

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
      ? Math.floor(state.environmentDevices['total']) + ' USD'
      : null;

  let estimatedRenderCost = 2460;

  let values = [];

  if (state.environmentDevices != undefined && state.environmentDevices['device_usages'] != undefined) {
    deviceName.forEach((name, index) => {
      values.push(`\n🛠️ ${name}:  ${deviceValues[index]}`);
    });
  }

  const deviceValue = values.map((item, index) => item);
  console.log('values', values);

  // console.log(`\n${deviceValue} \n🏦 Total Cost (last 30 days): ${totalCost}`);

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
                  deviceValue: deviceValue,
                  totalCost: totalCost,
                  estimatedRenderCost: estimatedRenderCost,
                }),
              });
            } catch (e) {
              console.log(e);
            }

            setState({
              ...state,
              loading: true,
              success: true,
              deviceValue: deviceValue,
              deviceName: deviceName,
              totalCost: totalCost,
              estimatedRenderCost: estimatedRenderCost,
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
  return {
    props: {},
  };
}

export default EquinixBot;
