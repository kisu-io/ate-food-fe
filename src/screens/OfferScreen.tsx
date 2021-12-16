import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { connect } from "react-redux";
import {
  ApplicationState,
  ShoppingState,
  UserState,
  onGetOffers,
  OfferModel,
  onApplyOffer,
} from "../redux";

import { ButtonWithIcon, OfferCard } from "../components";
import { FlatList } from "react-native-gesture-handler";

import { checkExistence, useNavigation } from "../utils";

interface OfferScreenProps {
  userReducer: UserState;
  shoppingReducer: ShoppingState;
  onGetOffers: Function;
  onApplyOffer: Function;
}

const _OfferScreen: React.FC<OfferScreenProps> = ({
  userReducer,
  shoppingReducer,
  onGetOffers,
  onApplyOffer,
}) => {
  const { navigate } = useNavigation();
  const { location, Cart, appliedOffer } = userReducer;
  const { offers } = shoppingReducer;
  useEffect(() => {
    onGetOffers(location.postalCode);
  }, []);

  const onTapApplyOffer = (item: OfferModel) => {
    let total = 0;
    if (Array.isArray(Cart)) {
      Cart.map((food) => {
        total += food.price * food.unit;
      });
    }
    const taxAmount = (total / 100) * 0.9 + 40;
    const orderAmount = taxAmount + total;
    if (orderAmount > item.minValue) {
      onApplyOffer(item, false);
      showAlert("Offer Applied", `Offer Applied with discount of ${item.offerPercentage}%`);
    } else {
      showAlert(
        "Offer Invalid",
        `This offer is applicable with minimum value of ${item.minValue} only`
      );
    }
  };
  const showAlert = (title: string, msg: string) => {
    Alert.alert(title, msg, [{ text: "OK", onPress: () => {} }]);
  };
  const onTapRemoveOffer = (item: OfferModel) => {
    onApplyOffer(item, true);
  };

  const checkIfExist = (item: OfferModel) => {
    if (appliedOffer._id !== undefined) {
      return item._id.toString() === appliedOffer._id.toString();
    }
    return false;
  };
  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <View
          style={{
            display: "flex",
            height: 60,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 4,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {/* <ButtonWithIcon
            icon={require("../images/back_arrow.png")}
            onTap={() => goBack()}
            width={20}
            height={20}
          /> */}
          <Text style={{ fontSize: 22, fontWeight: "600" }}>Offers & Deals</Text>
        </View>
      </View>

      <View style={styles.body}>
        {Array.isArray(offers) && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={offers}
            renderItem={({ item }) => (
              <OfferCard
                onTapApply={onTapApplyOffer}
                onTapRemove={onTapRemoveOffer}
                item={item}
                isApplied={checkIfExist(item)}
              />
            )}
            keyExtractor={(item) => `${item._id}`}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  navigation: { flex: 1, marginTop: 43 },
  body: { flex: 10, justifyContent: "center", alignItems: "center" },
  footer: { flex: 1, backgroundColor: "cyan" },
});

const mapStateToProps = (state: ApplicationState) => ({
  shoppingReducer: state.shoppingReducer,
  userReducer: state.userReducer,
});

const OfferScreen = connect(mapStateToProps, { onGetOffers, onApplyOffer })(_OfferScreen);

export { OfferScreen };
