import React from 'react';
import { View } from "react-native";
import { Colors, Theme } from "../../constants/setting";
import { ContainerTopClean } from "../containers";
import { ImageCircleIcon } from "../images";
import { HomeHeaderProps } from '../../types/donor_types';

export function HomeHeader({ donorName, image }: HomeHeaderProps): JSX.Element {
  return (
    <>
      <ImageCircleIcon
        size={130}
        sizeIcon={0}
        align={"flex-start"}
        img={image as any}
        color={Colors[Theme][5]}
        bgColor={Colors[Theme][0]}
      />
      <ContainerTopClean
        fun={null}
        text={`          Bem vind@,\n          ${donorName}`}
      />
      <View style={{ marginVertical: 5, }} />
    </>
  );
}