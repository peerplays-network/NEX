//done
import { useCallback, useEffect, useState } from "react";

import { useBlockchain, useFormDate } from "..";

import { UseMaintenanceResult } from "./useMaintenance.types";

export function useMaintenance(): UseMaintenanceResult {
  const [maintenanceInterval, setMaintenanceInterval] = useState<number>(0);
  const [nextMaintenanceTime, setNextMaintenanceTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { formLocalDate } = useFormDate();
  const { getGlobalProperties, getDynamicGlobalProperties } = useBlockchain();

  const getMaintenance = useCallback(async () => {
    try {
      const [dgpo, gpo] = await Promise.all([
        getDynamicGlobalProperties(),
        getGlobalProperties(),
      ]);
      if (dgpo && gpo) {
        return {
          maintenanceInterval: gpo.parameters.maintenance_interval,
          nextMaintenanceTime: formLocalDate(dgpo.next_maintenance_time, [
            "month",
            "date",
            "year",
            "time",
          ]),
        };
      }
    } catch (e) {
      console.log(e);
    }
  }, [getDynamicGlobalProperties, formLocalDate, getGlobalProperties]);

  useEffect(() => {
    let ignore = false;
    async function setMaintenanceProperties() {
      setLoading(true);
      const maintenanceProperties = await getMaintenance();
      if (!ignore) {
        if (maintenanceProperties) {
          setMaintenanceInterval(maintenanceProperties.maintenanceInterval);
          setNextMaintenanceTime(maintenanceProperties.nextMaintenanceTime);
        }
        setLoading(false);
      }
    }
    setMaintenanceProperties();

    return () => {
      ignore = true;
    };
  }, [getMaintenance]);

  return {
    getMaintenance,
    maintenanceInterval,
    nextMaintenanceTime,
    loading,
  };
}
