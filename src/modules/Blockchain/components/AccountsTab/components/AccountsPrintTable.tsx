import { ColumnsType } from "antd/lib/table";
import React from "react";

import * as Styled from "../AccountsTab.styled";
import { AccountColumnType, AccountsTableRow } from "../hooks";

type Props = {
  loading: boolean;
  accountColumns: AccountColumnType[];
  accountTableRows: AccountsTableRow[];
};

export const AccountsPrintTable = React.forwardRef(
  (props: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref}>
        <Styled.AccountsTable
          dataSource={props.accountTableRows}
          columns={props.accountColumns as ColumnsType<AccountsTableRow>}
          loading={props.loading}
          pagination={false}
        />
      </div>
    );
  }
);
