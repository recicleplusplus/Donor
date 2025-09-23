import React from 'react';
import { Colors, Theme } from "../../constants/setting";
import { ContainerTopClean } from "../containers";
import { ImageCircleIcon } from "../images";
import SizedBox from '../SizedBox';
import { ProfileImage } from '../../types/donor_types';

interface HomeHeaderProps {
  donorName: string;
  userImage: ProfileImage;
}

export function HomeHeader({ donorName, userImage }: HomeHeaderProps): JSX.Element {
  return (
    <>
      <ImageCircleIcon
        size={130}
        sizeIcon={0}
        align={"flex-start"}
        img={userImage as any}
        color={Colors[Theme][5]}
        bgColor={Colors[Theme][0]}
      />
      <ContainerTopClean
        text={`          Bem vind@,\n          ${donorName}`}
      />
      <SizedBox height={5} />
    </>
  );
}