//done
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { defaultToken } from "../../../api/params";
import { Asset, GlobalProperties } from "../../types";
import { usePeerplaysApiContext } from "../PeerplaysApiProvider";

import { AssetsContextType } from "./AssetsProvider.types";

type Props = {
  children: React.ReactNode;
};

const defaultAssetsState: AssetsContextType = {
  defaultAsset: undefined,
  sidechainAssets: [],
  loadingSidechainAssets: true,
  loadingDefaultAsset: true,
};

const AssetsContext = createContext<AssetsContextType>(defaultAssetsState);

export const AssetsProvider = ({ children }: Props): JSX.Element => {
  const [loadingDefaultAsset, setLoadingDefaultAsset] = useState<boolean>(true);
  const [defaultAsset, _setDefaultAsset] = useState<Asset>();
  const [loadingSidechainAssets, setLoadingSidechainAssets] =
    useState<boolean>(true);
  const [sidechainAssets, _setSidechainAssets] = useState<
    (Asset | undefined)[]
  >([]);
  const { dbApi } = usePeerplaysApiContext();

  const getDefaultAsset = useCallback(async () => {
    try {
      const assets = await dbApi("lookup_asset_symbols", [[defaultToken]]);
      if (assets && assets.length) {
        const defaultAsset: Asset = assets[0];
        return defaultAsset;
      } else {
        return undefined;
      }
    } catch (e) {
      console.log(e);
    }
  }, [dbApi, defaultToken]);

  const getAssetsByIds = useCallback(
    async (ids: string[]) => {
      try {
        const assets = await dbApi("get_assets", [ids]);
        if (assets && assets.length) {
          return assets as (Asset | undefined)[];
        } else {
          return undefined;
        }
      } catch (e) {
        console.log(e);
      }
    },
    [dbApi]
  );

  const getSidechainAssets = useCallback(async () => {
    try {
      const gpo: GlobalProperties | undefined = await dbApi(
        "get_global_properties"
      );
      if (gpo) {
        const btcAssetId = gpo.parameters.extensions.btc_asset;
        const hbdAssetId = gpo.parameters.extensions.hbd_asset;
        const hiveAssetId = gpo.parameters.extensions.hive_asset;
        const ethAssetId = gpo.parameters.extensions.eth_asset;

        const sidechainAssetsIds = [
          btcAssetId,
          hbdAssetId,
          hiveAssetId,
          ethAssetId,
        ];

        const sidechainAssets = await getAssetsByIds(sidechainAssetsIds);
        return sidechainAssets;
      }
    } catch (e) {
      console.log(e);
    }
  }, [dbApi, getAssetsByIds]);

  useEffect(() => {
    let ignore = false;
    async function setDefaultAsset() {
      setLoadingDefaultAsset(true);
      const defaultAsset = await getDefaultAsset();
      if (!ignore) {
        _setDefaultAsset(defaultAsset);
        setLoadingDefaultAsset(false);
      }
    }
    setDefaultAsset();
    return () => {
      ignore = true;
    };
  }, [getDefaultAsset, setLoadingDefaultAsset, _setDefaultAsset]);

  useEffect(() => {
    let ignore = false;

    async function setSidechainAssets() {
      setLoadingSidechainAssets(true);
      const sidechainAssets = await getSidechainAssets();
      if (!ignore) {
        if (sidechainAssets) {
          _setSidechainAssets(sidechainAssets);
        }
        setLoadingSidechainAssets(false);
      }
    }

    setSidechainAssets();

    return () => {
      ignore = true;
    };
  }, [getSidechainAssets, setLoadingSidechainAssets, _setSidechainAssets]);

  const context = useMemo(() => {
    return {
      defaultAsset,
      sidechainAssets,
      loadingSidechainAssets,
      loadingDefaultAsset,
    };
  }, [
    defaultAsset,
    sidechainAssets,
    loadingSidechainAssets,
    loadingDefaultAsset,
  ]);

  return (
    <AssetsContext.Provider value={context}>{children}</AssetsContext.Provider>
  );
};

export const useAssetsContext = (): AssetsContextType => {
  return useContext<AssetsContextType>(AssetsContext);
};
