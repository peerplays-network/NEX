import { Dispatch, SetStateAction } from "react";

import { AssetColumnType } from "../../AssetsColumns";

export type AssetTableRow = {
  key: string;
  symbol: string;
  name: string;
  available: number;
  inOrders: string;
};

export type UseAssetsTabResult = {
  loading: boolean;
  assetsColumns: AssetColumnType[];
  searchDataSource: AssetTableRow[];
  setSearchDataSource: Dispatch<SetStateAction<AssetTableRow[]>>;
};
