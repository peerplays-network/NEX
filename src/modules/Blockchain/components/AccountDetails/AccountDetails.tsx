import counterpart from "counterpart";
import Link from "next/link";

import { ActivityAndNotificationTable } from "../../../../common/components";
import { StatsCard } from "../../common";

import * as Styled from "./AccountDetails.styled";

type Props = {
  account: {
    account_id: string;
    account_name: string;
    balance: number;
  };
};
export const AccountDetails = ({ account }: Props): JSX.Element => {
  return (
    <>
      <Styled.AccountWrapper>
        <Styled.StatsCardsDeck>
          <StatsCard
            noData={!account.account_id || account.account_id === ""}
            title={counterpart.translate(
              `pages.blocks.block_details.block_num`
            )}
            data={`${account.account_id}`}
            statsData={[0]}
          />
          <StatsCard
            noData={!account.account_name || account.account_name === ""}
            title={counterpart.translate(`pages.blocks.block_details.witness`)}
            data={
              <Link href={`/user/${account.account_name}`}>
                {`${account.account_name} (${account.account_name})`}
              </Link>
            }
            statsData={[0]}
          />

          <StatsCard
            noData={!account.balance}
            title={counterpart.translate(`pages.blocks.block_details.witness`)}
            data={account.balance.toString()}
            statsData={[0]}
          />
        </Styled.StatsCardsDeck>
      </Styled.AccountWrapper>
      <ActivityAndNotificationTable userName={account.account_name as string} />
    </>
  );
};
