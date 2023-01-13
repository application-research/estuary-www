export const send = ({ date, deviceValue, estimatedRenderCost, totalCost, thirdyDaysCost, webhook }) => {
  // console.log(
  //   `${date} \n${deviceValue} \n🌱 Estimated Render Cost (7 days): $${estimatedRenderCost} \n🏦 Total Cost (last 7 days): $${totalCost}, \nEstimated Total Cost for 30 days: $${thirdyDaysCost}`
  // );

  try {
    webhook.send({
      text: `${date} \n${deviceValue} \n🌱 Estimated Render Cost (7 days): $${estimatedRenderCost} \n🏦 Total Cost (last 7 days): $${totalCost}`,
    });
    return true;
  } catch (e) {
    return false;
  }
};
