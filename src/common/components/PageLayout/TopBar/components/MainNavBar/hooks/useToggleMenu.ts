import { useCallback, useState } from "react";

import { UseToggleMenuResult } from "./useToggleMenu.types";

export function useToggleMenu(): UseToggleMenuResult {
  const [notificationMenuOpen, setNotificationMenuOpen] =
    useState<boolean>(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [mainMenuOpen, setMainMenuOpen] = useState<boolean>(false);

  const toggleMenu = useCallback(
    (menuName: string) => {
      switch (true) {
        case menuName === "notify":
          setProfileMenuOpen(false);
          setMainMenuOpen(false);
          setNotificationMenuOpen(!notificationMenuOpen);
          break;
        case menuName === "profile":
          setNotificationMenuOpen(false);
          setMainMenuOpen(false);
          setProfileMenuOpen(!profileMenuOpen);
          break;
        case menuName === "main":
          setNotificationMenuOpen(false);
          setProfileMenuOpen(false);
          setMainMenuOpen(!mainMenuOpen);
          break;
      }
    },
    [
      notificationMenuOpen,
      profileMenuOpen,
      mainMenuOpen,
      setNotificationMenuOpen,
      setProfileMenuOpen,
      setMainMenuOpen,
    ]
  );

  const closeMenu = useCallback(() => {
    setNotificationMenuOpen(false);
    setProfileMenuOpen(false);
    setMainMenuOpen(false);
  }, [setNotificationMenuOpen, setProfileMenuOpen, setMainMenuOpen]);

  return {
    toggleMenu,
    closeMenu,
    notificationMenuOpen,
    profileMenuOpen,
    mainMenuOpen,
  };
}
