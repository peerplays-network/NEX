import {
  AssetDynamicData,
  Block,
  Block2,
  BlockHeader,
  ChainProperties,
  DynamicGlobalProperties,
  GlobalProperties,
} from "../../types";

export type UseBlockchainResult = {
  getDynamicGlobalProperties: () => Promise<
    DynamicGlobalProperties | undefined
  >;
  getAssetDynamicData: () => Promise<AssetDynamicData | undefined>;
  getRecentBlocks: () => Block[];
  getAvgBlockTime: () => number;
  getBlock: (value: number) => Promise<Block | undefined>;
  getBlock2: (value: number) => Promise<Block2 | undefined>;
  getBlocks: (
    first: number,
    last: number,
    limit: number
  ) => Promise<Block[] | undefined>;
  getBlockHeader: (blockNumber: number) => Promise<BlockHeader | undefined>;
  getGlobalProperties: () => Promise<GlobalProperties | undefined>;
  getChainProperties: () => Promise<ChainProperties | undefined>;
};
