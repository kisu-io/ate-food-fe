import React, { useEffect, useState } from "react";

import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { useNavigation } from "../utils";
import { ButtonWithIcon, SearchBar } from "../components";
import {
  onAvailability,
  UserState,
  ApplicationState,
  ShoppingState,
  Restaurant,
  FoodModel,
} from "../redux";

interface HomeProps {
  userReducer: UserState;
  shoppingReducer: ShoppingState;
  onAvailability: Function;
  onSearchFoods: Function;
}

export const _HomeScreen: React.FC<HomeProps> = (props) => {
  const { navigate } = useNavigation();

  const { location } = props.userReducer;
  const { availability } = props.shoppingReducer;

  const { categories, foods, restaurants } = availability;

  useEffect(() => {
    props.onAvailability(location.postalCode);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <View
          style={{
            marginTop: 50,
            flex: 4,
            backgroundColor: "white",
            paddingLeft: 20,
            paddingRight: 20,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Text>{`${location.name},${location.street},${location.city}`}</Text>
          <Text>Edit Button</Text>
        </View>
        <View
          style={{
            display: "flex",
            height: 60,
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 4,
          }}
        >
          <SearchBar
            didTouch={() => {
              navigate("SearchPage");
            }}
            onTextChange={() => {}}
          />
          <ButtonWithIcon
            onTap={() => {}}
            icon={require("../images/hambar.png")}
            width={50}
            height={40}
          />
        </View>
      </View>
      <View style={styles.body}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  navigation: {
    flex: 2,
  },
  body: {
    flex: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
  },
});

const mapToStateProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
  shoppingReducer: state.shoppingReducer,
});

const HomeScreen = connect(mapToStateProps, { onAvailability })(_HomeScreen);

export { HomeScreen };
