import styles from "~/pages/app.module.scss";
import tstyles from "~/pages/table.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as R from "~/common/requests";

import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";
import SingleColumnLayout from "~/components/SingleColumnLayout";
import EmptyStatePlaceholder from "~/components/EmptyStatePlaceholder";
import Block from "~/components/Block";
import Input from "~/components/Input";
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

  if (viewer.perms < 10) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
    };
  }

  return {
    props: { viewer },
  };
}

function AdminContentPage(props) {
  const [state, setState] = React.useState({ loading: false, content: [] });

  React.useEffect(async () => {
    const response = await R.get("/admin/cm/offload/candidates");
    console.log(response);
    /*
    active: true
    cid: "QmbKDuc7QgdvpMNJrpotWPqECaGHJbrKifLMe8N4E9Jx9E"
    description: ""
    id: 10
    name: "Tencent_AILab_ChineseEmbedding.tar.gz"
    offloaded: false
    replication: 6
    size: 6780552629
    userId: 5
    */

    if (response && response.error) {
      return;
    }

    setState({ ...state, content: response });
  }, []);

  return (
    <Page
      title="Estuary: Admin: Content"
      description="Manage the content on Estuary"
      url="https://estuary.tech/admin/content"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="ADMIN_CONTENT" viewer={props.viewer} />}
      >
        <div className={styles.group}>
          <table className={tstyles.table}>
            <tbody className={tstyles.tbody}>
              <tr className={tstyles.tr}>
                <th className={tstyles.th} style={{ width: "30%" }}>
                  name
                </th>
                <th className={tstyles.th}>cid</th>
                <th className={tstyles.th} style={{ width: "128px" }}>
                  active
                </th>
                <th className={tstyles.th} style={{ width: "128px" }}>
                  replication
                </th>
                <th className={tstyles.th} style={{ width: "128px" }}>
                  size
                </th>
                <th className={tstyles.th} style={{ width: "104px" }}>
                  options
                </th>
              </tr>
              {state.content && state.content.length
                ? state.content.map((data, index) => {
                    const fileURL = `https://dweb.link/ipfs/${data.cid}`;
                    return (
                      <tr className={tstyles.tr}>
                        <td className={tstyles.td}>{data.name}</td>
                        <td className={tstyles.tdcta}>
                          <a href={fileURL} target="_blank" className={tstyles.cta}>
                            {fileURL}
                          </a>
                        </td>
                        <td className={tstyles.td}>{String(data.active)}</td>
                        <td className={tstyles.td}>{data.replication} times</td>
                        <td className={tstyles.td}>{U.bytesToSize(data.size)}</td>
                        {!props.offloaded ? (
                          <td className={tstyles.td}>
                            <button
                              className={tstyles.tdbutton}
                              onClick={async () => {
                                const confirm = window.confirm(
                                  "Are you sure you want to delete this data?"
                                );

                                if (!confirm) {
                                  return;
                                }

                                const response = await R.post(`/admin/cm/offload/${data.id}`, {});

                                if (response && response.error) {
                                  return alert(response.error);
                                }

                                const content = await R.get("/admin/cm/offload/candidates");

                                if (content && content.error) {
                                  return alert(content.error);
                                }

                                setState({ ...state, content });
                              }}
                            >
                              Offload
                            </button>
                          </td>
                        ) : null}
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

export default AdminContentPage;
