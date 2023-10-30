import counterpart from "counterpart";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { Layout } from "../../../common/components";
import { useViewportContext } from "../../../common/providers";
import { Col } from "../../../ui/src";
import {
  ControlsTabs,
  DepthChart,
  HistoryTabs,
  MarketStats,
  OrderBook,
  PairModal,
  PairSelect,
  PriceChart,
  SmallScreenTabs,
  UsersOrdersTabs,
  Wallet,
} from "../components";

import * as Styled from "./MarketPage.styled";
import { useMarketPage } from "./hooks";

const MarketPage: NextPage = () => {
  const router = useRouter();
  const { pair } = router.query;

  const { lg, xxl } = useViewportContext();
  const {
    isPairModalVisible,
    handleClickOnPair,
    setIsPairModalVisible,
    isOrderDrawerOpen,
    showBuyOrderDrawer,
    showSellOrderDrawer,
    hideOrderDrawer,
    controlsTabsClassName,
    onChangeControlsTab,
  } = useMarketPage({
    currentPair: pair as string,
  });

  const renderHistoryTabs = !xxl ? (
    <Styled.RightBorderedVerticalFlexedCol xxl={{ span: 4 }}>
      {/* Trade History Title */}
      <Styled.HistoryBox>
        <Styled.TradeHistoryContainer>
          <HistoryTabs />
        </Styled.TradeHistoryContainer>
      </Styled.HistoryBox>
    </Styled.RightBorderedVerticalFlexedCol>
  ) : (
    ""
  );

  const renderChartAndOrderBook = (
    <Styled.ChartsAndOrderBookRow>
      {/* Charts Section */}
      {!xxl ? (
        <>
          <Styled.RightBorderedVerticalFlexedCol lg={24} xxl={17}>
            <Styled.PriceChartContainer>
              <PriceChart />
            </Styled.PriceChartContainer>
            <Styled.MarketDepthContainer>
              <DepthChart />
            </Styled.MarketDepthContainer>
          </Styled.RightBorderedVerticalFlexedCol>
          {/* Order Book section */}
          <Col xxl={7}>
            <OrderBook currentPair={pair as string} />
          </Col>
        </>
      ) : (
        <Styled.VerticalFlexedCol lg={24} xxl={16}>
          <Styled.PriceChartContainer>
            <PriceChart />
          </Styled.PriceChartContainer>
        </Styled.VerticalFlexedCol>
      )}
    </Styled.ChartsAndOrderBookRow>
  );

  const renderTabs = !xxl ? (
    <Styled.UserOrdersContainer>
      <UsersOrdersTabs />
    </Styled.UserOrdersContainer>
  ) : (
    <Styled.TabletTabsContainer>
      <SmallScreenTabs />
    </Styled.TabletTabsContainer>
  );

  return (
    <Layout
      title="market"
      type="card-xlrg"
      heading={counterpart.translate(`pages.market.heading`)}
      description={`Market Page | ${pair}`}
      layout="dex"
    >
      {/* Mobile view */}
      {lg ? (
        <Styled.MobilePageWrapper>
          <Styled.MobileAssetSelectorContainer>
            <PairSelect
              handleClickOnPair={handleClickOnPair}
              currentPair={pair as string}
            />
          </Styled.MobileAssetSelectorContainer>
          <Styled.MobileStatsContainer>
            <MarketStats />
          </Styled.MobileStatsContainer>
          <Styled.MobileChartContainer>
            <PriceChart />
          </Styled.MobileChartContainer>
          <Styled.MobileTabsContainer>
            <SmallScreenTabs />
          </Styled.MobileTabsContainer>
          <Styled.Affix offsetBottom={0}>
            <Styled.BuySellWrapper>
              <Styled.BuyButton onClick={showBuyOrderDrawer}>
                {counterpart.translate("pages.market.buy")}
              </Styled.BuyButton>
              <Styled.SellButton onClick={showSellOrderDrawer}>
                {counterpart.translate("pages.market.sell")}
              </Styled.SellButton>
            </Styled.BuySellWrapper>
          </Styled.Affix>
          <Styled.OrderDrawer
            title={counterpart.translate(
              "pages.market.tabs.controls.order_form"
            )}
            onClose={hideOrderDrawer}
            open={isOrderDrawerOpen}
            autoFocus={false}
          >
            <ControlsTabs
              controlsTabsClassName={controlsTabsClassName}
              onChangeControlsTab={onChangeControlsTab}
            />
          </Styled.OrderDrawer>
        </Styled.MobilePageWrapper>
      ) : (
        <Styled.Container>
          <Styled.FullHeightRow>
            {/* Left Section */}
            {renderHistoryTabs}

            {/* Middle Section */}
            <Styled.RightBorderedVerticalFlexedCol
              lg={{ span: 16 }}
              xxl={{ span: 15 }}
            >
              {/* Stats Section */}
              <Styled.StatsBox>
                <MarketStats />
              </Styled.StatsBox>

              {/* Charts and Order book Section */}
              {renderChartAndOrderBook}

              {/* Tabs section */}
              {renderTabs}
            </Styled.RightBorderedVerticalFlexedCol>

            {/* Right section */}
            <Styled.VerticalFlexedCol lg={{ span: 8 }} xxl={{ span: 5 }}>
              {/* Pair Selector */}
              <Styled.PairSelectorContainer>
                <PairSelect
                  handleClickOnPair={handleClickOnPair}
                  currentPair={pair as string}
                />
              </Styled.PairSelectorContainer>

              {/* Limit Order forms */}
              <Styled.LimitOrderFormContainer>
                <ControlsTabs
                  controlsTabsClassName={controlsTabsClassName}
                  onChangeControlsTab={onChangeControlsTab}
                />
              </Styled.LimitOrderFormContainer>

              {/* Wallet Sections */}
              <Styled.WalletContainer>
                <Wallet currentPair={pair as string} />
              </Styled.WalletContainer>
            </Styled.VerticalFlexedCol>
          </Styled.FullHeightRow>
        </Styled.Container>
      )}
      <PairModal
        isVisible={isPairModalVisible}
        setIsVisible={setIsPairModalVisible}
        currentPair={pair as string}
      />
    </Layout>
  );
};

export default MarketPage;
