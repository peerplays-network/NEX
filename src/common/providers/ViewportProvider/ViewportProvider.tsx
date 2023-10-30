import React, { createContext, useContext, useEffect, useState } from "react";

import { breakpoints } from "../../../ui/src/breakpoints";

export type Viewport = {
  width: number;
  height: number;
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
};

const ViewportContext = createContext<Viewport>({
  width: 0,
  height: 0,
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false,
});

export function ViewportProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [windowSize, setWindowSize] = useState<Viewport>({
    width: 0,
    height: 0,
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
  });

  const handleResize = (): void => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      xs: window.innerWidth < breakpoints.xs,
      sm: window.innerWidth < breakpoints.sm,
      md: window.innerWidth < breakpoints.md,
      lg: window.innerWidth < breakpoints.lg,
      xl: window.innerWidth < breakpoints.xl,
      xxl: window.innerWidth < breakpoints.xxl,
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <ViewportContext.Provider value={windowSize}>
      {children}
    </ViewportContext.Provider>
  );
}

export const useViewportContext = (): Viewport => {
  return useContext<Viewport>(ViewportContext);
};
