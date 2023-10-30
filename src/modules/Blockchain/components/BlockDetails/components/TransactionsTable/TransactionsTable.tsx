import { SearchTableInput } from "ant-table-extensions";
import { ColumnsType } from "antd/lib/table";
import counterpart from "counterpart";
import Link from "next/link";
import { useRouter } from "next/router";
import { RefObject, useCallback, useRef } from "react";

import {
  renderPaginationItem,
  TableDownloader,
} from "../../../../../../common/components";
import { useViewportContext } from "../../../../../../common/providers";
import {
  InfoCircleOutlined,
  List,
  SearchOutlined,
} from "../../../../../../ui/src";
import { TransactionRow } from "../../hooks";

import { TransactionsColumns } from "./TransactionsColumns";
import * as Styled from "./TransactionsTable.styled";
import { useTransactionsTable } from "./hooks";

type Props = {
  block: number;
  transactionRows: TransactionRow[];
  loadingBlockDetails: boolean;
};

export const TransactionsTable = ({
  block,
  transactionRows,
  loadingBlockDetails,
}: Props): JSX.Element => {
  const { searchDataSource, setSearchDataSource } =
    useTransactionsTable(transactionRows);
  const { sm } = useViewportContext();
  const componentRef = useRef<HTMLDivElement>(null);
  const transactionsColumns = TransactionsColumns(block);
  const router = useRouter();
  const renderListItem = useCallback(
    (item: TransactionRow, _index: number) => (
      <Link href={`/blockchain/${block}/${item.id}`}>
        <Styled.TransactionListItem key={item.id}>
          <Styled.TransactionItemContent>
            <div className="item-info">
              <span className="item-info-title">
                {transactionsColumns[0].title()}
              </span>
              <span className="item-info-value">{item.rank}</span>
            </div>
            <div className="item-info">
              <span className="item-info-title">
                {transactionsColumns[1].title()}
              </span>
              <span className="item-info-value">{item.id}</span>
            </div>
            <div className="item-info">
              <span className="item-info-title">
                {transactionsColumns[2].title()}
              </span>
              <span className="item-info-value">{item.expiration}</span>
            </div>
            <div className="item-info">
              <span className="item-info-title">
                {transactionsColumns[3].title()}
              </span>
              <span className="item-info-value">{item.operations.length}</span>
            </div>
            <div className="item-info">
              <span className="item-info-title">
                {transactionsColumns[4].title()}
              </span>
              <span className="item-info-value">{item.refBlockPrefix}</span>
            </div>
            <div className="item-info">
              <span className="item-info-title">
                {transactionsColumns[5].title()}
              </span>
              <span className="item-info-value">{item.refBlockNum}</span>
            </div>
            <div className="item-info">
              <span className="item-info-title">
                {transactionsColumns[6].title()}
              </span>
              <span className="item-info-value">{item.extensions.length}</span>
            </div>
          </Styled.TransactionItemContent>
        </Styled.TransactionListItem>
      </Link>
    ),
    [block, transactionsColumns]
  );

  const onRow = useCallback(
    (record: TransactionRow) => {
      return {
        onClick: () => {
          router.push(`/blockchain/${block}/${record.id}`);
        },
      };
    },
    [block]
  );

  return (
    <Styled.TableWrapper>
      <Styled.TransactionHeaderBar>
        <Styled.TransactionHeader>
          {counterpart.translate(`pages.blocks.block_details.transactions`)}
          <InfoCircleOutlined />
        </Styled.TransactionHeader>
        <SearchTableInput
          columns={transactionsColumns as ColumnsType<TransactionRow>}
          dataSource={transactionRows}
          setDataSource={setSearchDataSource}
          inputProps={{
            placeholder: counterpart.translate(
              `pages.blocks.block_details.search_transactions`
            ),
            suffix: <SearchOutlined />,
          }}
        />
        <TableDownloader
          componentRef={componentRef}
          data={transactionRows}
        ></TableDownloader>
      </Styled.TransactionHeaderBar>
      {sm ? (
        <List
          itemLayout="vertical"
          dataSource={searchDataSource}
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 2,
            defaultCurrent: 1,
            showLessItems: true,
            showSizeChanger: false,
            size: "small",
            itemRender: renderPaginationItem(),
          }}
          loading={loadingBlockDetails}
          renderItem={renderListItem}
        />
      ) : (
        <Styled.TransactionsTable
          dataSource={searchDataSource}
          columns={transactionsColumns as ColumnsType<TransactionRow>}
          loading={loadingBlockDetails}
          rowClassName="pointer"
          onRow={onRow}
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 5,
            defaultCurrent: 1,
            showSizeChanger: false,
            showLessItems: true,
            size: "small",
            itemRender: renderPaginationItem(),
          }}
        />
      )}
      <Styled.PrintTable>
        <div ref={componentRef as unknown as RefObject<HTMLDivElement>}>
          <Styled.TransactionsTable
            dataSource={transactionRows}
            columns={transactionsColumns as ColumnsType<TransactionRow>}
            loading={loadingBlockDetails}
            pagination={false}
          />
        </div>
      </Styled.PrintTable>
    </Styled.TableWrapper>
  );
};
