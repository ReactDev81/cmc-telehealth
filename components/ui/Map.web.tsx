import React from "react";
import { View, Text } from "react-native";

export const PROVIDER_GOOGLE = "google";

export const Marker = () => null;

const MapView = ({ children, style }: any) => {
  return (
    <View 
      style={[{ 
        backgroundColor: "#E2E8F0", 
        alignItems: "center", 
        justifyContent: "center",
        borderRadius: 8,
        overflow: "hidden"
      }, style]}
    >
      <Text style={{ color: "#64748B", fontWeight: "600" }}>
        Map View (Not available on Web)
      </Text>
      {children}
    </View>
  );
};

export default MapView;
