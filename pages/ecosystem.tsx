import S from '@pages/index.module.scss';

import * as R from '@common/requests';
import * as U from '@common/utilities';
import * as Logos from '@components/PartnerLogoSVG';
import * as React from 'react';

import * as C from '@common/constants';
import Chart from '@components/Chart';
import Page from '@components/Page';

import Footer from '@root/components/Footer';
import Hero from '@root/components/Hero';
import ProgressBar from '@root/components/ProgressBar';
import ResponsiveNavbar from '@root/components/ResponsiveNavbar';
import StorageProvidersTable from './StorageProvidersTable';

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  return {
    props: { viewer, api: process.env.NEXT_PUBLIC_ESTUARY_API, hostname: `https://${context.req.headers.host}` },
  };
}

function useWindowSize() {
  const [size, setSize] = React.useState([0, 0]);
  if (!process.browser) {
    return size;
  }

  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function EcosystemPage(props: any) {
  const [width, height] = useWindowSize();

  const description = 'Learn how well our Estuary node is performing and which collaborators are working with us.';
  const title = 'Estuary: Ecosystem dashboard.';

  return (
    <Page title={title} description={description} url={`${props.hostname}/ecosystem`}>
      <ResponsiveNavbar />
      <Hero
        gradient={true}
        heading="Estuary's Ecosystem"
        caption="Since April 2021, Estuary has made significant progress in expanding its ecosystem. We are excited to share our progress with you and strive to continue growing this community."
      />
      <div className={S.ecosystem}>
        <div>
          <h2 id="collaborators" className={S.ecosystemH2} style={{ paddingTop: '80px' }}>
            Collaborators
          </h2>

          <div className={S.collaborations}>
            <div className={S.container}>
              <div className={S.column}>
                <div className={S.ecosystemLogoBox}>
                  <Logos.Zora height="35px" className={S.ecosystemImage} />
                </div>
              </div>
              <div className={S.column}>
                <div className={S.ecosystemLogoBox}>
                  <Logos.Portrait height="35px" className={S.ecosystemImage} />
                </div>
              </div>
              <div className={S.column}>
                <div className={S.ecosystemLogoBox}>
                  <Logos.NBFS height="30px" width="160px" className={S.ecosystemImage} />
                </div>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://archive.org/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/203411654-adf169fb-0493-446a-8393-19d932d93618.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://kodadot.xyz/" target="_blank">
                  <img height="60vh" src="https://user-images.githubusercontent.com/28320272/203411306-01912ea7-9503-4d6a-9501-e243c7123d89.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://wallet.glif.io/" target="_blank">
                  <img height="80vh" src="https://user-images.githubusercontent.com/28320272/203406224-c17a8fd5-fae9-49a0-97c9-3ebf4e704d4f.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://chainsafe.io/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202939033-a899fadf-5438-44d4-aa09-1c76e660072c.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://opendata.cityofnewyork.us/" target="_blank">
                  <img height="80vh" src="https://user-images.githubusercontent.com/28320272/203404943-0d4d5e2f-195b-4b1e-ab2b-e88fae6a3aac.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://app.gala.games/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202942649-b7237e6a-4c38-487a-b167-07a3833917a5.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://www.vividlabs.com/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/310223/156037345-f93054de-d222-47e9-9653-cd957fc0fcc5.svg" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://w3bmint.xyz/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/203404877-791e53c6-7ec6-48b6-960a-f65c4aa46e29.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://sxxfuture.com/" target="_blank">
                  <img height="35vh" src="https://user-images.githubusercontent.com/28320272/204052332-56be823b-b058-4232-96a5-ef3d569dcc56.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://gitopia.com/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202940154-8c54b568-70cd-4063-b21d-38aee052a063.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://hashaxis.com/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202942456-d921ed27-c0c1-4d9e-98ae-f0189e740bc1.svg" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://www.labdao.xyz/" target="_blank">
                  <img height="45vh" src="https://user-images.githubusercontent.com/28320272/202940852-dda0b5d6-7bb4-4ea3-9c86-ec6bc6286104.svg" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://green.filecoin.io/" target="_blank">
                  <img height="70vh" src="https://user-images.githubusercontent.com/28320272/202937974-6d191fae-264f-40b0-b18e-3071b8009802.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://www.cancerimagingarchive.net/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202939283-c78969dd-2f06-42dd-8823-cb6d23ff3818.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://opsci.io/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202937956-0c12b60d-8a38-4e9b-9749-3420598276f8.png" />
                </a>
              </div>
              <div className={S.column}>
                <a className={S.ecosystemLogoBox} href="https://www.bacalhau.org/" target="_blank">
                  <img height="50vh" src="https://user-images.githubusercontent.com/28320272/202938869-73f5fcc1-7d0c-4e4c-b2d0-bd1d62ceac39.png" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </Page>
  );
}

export default EcosystemPage;
