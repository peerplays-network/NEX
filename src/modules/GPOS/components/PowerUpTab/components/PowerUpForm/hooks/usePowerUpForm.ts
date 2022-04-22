import { Form } from "antd";
import { useEffect, useState } from "react";

import { useAsset } from "../../../../../../../common/hooks";
import {
  usePeerplaysApiContext,
  useUserContext,
} from "../../../../../../../common/providers";
import { Asset, GPOSInfoResponse } from "../../../../../../../common/types";

import { GPOSBalances, UsePowerUpForm } from "./usePowerUpForm.types";

export function usePowerUpForm(): UsePowerUpForm {
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] =
    useState<boolean>(false);
  const [gposBalances, setGOPSBalances] = useState<GPOSBalances>();
  const [powerUpForm] = Form.useForm();
  const depositAmount = Form.useWatch("depositAmount", powerUpForm);
  const { id } = useUserContext();
  const { dbApi } = usePeerplaysApiContext();
  const { getAssetById } = useAsset();

  useEffect(() => {
    getGPOSInfo();
  }, [id]);

  useEffect(() => {
    const newBalance = gposBalances?.openingBalance + depositAmount;
    powerUpForm.setFieldsValue({
      newBalance: newBalance + " " + gposBalances?.asset.symbol,
    });
    setGOPSBalances({
      openingBalance: gposBalances?.openingBalance as number,
      newBalance: newBalance,
      asset: gposBalances?.asset as Asset,
    });
  }, [depositAmount]);

  const handlePasswordModalCancel = () => {
    setIsPasswordModalVisible(false);
  };

  const getGPOSInfo = async () => {
    await dbApi("get_gpos_info", [id]).then(
      async (result: GPOSInfoResponse) => {
        if (result) {
          const asset = await getAssetById(result.award.asset_id);
          const openingBalance =
            result.account_vested_balance / 10 ** asset.precision;
          setGOPSBalances({
            openingBalance: openingBalance,
            newBalance: openingBalance,
            asset: asset,
          });
          powerUpForm.setFieldsValue({
            openingBalance: openingBalance + " " + asset.symbol,
            depositAmount: 0,
            newBalance: openingBalance + " " + asset.symbol,
          });
        }
      }
    );
  };
  return {
    powerUpForm,
    submittingPassword,
    isPasswordModalVisible,
    handlePasswordModalCancel,
  };
}
