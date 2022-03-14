import { useViewportContext } from "../../../../common/components/ViewportProvider";
import { List } from "../../../../ui/src";
import { breakpoints } from "../../../../ui/src/breakpoints";
import { AssetActionButton } from "../AssetActionButton";
import { AssetTitle } from "../AssetTitle";

import * as Styled from "./AssetsTable.styled";
import { useAssetsTab } from "./hooks";

type Props = {
  showActions?: boolean;
  fillterAsset?: string;
};

const columns = [
  {
    title: "Asset",
    dataIndex: "asset",
    key: "asset",
  },
  {
    title: "Available",
    dataIndex: "available",
    key: "available",
  },
  {
    title: "Price (BTC)",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Change (24 hrs)",
    dataIndex: "change",
    key: "change",
  },
  {
    title: "Volume",
    dataIndex: "volume",
    key: "volume",
  },
  {
    title: "",
    dataIndex: "transfer",
    key: "transfer",
    render: (_value: any, record: any) => (
      <AssetActionButton
        txt="Transfer"
        href={`/wallet/${record.asset}?tab=transfer`}
      />
    ),
  },
  {
    title: "",
    dataIndex: "withdraw",
    key: "withdraw",
    render: (_value: any, record: any) => (
      <AssetActionButton
        txt="Withdraw"
        href={`/wallet/${record.asset}?tab=withdraw`}
      />
    ),
  },
  {
    title: "",
    dataIndex: "deposit",
    key: "deposit",
    render: (_value: any, record: any) => (
      <AssetActionButton
        txt="Deposit"
        href={`/wallet/${record.asset}?tab=deposit`}
      />
    ),
  },
];

export const AssetsTable = ({
  showActions = true,
  fillterAsset = "",
}: Props): JSX.Element => {
  const { tableAssets, loading } = useAssetsTab();
  const { width } = useViewportContext();

  return (
    <>
      {width > breakpoints.sm ? (
        <Styled.AssetsTable
          columns={
            showActions ? columns : columns.filter((item) => item.title !== "")
          }
          dataSource={
            fillterAsset === ""
              ? tableAssets
              : tableAssets.filter((item) => item.asset === fillterAsset)
          }
          loading={loading}
          pagination={false}
          size="small"
        />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={
            fillterAsset === ""
              ? tableAssets
              : tableAssets.filter((item) => item.asset === fillterAsset)
          }
          loading={loading}
          renderItem={(item) => (
            <Styled.AssetListItem
              key={item.key}
              actions={
                showActions
                  ? [
                      <AssetActionButton
                        txt="Transfer"
                        href={`/wallet/${item.asset}?tab=transfer`}
                      />,
                      <AssetActionButton
                        txt="Withdraw"
                        href={`/wallet/${item.asset}?tab=withdraw`}
                      />,
                      <AssetActionButton
                        txt="Deposit"
                        href={`/wallet/${item.asset}?tab=deposit`}
                      />,
                    ]
                  : []
              }
            >
              <AssetTitle symbol={item.asset} />
              <Styled.AssetsItemContent>
                <div className="asset-info">
                  <span className="asset-info-title">{columns[1].title}</span>
                  <span className="asset-info-value">{item.available}</span>
                </div>
                <div className="asset-info">
                  <span className="asset-info-title">{columns[2].title}</span>
                  <span className="asset-info-value">{item.price}</span>
                </div>
                <div className="asset-info">
                  <span className="asset-info-title">{columns[3].title}</span>
                  <span className="asset-info-value">{item.change}</span>
                </div>
                <div className="asset-info">
                  <span className="asset-info-title">{columns[4].title}</span>
                  <span className="asset-info-value">{item.volume}</span>
                </div>
              </Styled.AssetsItemContent>
            </Styled.AssetListItem>
          )}
        />
      )}
    </>
  );
};