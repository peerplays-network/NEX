import { SearchTableInput } from "ant-table-extensions";
import { ColumnsType } from "antd/lib/table";
import counterpart from "counterpart";
import { useRef } from "react";

import {
  renderPaginationItem,
  TableDownloader,
} from "../../../../common/components";
import { useViewportContext } from "../../../../common/providers";
import {
  InfoCircleOutlined,
  List,
  SearchOutlined,
  Tag,
} from "../../../../ui/src";
import { colors } from "../../../../ui/src/colors";

import * as Styled from "./FeesTab.styled";
import { FeesColumns, FeesPrintTable } from "./components";
import { FeesTableRow, useFeesTab } from "./hooks";

export const FeesTab = (): JSX.Element => {
  const { searchDataSource, fullFeesRows, setSearchDataSource } = useFeesTab();
  const { sm } = useViewportContext();
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <Styled.FeesTabWrapper>
      <Styled.FeesHeaderBar>
        <Styled.FeesHeader>
          {counterpart.translate(`pages.blocks.fees.fees`)}
          <InfoCircleOutlined />
        </Styled.FeesHeader>
        <SearchTableInput
          columns={FeesColumns as ColumnsType<unknown>}
          dataSource={fullFeesRows}
          setDataSource={setSearchDataSource}
          inputProps={{
            placeholder: counterpart.translate(`pages.blocks.fees.search_fees`),
            suffix: <SearchOutlined />,
          }}
        />
        <TableDownloader
          componentRef={componentRef}
          data={fullFeesRows}
        ></TableDownloader>
      </Styled.FeesHeaderBar>

      {sm ? (
        <List
          itemLayout="vertical"
          dataSource={searchDataSource}
          loading={!fullFeesRows}
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 5,
            defaultCurrent: 1,
            showLessItems: true,
            showSizeChanger: false,
            size: "small",
            itemRender: renderPaginationItem(),
          }}
          renderItem={(item: FeesTableRow) => (
            <Styled.FeeListItem key={item.operation}>
              <Styled.FeeItemContent>
                <div className="item-info">
                  <span className="item-info-title">
                    {FeesColumns[0].title()}
                  </span>
                  <Styled.FeeTypeOrValueContainer>
                    <span key={`${item.category}`} className="item-info-value">
                      {item.category}
                    </span>
                  </Styled.FeeTypeOrValueContainer>
                </div>
                {item.operation === "" ? (
                  ""
                ) : (
                  <div className="item-info">
                    <span className="item-info-title">
                      {FeesColumns[1].title()}
                    </span>
                    <span className="item-info-value">
                      <Tag key={item.operation} bgColor={colors.assetTag}>
                        {item.operation}
                      </Tag>
                    </span>
                  </div>
                )}
                <div className="item-info">
                  <span className="item-info-title">
                    {FeesColumns[2].title()}
                  </span>
                  <Styled.FeeTypeOrValueContainer>
                    {item.types.map((type) => (
                      <span
                        key={`${item.operation}-${type}`}
                        className="item-info-value"
                      >
                        {type}
                      </span>
                    ))}
                  </Styled.FeeTypeOrValueContainer>
                </div>
                <div className="item-info">
                  <span className="item-info-title">
                    {FeesColumns[3].title()}
                  </span>
                  <Styled.FeeTypeOrValueContainer>
                    {item.fees.map((fee, index) => (
                      <span
                        key={`${item.operation}-${item.types[index]}-${fee}`}
                        className="item-info-value"
                      >
                        {fee}
                      </span>
                    ))}
                  </Styled.FeeTypeOrValueContainer>
                </div>
              </Styled.FeeItemContent>
            </Styled.FeeListItem>
          )}
        />
      ) : (
        <Styled.FeesTable
          dataSource={searchDataSource}
          columns={FeesColumns as ColumnsType<unknown>}
          loading={!fullFeesRows}
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
        <FeesPrintTable
          ref={componentRef}
          loading={!fullFeesRows}
          feesColumns={FeesColumns}
          fullFeesRows={fullFeesRows ?? []}
        />
      </Styled.PrintTable>
    </Styled.FeesTabWrapper>
  );
};
