import styles from '@pages/app.module.scss';
import tstyles from '@pages/table.module.scss';

import * as U from '@common/utilities';

function StagingZoneReadinessTable(props: any) {
  if (props.readiness) {
    return (
      <table className={tstyles.table}>
        <tbody className={tstyles.tbody}>
          <tr className={tstyles.tr}>
            <th className={tstyles.th}>Ready? (updates every 5 minutes)</th>
            <th className={tstyles.th}>Readiness Reason</th>
          </tr>
          <tr className={tstyles.tr}>
            <td className={tstyles.td}>{U.formatBoolean(props.readiness.isReady)}</td>
            <td className={U.classNames(tstyles.td, styles.multiline)}>{props.readiness.readinessReason}</td>
          </tr>
        </tbody>
      </table>
    );
  }
  return null;
}

export default StagingZoneReadinessTable;
