//done
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useBlockchain } from "../../hooks";
import { FeeParameter } from "../../types";

import { FeesContextType } from "./FeesProvider.types";

type Props = {
  children: React.ReactNode;
};

const defaultFeesState: FeesContextType = {
  feeParameters: [],
  loadingFeeParameters: true,
};

const FeesContext = createContext<FeesContextType>(defaultFeesState);

export const FeesProvider = ({ children }: Props): JSX.Element => {
  const [feeParameters, setFeeParameters] = useState<FeeParameter[]>([]);
  const [loadingFeeParameters, setLoadingFeeParameters] =
    useState<boolean>(true);

  const { getGlobalProperties } = useBlockchain();

  const getFeesFromGlobal = useCallback(async () => {
    try {
      const gpo = await getGlobalProperties();
      const feeParameters = gpo
        ? gpo.parameters.current_fees.parameters
        : undefined;
      return feeParameters;
    } catch (e) {
      console.log(e);
    }
  }, [getGlobalProperties]);

  useEffect(() => {
    let ignore = false;

    async function setFees() {
      setLoadingFeeParameters(true);
      const feeParameters = await getFeesFromGlobal();
      if (!ignore) {
        if (feeParameters) {
          setFeeParameters(feeParameters);
        }
        setLoadingFeeParameters(false);
      }
    }

    setFees();

    return () => {
      ignore = true;
    };
  }, [getFeesFromGlobal, setLoadingFeeParameters, setFeeParameters]);

  const context = useMemo(() => {
    return {
      feeParameters,
      loadingFeeParameters,
    };
  }, [feeParameters, loadingFeeParameters]);
  return (
    <FeesContext.Provider value={context}>{children}</FeesContext.Provider>
  );
};

export const useFeesContext = (): FeesContextType => {
  return useContext<FeesContextType>(FeesContext);
};
