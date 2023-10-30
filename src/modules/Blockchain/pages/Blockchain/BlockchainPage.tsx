import counterpart from "counterpart";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { Layout, MobileTabBar } from "../../../../common/components";
import { useViewportContext } from "../../../../common/providers";
import { PageTabs } from "../../../../ui/src";

import * as Styled from "./BlockchainPage.styled";
import { BlockchainTabItems } from "./BlockchainTabItems";
import { useBlockchainPage } from "./hooks";

const BlockchainPage: NextPage = () => {
  const router = useRouter();
  const [visible, setVisible] = useState<boolean>(false);
  const { block, tab } = router.query;

  const { pageMeta, blockNum, transactionId } = useBlockchainPage(tab, block);
  const { width } = useViewportContext();
  const blockchainTabItems = BlockchainTabItems(blockNum, transactionId);
  const mobileMenuBreakpoint = 790;
  const renderTabBar = MobileTabBar({
    showMobileMenu: width <= mobileMenuBreakpoint,
    visible,
    tab,
    setVisible,
    defaultKey: "blockchain",
    defaultTab: counterpart.translate(`pages.blocks.blockchain.blockchain`),
    selectedTab: counterpart.translate(`pages.blocks.${tab}.${tab}`),
  });

  return (
    <Layout
      title={`${pageMeta.title}`}
      type="card-lrg"
      heading={`${pageMeta.heading}`}
      description={`${pageMeta.description}`}
      layout="dex"
      onClick={() => {
        if (width <= mobileMenuBreakpoint) {
          visible && setVisible(false);
        }
      }}
    >
      <Styled.BlockchainCard>
        <PageTabs
          renderTabBar={renderTabBar}
          defaultActiveKey={`${tab ? tab : "blockchain"}`}
          onTabClick={(key) => {
            router.push(`/blockchain?tab=${key}`);
            if (width <= mobileMenuBreakpoint) setVisible(false);
          }}
          items={blockchainTabItems}
          destroyInactiveTabPane={true}
        />
      </Styled.BlockchainCard>
    </Layout>
  );
};

export default BlockchainPage;
