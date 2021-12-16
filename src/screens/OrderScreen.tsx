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

import { ApplicationState, onGetOrders, OrderModel, UserState } from "../redux";

import { ButtonWithIcon, OrderCard } from "../components";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "../utils";

interface OrderScreenProps {
  userReducer: UserState;
  onGetOrders: Function;
  navigation: { getParam: Function; goBack: Function };
}

const _OrderScreen: React.FC<OrderScreenProps> = (props) => {
  const { goBack } = props.navigation;
  const { navigate } = useNavigation();

  const { user, orders } = props.userReducer;

  useEffect(() => {
    props.onGetOrders(user);
  }, []);

  const onTapOrder = (order: OrderModel) => {
    navigate("OrderDetailPage", { order });
  };
  const orderView = () => {
    return (
      <View style={styles.container}>
        <View style={styles.navigation}>
          <View
            style={{
              display: "flex",
              height: 60,
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 4,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <ButtonWithIcon
              icon={require("../images/back_arrow.png")}
              onTap={() => goBack()}
              width={20}
              height={20}
            />
            <Text style={{ fontSize: 22, fontWeight: "600", marginLeft: 30 }}>Orders</Text>
          </View>
        </View>

        <View style={styles.body}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={orders}
            renderItem={({ item }) => <OrderCard onTap={() => onTapOrder(item)} item={item} />}
            keyExtractor={(item) => `${item._id}`}
          />
        </View>
        <View style={styles.footer}></View>
      </View>
    );
  };

  if (orders.length > 0) {
    return orderView();
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.navigation}>
          <View
            style={{
              display: "flex",
              height: 60,
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 4,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <ButtonWithIcon
              icon={require("../images/back_arrow.png")}
              onTap={() => goBack()}
              width={20}
              height={20}
            />
            <Text style={{ fontSize: 22, fontWeight: "600", marginLeft: 30 }}>Orders</Text>
          </View>
        </View>
        <View style={styles.body}>
          <Text style={{ fontSize: 25, fontWeight: "600" }}> Your Order is Empty</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  navigation: { flex: 1, marginTop: 43 },
  body: { flex: 9, justifyContent: "center", alignItems: "center" },
  footer: {
    flex: 2,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
  },
  amountDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    margin: 5,
  },
  paymentOptions: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
  },
  options: {
    display: "flex",
    height: 120,
    width: 160,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    padding: 10,
    borderColor: "#A0A0A0",
    backgroundColor: "#F2F2F2",
    borderWidth: 0.2,
    borderRadius: 10,
    margin: 10,
  },

  paymentView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    margin: 5,
    backgroundColor: "#E3BE74",
  },
  icon: {
    width: 115,
    height: 80,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#545252",
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const OrderScreen = connect(mapStateToProps, { onGetOrders })(_OrderScreen);

export { OrderScreen };
