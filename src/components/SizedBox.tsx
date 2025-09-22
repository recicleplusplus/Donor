import React from "react";
import { View } from "react-native";

type SizedBoxProps = {
  vertical?: number;
  horizontal?: number;
};

export default function SizedBox({ vertical = 0, horizontal = 0 }: SizedBoxProps) {
  return <View style={{ width: horizontal, height: vertical }} />;
}
