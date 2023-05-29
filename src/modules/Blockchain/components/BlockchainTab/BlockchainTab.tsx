import { SearchTableInput } from "ant-table-extensions";
import { ColumnsType } from "antd/lib/table";
import counterpart from "counterpart";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useRef } from "react";

import {
  renderPaginationItem,
  TableDownloader,
} from "../../../../common/components";
import { useViewportContext } from "../../../../common/providers";
import { InfoCircleOutlined, List, SearchOutlined } from "../../../../ui/src";
import { StatsCard } from "../../common";

import * as Styled from "./BlockchainTab.styled";
import { BlockPrintTable } from "./components";
import { DataTableRow, useBlockchainTab } from "./hooks";

export const BlockchainTab = (): JSX.Element => {
  const {
    loading,
    blockColumns,
    blockchainTableRows,
    blockchainStats,
    currentBlockHeight,
    lastIrreversibleBlock,
    avgTime,
    supply,
    searchDataSource,
    setSearchDataSource,
  } = useBlockchainTab();
  const router = useRouter();
  const { sm } = useViewportContext();
  const componentRef = useRef<HTMLDivElement>(null);
  const renderListItem = useCallback(
    (item: DataTableRow, _index: number) => {
      function onClick() {
        router.push(`/blockchain/${item.blockID}`);
      }
      return (
        <div onClick={onClick}>
          <Styled.BlockListItem key={item.key}>
            <Styled.BlockItemContent>
              <div className="item-info">
                <span className="item-info-title">
                  {blockColumns[0].title()}
                </span>
                <span className="item-info-value">{item.blockID}</span>
              </div>
              <div className="item-info">
                <span className="item-info-title">
                  {blockColumns[1].title()}
                </span>
                <span className="item-info-value">{item.time}</span>
              </div>
              <div className="item-info">
                <span className="item-info-title">
                  {blockColumns[2].title()}
                </span>
                <span className="item-info-value">
                  {" "}
                  <Link href={`/user/${item.witness}`} target="_blank">
                    {item.witness}
                  </Link>
                </span>
              </div>
              <div className="item-info">
                <span className="item-info-title">
                  {blockColumns[3].title()}
                </span>
                <span className="item-info-value">
                  {item.transaction ? item.transaction : 0}
                </span>
              </div>
            </Styled.BlockItemContent>
          </Styled.BlockListItem>
        </div>
      );
    },
    [blockColumns]
  );
  const onRow = useCallback((record: DataTableRow) => {
    return {
      onClick: () => {
        router.push(`/blockchain/${record.blockID}`);
      },
    };
  }, []);

  return (
    <Styled.BlockTabWrapper>
      <Styled.StatsCardsDeck>
        <StatsCard
          noData={currentBlockHeight === 0}
          title={counterpart.translate(
            `pages.blocks.blockchain.current_block_height`
          )}
          data={`${currentBlockHeight}`}
          statsData={blockchainStats.currentBlockHeight}
        />
        <StatsCard
          noData={lastIrreversibleBlock === ""}
          title={counterpart.translate(
            `pages.blocks.blockchain.last_irreversible_block`
          )}
          data={`${lastIrreversibleBlock}`}
          statsData={blockchainStats.lastIrreversible}
        />
        <StatsCard
          isTimeCard={true}
          noData={avgTime === 0}
          title={counterpart.translate(
            `pages.blocks.blockchain.confirmation_time`
          )}
          data={`${avgTime}`}
          statsData={blockchainStats.avgTime}
        />
        <StatsCard
          isRewardCard
          noData={supply.amount === 0}
          title={counterpart.translate(`pages.blocks.blockchain.supply`, {
            symbol: supply.symbol,
          })}
          data={`${supply.amount}`}
          statsData={blockchainStats.supply}
        />
      </Styled.StatsCardsDeck>
      <Styled.BlockHeaderBar>
        <Styled.BlockHeader>
          {counterpart.translate(`pages.blocks.blockchain.recent_blocks`)}
          <InfoCircleOutlined />
        </Styled.BlockHeader>
        <SearchTableInput
          columns={blockColumns as ColumnsType<DataTableRow>}
          dataSource={blockchainTableRows ?? []}
          setDataSource={setSearchDataSource}
          inputProps={{
            placeholder: counterpart.translate(
              `pages.blocks.blockchain.search_blocks`
            ),
            suffix: <SearchOutlined />,
          }}
        />
        <TableDownloader
          componentRef={componentRef}
          data={blockchainTableRows}
        ></TableDownloader>
      </Styled.BlockHeaderBar>
      {sm ? (
        <List
          itemLayout="vertical"
          dataSource={searchDataSource}
          loading={loading && !blockchainTableRows}
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
        <Styled.BlockTable
          dataSource={searchDataSource}
          columns={blockColumns as ColumnsType<DataTableRow>}
          rowKey={(record) => record.blockID}
          loading={loading && !blockchainTableRows}
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 15,
            defaultCurrent: 1,
            showSizeChanger: false,
            showLessItems: true,
            size: "small",
            itemRender: renderPaginationItem(),
          }}
          onRow={onRow}
        />
      )}
      <Styled.PrintTable>
        <BlockPrintTable
          ref={componentRef}
          blockColumns={blockColumns}
          blockchainTableRows={blockchainTableRows ?? []}
          loading={loading && !blockchainTableRows}
        />
      </Styled.PrintTable>
    </Styled.BlockTabWrapper>
  );
};
