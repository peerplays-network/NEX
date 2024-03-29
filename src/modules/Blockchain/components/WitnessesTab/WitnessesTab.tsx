import { SearchTableInput } from "ant-table-extensions";
import { ColumnsType } from "antd/lib/table";
import counterpart from "counterpart";
import Link from "next/link";
import { useCallback, useRef } from "react";

import {
  renderPaginationItem,
  TableDownloader,
} from "../../../../common/components";
import { useViewportContext } from "../../../../common/providers";
import {
  InfoCircleOutlined,
  List,
  SearchOutlined,
  Tooltip,
} from "../../../../ui/src";
import { Key } from "../../../../ui/src/icons";
import { StatsCard } from "../../common";

import * as Styled from "./WitnessesTab.styled";
import { WitnessesColumns, WitnessesPrintTable } from "./components";
import { useWitnessesTab, WitnessTableRow } from "./hooks";

export const WitnessesTab = (): JSX.Element => {
  const {
    loading,
    witnessTableRows,
    witnessStats,
    activeWitnesses,
    reward,
    earnings,
    budget,
    nextVote,
    currentWitness,
    searchDataSource,
    setSearchDataSource,
  } = useWitnessesTab();
  const { sm } = useViewportContext();
  const componentRef = useRef<HTMLDivElement>(null);
  const renderListItem = useCallback(
    (item: WitnessTableRow, _index: number) => (
      <Styled.WitnessListItem key={item.key}>
        <Styled.WitnessesItemContent>
          <div className="item-info">
            <span className="item-info-title">
              {WitnessesColumns[0].title()}
            </span>
            <span className="item-info-value">{item.rank}</span>
          </div>
          <div className="item-info">
            <span className="item-info-title">
              {WitnessesColumns[1].title()}
            </span>
            <span className="item-info-value">
              <Link href={`/user/${item.name}`} target="_blank">
                {item.name}
              </Link>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">
              {WitnessesColumns[2].title()}
            </span>
            <span className="item-info-value">
              {item.active === true ? <Styled.ActiveIcon /> : ``}
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">
              {WitnessesColumns[3].title()}
            </span>
            <span className="item-info-value">{item.totalVotes}</span>
          </div>
          <div className="item-info">
            <span className="item-info-title">
              {WitnessesColumns[4].title()}
            </span>
            <span className="item-info-value">
              <Styled.LastBlock>{item.lastBlock}</Styled.LastBlock>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">
              {WitnessesColumns[5].title()}
            </span>
            <span className="item-info-value">
              <Styled.MissedBlocks>{item.missedBlocks}</Styled.MissedBlocks>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">
              {WitnessesColumns[6].title()}
            </span>
            <span className="item-info-value">
              <a href={`${item.url}`} target="_blank">
                <Styled.urlIcon rotate={45} />
              </a>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">
              {WitnessesColumns[7].title()}
            </span>
            <span className="item-info-value">
              <Tooltip placement="top" title={item.publicKey}>
                <span>
                  <Key />
                </span>
              </Tooltip>
            </span>
          </div>
        </Styled.WitnessesItemContent>
      </Styled.WitnessListItem>
    ),
    [WitnessesColumns]
  );

  return (
    <Styled.WitnessesTabWrapper>
      <Styled.StatsCardsDeck>
        <StatsCard
          noData={activeWitnesses === 0}
          title={counterpart.translate(
            `pages.blocks.witnesses.active_witnesses`
          )}
          data={`${activeWitnesses}`}
          statsData={witnessStats.active}
        />
        <StatsCard
          isRewardCard
          noData={reward === 0}
          title={counterpart.translate(`pages.blocks.witnesses.block_reward`)}
          data={`${reward}`}
          statsData={witnessStats.reward}
        />
        <StatsCard
          isRewardCard
          noData={earnings === 0}
          title={counterpart.translate(
            `pages.blocks.witnesses.monthly_earnings`
          )}
          data={`${earnings}`}
          statsData={witnessStats.earnings}
        />
        <StatsCard
          isRewardCard
          noData={budget === 0}
          title={counterpart.translate(`pages.blocks.stats_cards.budget`)}
          data={`${budget}`}
          statsData={witnessStats.budget}
        />
        <StatsCard
          noData={nextVote === ""}
          title={counterpart.translate(`pages.blocks.stats_cards.next_vote`)}
          data={nextVote}
          statsData={witnessStats.nextVote}
        />
        <StatsCard
          noData={currentWitness === ""}
          title={counterpart.translate(
            `pages.blocks.witnesses.current_witness`
          )}
          data={currentWitness}
        />
      </Styled.StatsCardsDeck>
      <Styled.WitnessesHeaderBar>
        <Styled.WitnessesHeader>
          {counterpart.translate(`pages.blocks.witnesses.witnesses`)}
          <InfoCircleOutlined />
        </Styled.WitnessesHeader>
        <SearchTableInput
          columns={WitnessesColumns as ColumnsType<unknown>}
          dataSource={witnessTableRows ?? []}
          setDataSource={setSearchDataSource}
          inputProps={{
            placeholder: counterpart.translate(
              `pages.blocks.witnesses.search_witnesses`
            ),
            suffix: <SearchOutlined />,
          }}
        />
        <TableDownloader
          componentRef={componentRef}
          data={witnessTableRows}
        ></TableDownloader>
      </Styled.WitnessesHeaderBar>
      {sm ? (
        <List
          itemLayout="vertical"
          dataSource={searchDataSource}
          loading={loading && !witnessTableRows}
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
        <Styled.WitnessesTable
          dataSource={searchDataSource}
          columns={WitnessesColumns as ColumnsType<unknown>}
          loading={loading && !witnessTableRows}
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 15,
            defaultCurrent: 1,
            showSizeChanger: false,
            showLessItems: true,
            size: "small",
            itemRender: renderPaginationItem(),
          }}
        />
      )}
      <Styled.PrintTable>
        <WitnessesPrintTable
          ref={componentRef}
          loading={loading && !witnessTableRows}
          witnessesColumns={WitnessesColumns}
          witnessTableRows={witnessTableRows ?? []}
        />
      </Styled.PrintTable>
    </Styled.WitnessesTabWrapper>
  );
};
