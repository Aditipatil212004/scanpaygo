import React, { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapPickerScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: 18.5204,   // Default Pune
    longitude: 73.8567,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={(e) => {
          setSelectedLocation(e.nativeEvent.coordinate);
        }}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} />
        )}
      </MapView>

      {selectedLocation && (
        <Button
          title="Confirm Location"
          onPress={() => {
            navigation.navigate("StaffSignup", {
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
