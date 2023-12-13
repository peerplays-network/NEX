import { useCallback } from "react";

import { useAsset } from "..";
import { utils } from "../../../api/utils";
import { usePeerplaysApiContext } from "../../providers";
import { GPOSInfoType } from "../../types";

import { GPOSInfo, GposPerformance, UseGposResult } from "./useGpos.types";

export function useGpos(): UseGposResult {
  const { dbApi } = usePeerplaysApiContext();
  const { getAssetById, setPrecision } = useAsset();

  const getPerformanceString = useCallback(
    (qualifiedReward: number): GposPerformance => {
      switch (true) {
        case qualifiedReward === 100:
          return GposPerformance.MAX_REWARDS;
        case qualifiedReward > 83.33 && qualifiedReward < 100:
          return GposPerformance.GREATE_REWARDS;
        case qualifiedReward > 66.66 && qualifiedReward <= 83.33:
          return GposPerformance.GOOD_REWARDS;
        case qualifiedReward > 50 && qualifiedReward <= 66.66:
          return GposPerformance.OK_REWARDS;
        case qualifiedReward > 33.33 && qualifiedReward <= 50:
          return GposPerformance.LOW_REWARDS;
        case qualifiedReward > 16.68 && qualifiedReward <= 33.33:
          return GposPerformance.LOWER_REWARDS;
        case qualifiedReward >= 1 && qualifiedReward <= 16.68:
          return GposPerformance.CRITICAL_LOW;
        default:
          return GposPerformance.NO_REWARDS;
      }
    },
    []
  );

  const getGposInfo = useCallback(
    async (accountId: string) => {
      try {
        const rawGposInfo: GPOSInfoType = await dbApi("get_gpos_info", [
          accountId,
        ]);
        if (rawGposInfo) {
          const asset = await getAssetById(rawGposInfo.award.asset_id);
          if (asset) {
            const totalBlockchainGPOS =
              rawGposInfo.total_amount / 10 ** asset.precision;
            const vestingFactor = parseFloat(rawGposInfo.vesting_factor);
            const qualifiedReward = utils.trimNum(vestingFactor * 100 || 0, 2);
            const performance = getPerformanceString(qualifiedReward);
            const gposInfo: GPOSInfo = {
              gposBalance: setPrecision(
                true,
                rawGposInfo.account_vested_balance,
                asset.precision
              ),
              performance: performance,
              qualifiedReward: qualifiedReward,
              rakeReward: utils.trimNum(
                (rawGposInfo.account_vested_balance /
                  10 ** asset.precision /
                  totalBlockchainGPOS) *
                  utils.trimNum(vestingFactor * 100 || 0, 2),
                2
              ),
              availableBalance:
                rawGposInfo.allowed_withdraw_amount / 10 ** asset.precision,
              symbol: asset.symbol,
            };
            return gposInfo;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    [dbApi, getAssetById, getPerformanceString]
  );

  return {
    getGposInfo,
    getPerformanceString,
  };
}
