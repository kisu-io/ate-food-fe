import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

interface RestaurantProps {}

const RestaurantScreen: React.FC<RestaurantProps> = ({}) => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "green" },
});

export { RestaurantScreen };
