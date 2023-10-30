import { SearchTableInput } from "ant-table-extensions";
import { ColumnsType } from "antd/lib/table";
import counterpart from "counterpart";
import Link from "next/link";
import { useCallback, useRef } from "react";

import {
  BITCOIN_NETWORK,
  ETHEREUM_NETWORK,
  HIVE_NETWORK,
} from "../../../../api/params";
import {
  renderPaginationItem,
  TableDownloader,
} from "../../../../common/components";
import { useViewportContext } from "../../../../common/providers";
import { InfoCircleOutlined, List, SearchOutlined } from "../../../../ui/src";
import { StatsCard } from "../../common";

import * as Styled from "./SonsTab.styled";
import { SonsColumns, SonsPrintTable } from "./components";
import { SonsTableRow, useSonsTab } from "./hooks";

export const SonsTab = (): JSX.Element => {
  const {
    loading,
    sonsTableRows,
    searchDataSource,
    sonsStats,
    activeBitcoinSons,
    activeEthereumSons,
    activeHiveSons,
    budget,
    nextVote,
    setSearchDataSource,
  } = useSonsTab();
  const { sm } = useViewportContext();
  const componentRef = useRef<HTMLDivElement>(null);

  const expandedRowRender = useCallback((record: SonsTableRow) => {
    return (
      <Styled.ExpandableContainer>
        <Styled.SidechainRow>
          <Styled.SidechainCol span={8}>
            <Styled.ExpandableHeader>
              {counterpart.translate("tableHead.sidechain")}
            </Styled.ExpandableHeader>
          </Styled.SidechainCol>
          <Styled.SidechainCol span={8}>
            <Styled.ExpandableHeader>
              {counterpart.translate("tableHead.active")}
            </Styled.ExpandableHeader>
          </Styled.SidechainCol>
          <Styled.SidechainCol span={8}>
            <Styled.ExpandableHeader>
              {counterpart.translate("tableHead.total_votes")}
            </Styled.ExpandableHeader>
          </Styled.SidechainCol>
        </Styled.SidechainRow>

        <Styled.SidechainRow>
          <Styled.SidechainCol span={8}>{BITCOIN_NETWORK}</Styled.SidechainCol>
          <Styled.SidechainCol span={8}>
            <span>{record.bitcoinActive ? <Styled.ActiveIcon /> : ``}</span>
          </Styled.SidechainCol>
          <Styled.SidechainCol span={8}>
            {record.bitcoinTotalVotes ? record.bitcoinTotalVotes : ""}
          </Styled.SidechainCol>
        </Styled.SidechainRow>

        <Styled.SidechainRow>
          <Styled.SidechainCol span={8}>{ETHEREUM_NETWORK}</Styled.SidechainCol>
          <Styled.SidechainCol span={8}>
            <span>{record.ethereumActive ? <Styled.ActiveIcon /> : ``}</span>
          </Styled.SidechainCol>
          <Styled.SidechainCol span={8}>
            {record.ethereumTotalVotes ? record.ethereumTotalVotes : ""}
          </Styled.SidechainCol>
        </Styled.SidechainRow>

        <Styled.SidechainRow>
          <Styled.SidechainCol span={8}>{HIVE_NETWORK}</Styled.SidechainCol>
          <Styled.SidechainCol span={8}>
            <span>{record.hiveActive ? <Styled.ActiveIcon /> : ``}</span>
          </Styled.SidechainCol>
          <Styled.SidechainCol span={8}>
            {record.hiveTotalVotes ? record.hiveTotalVotes : ""}
          </Styled.SidechainCol>
        </Styled.SidechainRow>
      </Styled.ExpandableContainer>
    );
  }, []);

  const renderListItem = useCallback(
    (item: SonsTableRow) => (
      <Styled.SonListItem key={item.key}>
        <Styled.SonItemContent>
          <div className="item-info">
            <span className="item-info-title">{SonsColumns[0].title()}</span>
            <span className="item-info-value">{item.rank}</span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{SonsColumns[1].title()}</span>
            <span className="item-info-value">
              <Link target="_blank" href={`/user/${item.name}`}>
                {item.name}
              </Link>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{SonsColumns[2].title()}</span>
            <span className="item-info-value">{item.accountId}</span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{SonsColumns[3].title()}</span>
            <span className="item-info-value">
              <a target="_blank" href={`${item.url}`}>
                <Styled.urlIcon rotate={45} />
              </a>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{SonsColumns[4].title()}</span>
            <span className="item-info-value">
              {item.activeChains.join(", ")}
            </span>
          </div>

          <Styled.ItemHeader>
            {counterpart.translate("tableHead.active_on")}
          </Styled.ItemHeader>
          <Styled.IndentedListItem>
            <div className="item-info">
              <span className="item-info-title">{BITCOIN_NETWORK}</span>
              <span className="item-info-value">
                {item.bitcoinActive ? <Styled.ActiveIcon /> : ``}
              </span>
            </div>
          </Styled.IndentedListItem>
          <Styled.IndentedListItem>
            <div className="item-info">
              <span className="item-info-title">{ETHEREUM_NETWORK}</span>
              <span className="item-info-value">
                {item.ethereumActive ? <Styled.ActiveIcon /> : ``}
              </span>
            </div>
          </Styled.IndentedListItem>
          <Styled.IndentedListItem>
            <div className="item-info">
              <span className="item-info-title">{HIVE_NETWORK}</span>
              <span className="item-info-value">
                {item.hiveActive ? <Styled.ActiveIcon /> : ``}
              </span>
            </div>
          </Styled.IndentedListItem>

          <Styled.ItemHeader>
            {counterpart.translate("tableHead.total_votes_on")}
          </Styled.ItemHeader>
          <Styled.IndentedListItem>
            <div className="item-info">
              <span className="item-info-title">{BITCOIN_NETWORK}</span>
              <span className="item-info-value">
                {item.bitcoinTotalVotes !== undefined
                  ? item.bitcoinTotalVotes
                  : ``}
              </span>
            </div>
          </Styled.IndentedListItem>
          <Styled.IndentedListItem>
            <div className="item-info">
              <span className="item-info-title">{ETHEREUM_NETWORK}</span>
              <span className="item-info-value">
                {item.ethereumTotalVotes !== undefined
                  ? item.ethereumTotalVotes
                  : ``}
              </span>
            </div>
          </Styled.IndentedListItem>
          <Styled.IndentedListItem>
            <div className="item-info">
              <span className="item-info-title">{HIVE_NETWORK}</span>
              <span className="item-info-value">
                {item.hiveTotalVotes !== undefined ? item.hiveTotalVotes : ``}
              </span>
            </div>
          </Styled.IndentedListItem>
        </Styled.SonItemContent>
      </Styled.SonListItem>
    ),
    []
  );
  return (
    <Styled.SonsTabWrapper>
      <Styled.StatsCardsDeck>
        <StatsCard
          noData={activeBitcoinSons === 0}
          title={counterpart.translate(
            `pages.blocks.sons.active_sons.bitcoin_active_sons`
          )}
          data={`${activeBitcoinSons}`}
          statsData={sonsStats.activeBitcoin}
        />
        <StatsCard
          noData={activeEthereumSons === 0}
          title={counterpart.translate(
            `pages.blocks.sons.active_sons.ethereum_active_sons`
          )}
          data={`${activeEthereumSons}`}
          statsData={sonsStats.activeEthereum}
        />
        <StatsCard
          noData={activeHiveSons === 0}
          title={counterpart.translate(
            `pages.blocks.sons.active_sons.hive_active_sons`
          )}
          data={`${activeHiveSons}`}
          statsData={sonsStats.activeHive}
        />
        <StatsCard
          isRewardCard
          noData={budget === 0}
          title={counterpart.translate(`pages.blocks.stats_cards.budget`)}
          data={`${budget}`}
          statsData={sonsStats.budget}
        />
        <StatsCard
          noData={nextVote === ""}
          title={counterpart.translate(`pages.blocks.stats_cards.next_vote`)}
          data={nextVote}
          statsData={sonsStats.nextVote}
        />
      </Styled.StatsCardsDeck>
      <Styled.SonsHeaderBar>
        <Styled.SonsHeader>
          {counterpart.translate(`pages.blocks.sons.sons`)}
          <InfoCircleOutlined />
        </Styled.SonsHeader>
        <SearchTableInput
          columns={SonsColumns as ColumnsType<unknown>}
          dataSource={sonsTableRows ?? []}
          setDataSource={setSearchDataSource}
          inputProps={{
            placeholder: counterpart.translate(`pages.blocks.sons.search_sons`),
            suffix: <SearchOutlined />,
          }}
        />
        <TableDownloader
          componentRef={componentRef}
          data={sonsTableRows}
        ></TableDownloader>
      </Styled.SonsHeaderBar>
      {sm ? (
        <List
          itemLayout="vertical"
          dataSource={searchDataSource}
          loading={loading && !sonsTableRows}
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 5,
            defaultCurrent: 1,
            showLessItems: true,
            showSizeChanger: false,
            size: "small",
            itemRender: renderPaginationItem(),
          }}
          renderItem={renderListItem}
        />
      ) : (
        <Styled.SonsTable
          dataSource={searchDataSource}
          columns={SonsColumns as ColumnsType<unknown>}
          loading={loading && !sonsTableRows}
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 15,
            defaultCurrent: 1,
            showSizeChanger: false,
            showLessItems: true,
            size: "small",
            itemRender: renderPaginationItem(),
          }}
          expandable={{
            expandedRowRender: expandedRowRender,
            expandRowByClick: true,
          }}
        />
      )}
      <Styled.PrintTable>
        <SonsPrintTable
          ref={componentRef}
          loading={loading && !sonsTableRows}
          sonsTableRows={sonsTableRows ?? []}
          sonsColumns={SonsColumns}
        />
      </Styled.PrintTable>
    </Styled.SonsTabWrapper>
  );
};
