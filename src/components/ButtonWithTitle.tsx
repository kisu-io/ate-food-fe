import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ImageSourcePropType,
} from "react-native";

interface ButtonProps {
  onTap: Function;
  width: number;
  height: number;
  title: string;
  isNoBg?: boolean;
  disable?: boolean;
}

const ButtonWithTitle: React.FC<ButtonProps> = ({
  onTap,
  width,
  height,
  title,
  isNoBg = false,
  disable = false,
}) => {
  if (isNoBg) {
    return (
      <TouchableOpacity
        disabled={disable}
        style={[styles.btn, { width, height, backgroundColor: "transparent" }]}
        onPress={() => onTap()}
      >
        <Text style={{ fontSize: 16, color: disable ? "#6F6f6f" : "#3980D9" }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={[styles.btn, { width, height }]}
        onPress={() => onTap()}
      >
        <Text style={{ fontSize: 16, color: "#FFF" }}>{title}</Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    display: "flex",
    maxHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ee5356",
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 20,
  },
});

export { ButtonWithTitle };
