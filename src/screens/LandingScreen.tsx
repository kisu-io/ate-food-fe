import React, { useState, useReducer, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image, Alert } from "react-native";

import * as Location from "expo-location";
import { connect } from "react-redux";
import { onUpdateLocation, UserState, ApplicationState } from "../redux";
import { useNavigation } from "../utils";

const screenWidth = Dimensions.get("screen").width;

interface LandingProp {
  userReducer: UserState;
  onUpdateLocation: Function;
}

export const _LandingScreen: React.FC<LandingProp> = (props) => {
  const { userReducer, onUpdateLocation } = props;
  const { navigate } = useNavigation();
  const [address, setAddress] = useState<Location.LocationGeocodedAddress>();

  const [displayAddress, setDisplayAddress] = useState("Waiting for Current Location");

  const showAlert = (title: string, msg: string) => {
    Alert.alert(title, msg, [
      {
        text: "Ok",
        onPress: () => {
          navigate("LocationPage");
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
  useEffect(() => {
    accessDeviceLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navigation} />

      <View style={styles.body}>
        <Image source={require("../images/delivery_icon.png")} style={styles.deliveryIcon} />
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}> Your Delivery Address </Text>
        </View>
        <Text style={styles.addressText}> {displayAddress} </Text>
      </View>

      <View style={styles.footer} />
    </View>
  );
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
  },
  addressText: {
    fontSize: 20,
    fontWeight: "200",
    color: "#4f4f4f",
  },
  footer: {
    flex: 1,
  },
});

const mapToStateProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});
const LandingScreen = connect(mapToStateProps, { onUpdateLocation })(_LandingScreen);

export { LandingScreen };
