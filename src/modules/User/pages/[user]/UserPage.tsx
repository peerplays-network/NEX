import counterpart from "counterpart";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import {
  ActivityAndNotificationTable,
  Layout,
} from "../../../../common/components";
import { AssetsTable } from "../../../Wallet/components";

import * as Styled from "./UserPage.styled";

const UserPage: NextPage = () => {
  const router = useRouter();
  const { user } = router.query;

  return (
    <Layout
      title="Profile"
      type="card-lrg"
      heading={counterpart.translate(`pages.user.heading`)}
      description={`${counterpart.translate(
        `pages.user.discription`
      )} | ${user}`}
      layout="dex"
    >
      <Styled.UserCard>
        <Styled.UserHeading>{user}</Styled.UserHeading>
        <AssetsTable
          title={counterpart.translate(`field.labels.coins_token`)}
          userName={user as string}
          showActions={false}
        />
        <ActivityAndNotificationTable userName={user as string} />
      </Styled.UserCard>
    </Layout>
  );
};

export default UserPage;
