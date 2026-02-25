import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import Constants from "expo-constants";
import * as Device from "expo-device";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

type NotificationDeviceInfo = {
  expo_push_token: string | null;
  device_type: string;
  device_name: string | null;
  app_version: string | null;
};

type NotificationContextType = {
  deviceInfo: NotificationDeviceInfo | null;
  refreshDeviceInfo: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [deviceInfo, setDeviceInfo] =
    useState<NotificationDeviceInfo | null>(null);

  const loadDeviceInfo = async () => {
    try {
      const token = await registerForPushNotificationsAsync();

      const info: NotificationDeviceInfo = {
        expo_push_token: token,
        device_type: Platform.OS,
        device_name: Device.deviceName ?? Device.modelName,
        app_version:
          Constants.expoConfig?.version ??
          Constants.manifest2?.extra?.expoClient?.version ??
          "1.0.0",
      };

      setDeviceInfo(info);
    } catch (error) {
      console.log("❌ Notification setup failed:", error);
    }
  };

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ deviceInfo, refreshDeviceInfo: loadDeviceInfo }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};