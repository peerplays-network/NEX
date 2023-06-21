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

import * as Styled from "./AccountsTab.styled";
import { AccountColumns, AccountsPrintTable } from "./components";
import { AccountsTableRow, useAccountsTab } from "./hooks";

export const AccountsTab = (): JSX.Element => {
  const router = useRouter();
  const { sm } = useViewportContext();
  const componentRef = useRef<HTMLDivElement>(null);

  const {
    loading,
    accountsColumns,
    accountsTableRows,
    searchDataSource,
    setSearchDataSource,
  } = useAccountsTab();
  const renderListItem = useCallback(
    (item: AccountsTableRow, _index: number) => {
      function onClick() {
        router.push(`/user/${item.AccountName}`);
      }
      return (
        <div onClick={onClick}>
          <Styled.AccountsListItem key={item.key}>
            <Styled.AccountsItemContent>
              <div className="item-info">
                <span className="item-info-title">
                  {accountsColumns[0].title()}
                </span>
                <span className="item-info-value">{item.AccountID}</span>
              </div>
              <div className="item-info">
                <span className="item-info-title">
                  {accountsColumns[1].title()}
                </span>
                <span className="item-info-value">
                  {" "}
                  <Link href={`/user/${item.AccountName}`} target="_blank">
                    {item.AccountName}
                  </Link>
                </span>
              </div>
              <div className="item-info">
                <span className="item-info-title">
                  {accountsColumns[2].title()}
                </span>
                <span className="item-info-value">{item.Balance}</span>
              </div>
            </Styled.AccountsItemContent>
          </Styled.AccountsListItem>
        </div>
      );
    },
    [accountsColumns]
  );

  const onRow = useCallback((record: AccountsTableRow) => {
    return {
      onClick: () => {
        router.push(`/user/${record.AccountName}`);
      },
    };
  }, []);
  return (
    <Styled.AccountsTabWrapper>
      <Styled.AccountsHeaderBar>
        <Styled.AccountsHeader>
          {counterpart.translate(`pages.blocks.accounts.accounts`)}
          <InfoCircleOutlined />
        </Styled.AccountsHeader>
        <SearchTableInput
          columns={AccountColumns as ColumnsType<AccountsTableRow>}
          dataSource={accountsTableRows ?? []}
          setDataSource={setSearchDataSource}
          inputProps={{
            placeholder: counterpart.translate(
              `pages.blocks.accounts.search_accounts`
            ),
            suffix: <SearchOutlined />,
          }}
        />
        <TableDownloader
          componentRef={componentRef}
          data={accountsTableRows}
        ></TableDownloader>
      </Styled.AccountsHeaderBar>
      {sm ? (
        <List
          itemLayout="vertical"
          dataSource={searchDataSource ?? []}
          loading={loading && !accountsTableRows}
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
        <Styled.AccountsTable
          dataSource={searchDataSource ?? []}
          columns={AccountColumns as ColumnsType<AccountsTableRow>}
          loading={loading && !accountsTableRows}
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
        <AccountsPrintTable
          ref={componentRef}
          accountTableRows={accountsTableRows ?? []}
          loading={loading && !accountsTableRows}
          accountColumns={AccountColumns}
        />
      </Styled.PrintTable>
    </Styled.AccountsTabWrapper>
  );
};
