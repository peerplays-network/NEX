import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAppSettingsContext, useUserContext } from "..";
import { useActivity, useFormDate, useLocalStorage } from "../../hooks";
import { ActivityRow, Notification } from "../../types";

type NotificationsContextType = {
  hasUnreadMessages: boolean;
  notifications: Notification[];
  loadingNotifications: boolean;
  markAllNotificationsRead: () => void;
  markTheNotificationAsReadOrUnread: (id: string, unread: boolean) => void;
};

const NotificationsContext = createContext<NotificationsContextType>(
  {} as NotificationsContextType
);

export function useNotificationsContext(): NotificationsContextType {
  return useContext(NotificationsContext);
}

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { localStorageAccount } = useUserContext();
  const { getActivitiesRows } = useActivity();
  const { formLocalDate } = useFormDate();
  const { chainId, settings } = useAppSettingsContext();

  const [notifications, setNotifications] = useLocalStorage(
    `${chainId.slice(0, 8)}_notifications_${localStorageAccount}`
  ) as [Notification[], (value: Notification[] | null) => void];
  const [hasUnreadMessages, _setHasUnreadMessages] = useState<boolean>(false);
  const [loadingNotifications, setLoadingNotifications] =
    useState<boolean>(true);

  const setHasUnreadMessages = (notifications: Notification[]) => {
    for (const notification of notifications) {
      if (notification.unread) {
        _setHasUnreadMessages(true);
        return;
      }
    }
    _setHasUnreadMessages(false);
  };

  const markAllNotificationsRead = () => {
    if (notifications && notifications.length > 0) {
      const newNotifications = notifications.map((notification) => {
        return {
          activity: notification.activity,
          unread: false,
        } as Notification;
      });
      setNotifications(newNotifications);
      _setHasUnreadMessages(false);
    }
  };

  const markTheNotificationAsReadOrUnread = (id: string, unread: boolean) => {
    const newNotifications = notifications.map((notification) => {
      if (notification.activity.id === id) {
        return {
          activity: notification.activity,
          unread: unread,
        } as Notification;
      } else {
        return {
          activity: notification.activity,
          unread: notification.unread,
        } as Notification;
      }
    });
    setNotifications(newNotifications);
    setHasUnreadMessages(newNotifications);
  };

  const formServerNotifications = useCallback(
    (userSelectedserverActivities: ActivityRow[], pastThirtyDaysDate: Date) => {
      const dateFilteredServerActivities = userSelectedserverActivities.filter(
        (serverActivity) => {
          return (
            new Date(formLocalDate(serverActivity.time)) >= pastThirtyDaysDate
          );
        }
      );
      const serverNotifications = dateFilteredServerActivities.map(
        (serverActivity) => {
          return {
            activity: serverActivity,
            unread: true,
          } as Notification;
        }
      );
      return serverNotifications;
    },
    [formLocalDate]
  );

  const addToPreviousNotifications = useCallback(
    (serverNotifications: Notification[], pastThirtyDaysDate: Date) => {
      const filteredLocalNotifications = notifications
        .filter(
          (notification) =>
            new Date(notification.activity.time) > pastThirtyDaysDate
        )
        .filter((notif) =>
          settings.notifications.selectedNotifications.includes(
            notif.activity.type
          )
        );
      if (filteredLocalNotifications.length === 0) {
        return {
          notifications: serverNotifications,
          hasUnread: true,
        };
      } else {
        const lastUpdateNotificationIndex = serverNotifications.findIndex(
          (serverNotification) =>
            serverNotification.activity.id ===
            filteredLocalNotifications[0].activity.id
        );
        const newNotifications = [
          ...serverNotifications.slice(0, lastUpdateNotificationIndex),
          ...filteredLocalNotifications,
        ];
        return {
          notifications: newNotifications,
          hasUnread: undefined,
        };
      }
    },
    [settings]
  );

  const getNotifications: () => Promise<{
    notifications: Notification[];
    hasUnread?: boolean;
  }> = async () => {
    const today = new Date();
    const pastThirtyDaysDate = new Date(
      new Date().setDate(today.getDate() - 30)
    );
    try {
      // User allowed notifications
      if (settings.notifications.allow) {
        const userSelectedserverActivities = (
          await getActivitiesRows(localStorageAccount, false)
        ).filter((activities) =>
          settings.notifications.selectedNotifications.includes(activities.type)
        );

        // User has server activities
        if (userSelectedserverActivities.length > 0) {
          const serverNotifications = formServerNotifications(
            userSelectedserverActivities,
            pastThirtyDaysDate
          );

          // There is no previous notifications
          if (!notifications || notifications.length === 0) {
            return {
              notifications: serverNotifications,
              hasUnread: true,
            };
          } // end of no previous notifications
          else {
            return addToPreviousNotifications(
              serverNotifications,
              pastThirtyDaysDate
            );
          }
        } // end of user has server activities
        else {
          return {
            notifications: [] as Notification[],
            hasUnread: false,
          };
        }
      } // end of allowed Notifications
      else {
        return {
          notifications: [] as Notification[],
          hasUnread: false,
        };
      }
    } catch (e) {
      console.log(e);
      return {
        notifications: [] as Notification[],
        hasUnread: false,
      };
    }
  };

  const updateNotificationsBasedOnLanguage = useCallback(
    async (notifications: Notification[], hasUnread?: boolean) => {
      try {
        const activityRows = await getActivitiesRows(localStorageAccount);
        const updatedNotifications = notifications
          .filter((notif) =>
            activityRows.find((row) => row.id === notif.activity.id)
          )
          .map((notif) => {
            return {
              activity: activityRows.find(
                (row) => row.id === notif.activity.id
              ),
              unread: notif.unread,
            } as Notification;
          });
        setNotifications(updatedNotifications);
        if (hasUnread === undefined) {
          setHasUnreadMessages(updatedNotifications);
        } else {
          _setHasUnreadMessages(hasUnread);
        }
      } catch (e) {
        console.log(e);
        setNotifications([]);
        _setHasUnreadMessages(false);
      }
    },
    [
      localStorageAccount,
      getActivitiesRows,
      setNotifications,
      _setHasUnreadMessages,
      setHasUnreadMessages,
    ]
  );

  const updateNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    const { notifications, hasUnread } = await getNotifications();
    await updateNotificationsBasedOnLanguage(notifications, hasUnread);
    setLoadingNotifications(false);
  }, [
    getNotifications,
    updateNotificationsBasedOnLanguage,
    setLoadingNotifications,
  ]);

  useEffect(() => {
    if (localStorageAccount && localStorageAccount !== "") {
      updateNotifications();
    } else {
      setNotifications(null);
    }
  }, [
    localStorageAccount,
    settings.language,
    settings.notifications.allow,
    settings.notifications.selectedNotifications,
    settings.notifications.selectedNotifications.length,
  ]);

  const notificationContext = useMemo(() => {
    return {
      hasUnreadMessages,
      notifications,
      loadingNotifications,
      markAllNotificationsRead,
      markTheNotificationAsReadOrUnread,
    };
  }, [
    hasUnreadMessages,
    notifications,
    loadingNotifications,
    markAllNotificationsRead,
    markTheNotificationAsReadOrUnread,
  ]);

  return (
    <NotificationsContext.Provider value={notificationContext}>
      {children}
    </NotificationsContext.Provider>
  );
}
