import { Tabs } from "antd";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  AddressGenerated,
  GenerateAddress,
  Layout,
  TransferForm,
  WithdrawForm,
} from "../../../../common/components";
import { useSidechainAccounts } from "../../../../common/hooks";
import { AssetsTable } from "../../componets/AssetsTable";

import * as Styled from "./AssetPage.styled";
import { useAssetPage } from "./hooks";

const { TabPane } = Tabs;

const AssetPage: NextPage = () => {
  const { handleAssetChange } = useAssetPage();
  const { hasBTCDepositAddress } = useSidechainAccounts();
  const router = useRouter();
  const { asset, tab } = router.query;
  return (
    <Layout
      title="Wallet"
      type="card-lrg"
      heading="Wallet"
      description={`Wallet Page | ${asset} ${tab}`}
      dexLayout={true}
    >
      <Styled.AssetCard>
        <Tabs
          defaultActiveKey={`${tab}`}
          tabBarExtraContent={<Link href="/wallet">Back to Assets</Link>}
        >
          <TabPane tab="Transfer" key="transfer">
            <AssetsTable showActions={false} fillterAsset={`${asset}`} />
            <TransferForm asset={`${asset}`} />
          </TabPane>
          {asset === "TEST" || asset === "PPT" ? (
            ""
          ) : (
            <>
              <TabPane tab="Withdraw" key="withdraw">
                <AssetsTable showActions={false} fillterAsset={`${asset}`} />
                <WithdrawForm asset={`${asset}`} withAssetSelector={false} />
              </TabPane>
              <TabPane tab="Deposit" key="deposit">
                <AssetsTable showActions={false} fillterAsset={`${asset}`} />
                {hasBTCDepositAddress ? (
                  <AddressGenerated />
                ) : (
                  <GenerateAddress
                    hideDisclamer={true}
                    onAssetChange={handleAssetChange}
                    hideDefultToken={true}
                  />
                )}
              </TabPane>
            </>
          )}
          <TabPane tab="All Activity" key="activity">
            {/* <TransferTab asset={asset} /> */}
          </TabPane>
        </Tabs>
      </Styled.AssetCard>
    </Layout>
  );
};

export default AssetPage;
