import React, { useState, useEffect, createRef } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";

import { connect } from "react-redux";

import { ApplicationState, onCancelOrder, OrderModel, UserState } from "../redux";

import { ButtonWithIcon, FoodCard } from "../components";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "../utils";
import moment from "moment";
import { ButtonWithTitle } from "../components/ButtonWithTitle";
interface OrderDetailScreenProps {
  userReducer: UserState;
  onCancelOrder: Function;
  navigation: { getParam: Function; goBack: Function };
}

const _OrderDetailScreen: React.FC<OrderDetailScreenProps> = (props) => {
  const { goBack, getParam } = props.navigation;
  const { user } = props.userReducer;

  const order = getParam("order") as OrderModel;
  const onTapCancelOrder = () => {
    Alert.alert(
      "Do you want to cancel this order?",
      "Cancellation charge may be applied as per terms and condition! \n We will send you cancellation confirmation!",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            props.onCancelOrder(order, user);
            goBack();
          },
        },
      ]
    );
  };

  const headerCard = () => {
    return (
      <View style={{ padding: 10, alignItems: "flex-start" }}>
        <Text style={styles.orderInfo}>
          Order Date: {moment(order.orderDate).format("Do MMM YY, h:mm a")}
        </Text>
        <Text style={styles.orderInfo}>Order Amount: {order.totalAmount}</Text>
        <Text style={styles.orderInfo}>Paid Through: {order.paidThrough}</Text>
        <Text style={styles.orderInfo}>Status: {order.orderStatus}</Text>
      </View>
    );
  };
  const footerCard = () => {
    if (order.orderStatus.toLowerCase() === "cancelled") {
      return (
        <>
          <View
            style={{
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text>Order is Cancelled with ID:</Text>
          </View>
        </>
      );
    } else {
      return (
        <>
          <View
            style={{
              display: "flex",
              margin: 10,
              height: 300,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#c5c5c5",
            }}
          >
            <Text>Map View</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <ButtonWithTitle
              title={"Cancel Order"}
              onTap={() => onTapCancelOrder()}
              height={50}
              width={320}
            />
          </View>
        </>
      );
    }
  };

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
          <Text style={{ fontSize: 22, fontWeight: "600", marginLeft: 30 }}>
            Order ID: {order.orderId}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={order.items}
          renderItem={({ item }) => (
            <FoodCard item={item.food} onTap={() => {}} onUpdateCart={() => {}} unit={item.unit} />
          )}
          keyExtractor={(item) => `${item._id}`}
          ListHeaderComponent={headerCard}
          ListFooterComponent={footerCard}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  navigation: { flex: 1, marginTop: 43 },
  body: { flex: 11, justifyContent: "center", alignItems: "center" },
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
  orderInfo: {
    fontSize: 22,
    color: "#7c7c7c",
    marginBottom: 10,
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const OrderDetailScreen = connect(mapStateToProps, { onCancelOrder })(_OrderDetailScreen);

export { OrderDetailScreen };
