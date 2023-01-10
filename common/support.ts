export const send = ({ deviceValue, totalCost, webhook }) => {
  //console.log('request is being sent to slack', deviceValue, deviceName, totalCost);
  //console.log(`\n ${deviceValue} \n 🏦 *Total Cost (last 30 days):* ${totalCost}`);
  // console.log(`\n* 🛠️${deviceName} *: ${deviceValue}\n 🏦 Total Cost (last 30 days):* ${totalCost}\n`);
  console.log('this is a test', `\n${deviceValue} \n🏦 Total Cost (last 30 days): ${totalCost}`);

  try {
    // webhook.send({
    //   text: `\n${deviceValue} \n🏦 Total Cost (last 30 days): ${totalCost}`,
    // });
    return true;
  } catch (e) {
    return false;
  }
};
