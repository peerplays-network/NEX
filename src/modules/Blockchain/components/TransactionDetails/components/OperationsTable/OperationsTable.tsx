import { SearchTableInput } from "ant-table-extensions";
import { ColumnsType } from "antd/lib/table";
import counterpart from "counterpart";
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
import { TransactionRow } from "../../../BlockDetails/hooks";

import { OperationsColumns } from "./OperationsColumns";
import * as Styled from "./OperationsTable.styled";
import { useOperationsTable } from "./hooks";
import { OperationRow } from "./hooks/useOperationsTable.types";

type Props = {
  transactionRow: TransactionRow;
};

export const OperationsTable = ({ transactionRow }: Props): JSX.Element => {
  const {
    loading,
    showDetails,
    searchDataSource,
    operationsRows,
    setSearchDataSource,
    toggleDetails,
  } = useOperationsTable(transactionRow);
  const { sm } = useViewportContext();
  const componentRef = useRef<HTMLDivElement>(null);

  const renderListItem = useCallback(
    (item: OperationRow, _index: number) => {
      return (
        <Styled.OperationsListItem key={item.number}>
          <Styled.OperationsItemContent>
            <div className="item-info">
              <span className="item-info-title">
                {OperationsColumns[0].title()}
              </span>
              <span className="item-info-value">{item.number}</span>
            </div>
            <div className="item-info">
              <span className="item-info-title">
                {OperationsColumns[1].title()}
              </span>
              <span className="item-info-value">{item.id}</span>
            </div>
            <div className="item-info">
              <span className="item-info-title">
                {OperationsColumns[2].title()}
              </span>
              <span className="item-info-value">{item.type}</span>
            </div>
            <div className="item-info">
              <span className="item-info-title">
                {OperationsColumns[3].title()}
              </span>
              <span className="item-info-value">{item.time}</span>
            </div>
            <div className="item-info">
              <span className="item-info-title">
                {OperationsColumns[4].title()}
              </span>
              <span className="item-info-value">{item.fees}</span>
            </div>
            <div className="item-info">
              <span className="item-info-value">
                <a onClick={toggleDetails}>
                  {counterpart.translate(
                    `pages.blocks.transaction_details.see_details`
                  )}
                </a>
              </span>
            </div>
            <Styled.OperationDetails className={showDetails ? "open" : ""}>
              <p>
                {counterpart.translate(
                  `pages.blocks.transaction_details.details`
                )}
                : {item.details}
              </p>
              <p>
                {counterpart.translate(
                  `pages.blocks.transaction_details.results`
                )}
                : {item.results}
              </p>
            </Styled.OperationDetails>
          </Styled.OperationsItemContent>
        </Styled.OperationsListItem>
      );
    },
    [OperationsColumns, toggleDetails, showDetails]
  );

  const expandedRowRender = useCallback((record: OperationRow) => {
    return (
      <>
        <p style={{ wordBreak: "break-all" }}>
          {counterpart.translate(`pages.blocks.transaction_details.details`)}:{" "}
          {record.details}
        </p>
        <p style={{ wordBreak: "break-all" }}>
          {counterpart.translate(`pages.blocks.transaction_details.results`)}:{" "}
          {record.results}
        </p>
      </>
    );
  }, []);

  return (
    <Styled.TableWrapper>
      <Styled.OperationsHeaderBar>
        <Styled.OperationsHeader>
          {counterpart.translate(`tableHead.operations`)}
          <InfoCircleOutlined />
        </Styled.OperationsHeader>
        <SearchTableInput
          columns={OperationsColumns as ColumnsType<OperationRow>}
          dataSource={operationsRows}
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
          data={operationsRows}
        ></TableDownloader>
      </Styled.OperationsHeaderBar>
      {sm ? (
        <List
          itemLayout="vertical"
          dataSource={searchDataSource}
          loading={loading}
          renderItem={renderListItem}
        />
      ) : (
        <Styled.OperationsTable
          dataSource={searchDataSource}
          columns={OperationsColumns as ColumnsType<OperationRow>}
          expandable={{
            expandedRowRender: expandedRowRender,
            rowExpandable: (record) => record.details !== undefined,
            expandRowByClick: true,
            showExpandColumn: false,
          }}
          loading={loading}
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
          <Styled.OperationsTable
            dataSource={operationsRows}
            columns={OperationsColumns as ColumnsType<OperationRow>}
            loading={loading}
            pagination={false}
          />
        </div>
      </Styled.PrintTable>
    </Styled.TableWrapper>
  );
};
