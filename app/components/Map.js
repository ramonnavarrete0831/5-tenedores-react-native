import React from "react";
import { Linking } from "react-native";
import MapView from "react-native-maps";

export default function Map(props) {
  const { location, name, height } = props;

  const openAppMap = () => {
    Linking.openURL(
      "http://maps.google.com/?q=" +
        location.latitude +
        "," +
        location.longitude
    );
  };

  return (
    <MapView
      onPress={openAppMap}
      style={{ height: height, width: "100%" }}
      initialRegion={location}
    >
      <MapView.Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
      />
    </MapView>
  );
}
