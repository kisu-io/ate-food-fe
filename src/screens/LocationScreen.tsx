import React, { useState, useReducer, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image, Alert } from "react-native";

import * as Location from "expo-location";
import { connect } from "react-redux";
import { onUpdateLocation, UserState, ApplicationState } from "../redux";
import { useNavigation } from "../utils";
import { ButtonWithIcon, LocationPick } from "../components";
import { Point } from "react-native-google-places-autocomplete";

const screenWidth = Dimensions.get("screen").width;

interface LocationProp {
  userReducer: UserState;
  onUpdateLocation: Function;
}

export const _LocationScreen: React.FC<LocationProp> = (props) => {
  const { userReducer, onUpdateLocation } = props;
  const { navigate } = useNavigation();
  const [address, setAddress] = useState<Location.LocationGeocodedAddress>();
  const [isMap, setIsMap] = useState(false);
  const [displayAddress, setDisplayAddress] = useState("Waiting for Current Location");

  const showAlert = (title: string, msg: string) => {
    Alert.alert(title, msg, [
      {
        text: "Ok",
        onPress: () => {
          // navigate to manual add location
        },
      },
    ]);
  };

  const accessDeviceLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        showAlert(
          "Location Permission Needed!",
          "Location Permission needed to access your nearest restaurants!"
        );
        return;
      }

      let location: any = await Location.getCurrentPositionAsync({});

      const { coords } = location;

      if (coords) {
        const { latitude, longitude } = coords;

        let addressResponse: any = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        for (let item of addressResponse) {
          setAddress(item);
          onUpdateLocation(item);
          let currentAddress = `${item.name},${item.street}, ${item.postalCode}, ${item.country}`;
          setDisplayAddress(currentAddress);

          if (currentAddress.length > 0) {
            setTimeout(() => {
              navigate("homeStack");
            }, 2000);
          }

          return;
        }
      } else {
        showAlert(
          "Location Not Found!",
          "Location not found, please enter your location to access your nearest restaurants!"
        );
      }
    } catch (error) {
      console.log(error, "Location error");
      showAlert(
        "Location Permission Needed!",
        "Location Permission needed to access your nearest restaurants!"
      );
    }
  };
  useEffect(() => {}, []);

  const onChangeLocation = (location: Point) => {
    setIsMap(true);
  };

  const pickLocationView = () => {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "row",
            marginTop: 50,
            marginLeft: 15,
          }}
        >
          <ButtonWithIcon
            icon={require("../images/back_arrow.png")}
            onTap={() => navigate("HomePage")}
            width={20}
            height={20}
          />
          <View style={{ display: "flex", flex: 1, marginRight: 5 }}>
            <LocationPick onChangeLocation={onChangeLocation} />
          </View>
        </View>
        <View style={styles.centerMsg}>
          <Image source={require("../images/delivery_icon.png")} style={styles.deliveryIcon} />
          <Text style={styles.addressTitle}> Pick Your Location </Text>
        </View>
      </View>
    );
  };

  const mapView = () => {
    return (
      <View style={styles.container}>
        <Text>Map View</Text>
      </View>
    );
  };
  if (isMap) {
    return mapView();
  } else {
    return pickLocationView();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(242,242,242,1)",
  },
  navigation: {
    flex: 2,
  },
  body: {
    flex: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryIcon: {
    width: 120,
    height: 120,
  },
  addressContainer: {
    width: screenWidth - 100,
    borderBottomColor: "orange",
    borderBottomWidth: 0.5,
    padding: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  addressTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#7D7D7D",
    marginLeft: -40,
  },
  footer: {
    flex: 1,
  },
  centerMsg: { left: "50%", top: "50%", position: "absolute", marginLeft: -80, marginTop: -50 },
});

const mapToStateProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});
const LocationScreen = connect(mapToStateProps, { onUpdateLocation })(_LocationScreen);

export { LocationScreen };
