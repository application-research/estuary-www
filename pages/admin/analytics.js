import styles from "~/pages/app.module.scss";

import * as React from "react";
import * as U from "~/common/utilities";
import * as C from "~/common/constants";
import * as R from "~/common/requests";

import Cookies from "js-cookie";
import Navigation from "~/components/Navigation";
import Page from "~/components/Page";
import AuthenticatedLayout from "~/components/AuthenticatedLayout";
import AuthenticatedSidebar from "~/components/AuthenticatedSidebar";
import SingleColumnLayout from "~/components/SingleColumnLayout";
import EmptyStatePlaceholder from "~/components/EmptyStatePlaceholder";

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

function AdminAnalyticsPage(props) {
  React.useEffect(async () => {
    // {"1":{"numDeals":10,"numConfirmed":10,"numFailed":4,"totalSpending":"71040000000000000","confirmedSpending":"71040000000000000"},"10":{"numDeals":6,"numConfirmed":0,"numFailed":8,"totalSpending":"704000000000000000","confirmedSpending":"0"},"13":{"numDeals":6,"numConfirmed":0,"numFailed":11,"totalSpending":"39000000000000000","confirmedSpending":"0"},"14":{"numDeals":6,"numConfirmed":0,"numFailed":9,"totalSpending":"39000000000000000","confirmedSpending":"0"},"15":{"numDeals":2,"numConfirmed":0,"numFailed":2,"totalSpending":"3750000000000000","confirmedSpending":"0"},"2":{"numDeals":10,"numConfirmed":10,"numFailed":32,"totalSpending":"2415040000000000000","confirmedSpending":"2415040000000000000"},"3":{"numDeals":10,"numConfirmed":10,"numFailed":26,"totalSpending":"2575040000000000000","confirmedSpending":"2575040000000000000"},"4":{"numDeals":10,"numConfirmed":10,"numFailed":11,"totalSpending":"60470000000000000","confirmedSpending":"60470000000000000"},"6":{"numDeals":0,"numConfirmed":0,"numFailed":1,"totalSpending":"0","confirmedSpending":"0"},"7":{"numDeals":10,"numConfirmed":10,"numFailed":11,"totalSpending":"17500000000000000","confirmedSpending":"17500000000000000"},"8":{"numDeals":10,"numConfirmed":10,"numFailed":0,"totalSpending":"29375000000000","confirmedSpending":"29375000000000"}}
    const response = await R.get("/admin/dealstats");
    if (response.error) {
      console.log(response.error);
      return;
    }

    console.log(response);
  }, []);

  return (
    <Page
      title="Estuary: Admin: Analytics"
      description="A list of Estuary node analytics."
      url="https://estuary.tech/admin/analytics"
    >
      <AuthenticatedLayout
        navigation={<Navigation isAuthenticated />}
        sidebar={<AuthenticatedSidebar active="ADMIN_ANALYTICS" viewer={props.viewer} />}
      >
        <SingleColumnLayout>
          <EmptyStatePlaceholder>Coming soon</EmptyStatePlaceholder>
        </SingleColumnLayout>
      </AuthenticatedLayout>
    </Page>
  );
}

export default AdminAnalyticsPage;
