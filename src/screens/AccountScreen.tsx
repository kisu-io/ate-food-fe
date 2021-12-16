import React, { useState, useEffect, createRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from "react-native";

import { connect } from "react-redux";

import { ApplicationState, FoodModel, ShoppingState, UserState, onUserLogout } from "../redux";

import { FlatList, ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "../utils";

import { LoginScreen } from "./LoginScreen";

interface AccountScreenProps {
  userReducer: UserState;
  shoppingReducer: ShoppingState;
  onUserLogout: Function;
}

const _AccountScreen: React.FC<AccountScreenProps> = (props) => {
  const { navigate } = useNavigation();

  const { user } = props.userReducer;

  const options = [
    {
      title: "Edit Profile",
      action: () => {
        alert("Edit Profile");
      },
    },
    {
      title: "View Orders",
      action: () => {
        navigate("AccountOrderPage");
      },
    },
    {
      title: "Contact Support",
      action: () => {
        alert("Contact Support");
      },
    },
    {
      title: "Logout",
      action: () => {
        props.onUserLogout();
      },
    },
  ];

  const optionCard = (title: string, action: Function) => {
    return (
      <TouchableOpacity
        key={title}
        onPress={() => action()}
        style={{
          backgroundColor: "#FFF",
          height: 80,
          justifyContent: "space-around",
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          paddingLeft: 20,
          paddingRight: 20,
          borderTopColor: "#D3D3D3",
          borderBottomColor: "#D3D3D3",
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
        }}
      >
        <Text style={{ flex: 1, fontSize: 18, color: "#525252" }}> {title}</Text>
        <Image source={require("../images/arrow_icon.png")} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>
    );
  };

  if (user.token !== undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.navigation}>
          <View
            style={{
              display: "flex",
              height: 60,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 4,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <Image
              source={require("../images/avatar.png")}
              style={{ width: 150, height: 150, marginRight: 20 }}
            />
            <View style={{}}>
              <Text style={{ fontSize: 22, fontWeight: "600" }}>{user.firstName || "Guest"}</Text>
              <Text style={{ fontSize: 18 }}>{user.email}</Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView>
            {options.map(({ title, action }) => {
              return optionCard(title, action);
            })}
          </ScrollView>
        </View>
      </View>
    );
  } else {
    return <LoginScreen />;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  navigation: {
    flex: 3,
    marginTop: 44,
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  body: { flex: 9, display: "flex" },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

const AccountScreen = connect(mapStateToProps, { onUserLogout })(_AccountScreen);

export { AccountScreen };
