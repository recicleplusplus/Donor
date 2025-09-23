import React from "react";
import { View } from "react-native";

type SizedBoxProps = {
  height?: number;
  width?: number;
};

export default function SizedBox({ height = 0, width = 0 }: SizedBoxProps) {
  return <View style={{ width: width, height: height }} />;
}
