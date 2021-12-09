import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

interface FoodDetailProps {}

const FoodDetailScreen: React.FC<FoodDetailProps> = ({}) => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "green" },
});

export { FoodDetailScreen };
