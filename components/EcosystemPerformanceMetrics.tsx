import { useState } from 'react';
import * as React from 'react';
import * as U from '@common/utilities';
import S from './CardWithIcon.module.scss';
import * as R from '@common/requests';
import CardWithIcon from './CardWithIcon';

export interface GridWithIconMetricsProps {
  statistic: number;
  caption: string;
  src: string;
}

// function GridWithIconMetrics({ statistic, caption, src }: GridWithIconMetricsProps) {
//   return (
//     <div className={S.ecosystemPerformance} style={{ paddingBottom: '16px' }}>
//       {}
//       <CardWithIcon />
//     </div>
//   );
// }

// export default GridWithIconMetrics;

//    <div className={S.ecosystemPerformance} style={{ paddingBottom: '16px' }}>
//      <div className={S.ecosystemSectionWithIcon}>
//        <div className={S.ecosystemStatCardWithIcon}>
//          <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205302299-2e2a2c08-d071-447d-9c57-b139583ac9a2.gif" />

//          <div className={S.ecosystemStatValueWithIcon}>
//            {state.totalFilesStored.toLocaleString()}
//            <div className={S.ecosystemStatText}>Total root CIDs uploaded to Estuary. This value does not include sub objects references.</div>
//          </div>
//        </div>
//      </div>

//      <div className={S.ecosystemSectionWithIcon}>
//        <div className={S.ecosystemStatCardWithIcon}>
//          <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205301350-28c38449-1e3d-41d1-9816-790008e4fbee.gif" />

//          <div className={S.ecosystemStatValueWithIcon}>
//            {state.totalObjectsRef.toLocaleString()} <div className={S.ecosystemStatText}>Total number of object references provided by every root CID in the network.</div>
//          </div>
//        </div>
//      </div>

//      <div className={S.ecosystemSectionWithIcon}>
//        <div className={S.ecosystemStatCardWithIcon}>
//          <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205301608-742949ad-63b4-4cf0-9813-707459650bee.gif" />

//          <div className={S.ecosystemStatValueWithIcon}>
//            {state.dealsOnChain.toLocaleString()} <div className={S.ecosystemStatText}>Active successful storage deals on the Filecoin Network</div>
//          </div>
//        </div>
//      </div>

//      <div className={S.ecosystemSectionWithIcon}>
//        <div className={S.ecosystemStatCardWithIcon}>
//          <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205301746-297295d4-a576-4d28-9d7c-2feada68aa5f.gif" />

//          <div className={S.ecosystemStatValueWithIcon}>
//            {U.bytesToSize(state.totalStorage)}
//            <div className={S.ecosystemStatText}>Total pinned IPFS storage for hot retrieval from any IPFS gateway. This data is not stored on Filecoin</div>
//          </div>
//        </div>
//      </div>

//      {graph.dealsSealedBytes ? (
//        <div className={S.ecosystemSectionWithIcon}>
//          <div className={S.ecosystemStatCardWithIcon}>
//            <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205651552-40090d3d-70b3-4896-a832-c198631f5c9b.gif" />

//            <div className={S.ecosystemStatValueWithIcon}>
//              {U.bytesToSize(graph.dealsSealedBytes)} <div className={S.ecosystemStatText}>Total sealed storage contributed to Filecoin including a 6x replication</div>
//            </div>
//          </div>
//        </div>
//      ) : null}

//      <div className={S.ecosystemSectionWithIcon}>
//        <div className={S.ecosystemStatCardWithIcon}>
//          <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205303934-d95ea7a6-e13d-482a-94a4-cedb99998568.gif" />

//          <div className={S.ecosystemStatValueWithIcon}>
//            <p>{state.miners.length}</p>
//            <p className={S.ecosystemStatText}>Total storage providers receiving deals from our Estuary node</p>
//          </div>
//        </div>
//      </div>

//      <div className={S.ecosystemSectionWithIcon}>
//        <div className={S.ecosystemStatCardWithIcon}>
//          <img className={S.ecosystemStatIcon} src="https://user-images.githubusercontent.com/28320272/205304639-59eee09d-3b92-4952-b67f-8329500817b7.gif" />

//          <div className={S.ecosystemStatValueWithIcon}>
//            {state.totalUsers}
//            <div className={S.ecosystemStatText}>Total registered users</div>
//          </div>
//        </div>
//      </div>
//    </div>;
