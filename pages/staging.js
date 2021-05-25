import styles from "~/pages/app.module.scss";
import tstyles from "~/pages/table.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as R from "~/common/requests";

import ProgressCard from "~/components/ProgressCard";
import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";
import EmptyStatePlaceholder from "~/components/EmptyStatePlaceholder";
import SingleColumnLayout from "~/components/SingleColumnLayout";
import Button from "~/components/Button";

import { H1, H2, H3, P } from "~/components/Typography";

export async function getServerSideProps(context) {
  const viewer = await U.getViewerFromHeader(context.req.headers);

  if (!viewer) {
    return {
      redirect: {
        permanent: false,
        destination: "/sign-in",
      },
    };
  }

  return {
    props: { viewer },
  };
}

function StagingPage(props) {
  const [state, setState] = React.useState({ files: null });

  React.useEffect(async () => {
    const files = await R.get("/content/staging-zones");
    console.log(files);

    if (!files || files.error) {
      return;
    }

    setState({ files: files[0].contents });
  }, []);

  console.log(props.viewer);

  return (
    <Page
      title="Estuary: Staging"
      description="Data before a Filecoin deal is made"
      url="https://estuary.tech/staging"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="FILES" viewer={props.viewer} />}
      >
        <SingleColumnLayout>
          <H2>Staging zone</H2>
          <P style={{ marginTop: 8 }}>
            Data that is listed here will be aggregated into a single Filecoin deal within a few
            hours.
          </P>
        </SingleColumnLayout>
        <div className={styles.group}>
          <table className={tstyles.table}>
            <tbody className={tstyles.tbody}>
              <tr className={tstyles.tr}>
                <th className={tstyles.th} style={{ width: "30%" }}>
                  Name
                </th>
                <th className={tstyles.th}>Retrieval link</th>
                <th className={tstyles.th} style={{ width: "104px" }}>
                  Size
                </th>
                <th className={tstyles.th} style={{ width: "120px" }}>
                  User ID
                </th>
              </tr>
              {state.files && state.files.length
                ? state.files.map((data, index) => {
                    const fileURL = `https://dweb.link/ipfs/${data.cid}`;
                    return (
                      <tr key={`${data.cid["/"]}-${index}`} className={tstyles.tr}>
                        <td className={tstyles.td}>{data.name}</td>
                        <td className={tstyles.tdcta}>
                          <a href={fileURL} target="_blank" className={tstyles.cta}>
                            {fileURL}
                          </a>
                        </td>
                        <td className={tstyles.td}>{U.bytesToSize(data.size)}</td>
                        <td className={tstyles.td}>{data.userId}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </AuthenticatedLayout>
    </Page>
  );
}

export default StagingPage;
