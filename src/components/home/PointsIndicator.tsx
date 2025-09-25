import React from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors, Theme } from "../../constants/setting";
import { SimpleIcon } from "../icons";
import { useDonorPoints } from "../../screens/home/hooks/useDonorPoints";

interface PointsComponentProps {
  donorId: string;
}

export function PointsIndicator({ donorId }: PointsComponentProps) {
  const navigation = useNavigation() as any;
  const { donorPoints, loading: pointsLoading, error: pointsError } = useDonorPoints(donorId);

  const handleNavigateToPoints = () => {
    navigation.navigate('PointsPage');
  };

  if (pointsError) {
    return null;
  }

  return (
    <View style={{
      minWidth: 100,
      maxWidth: 182,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 150,
      marginVertical: 15,
    }}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={handleNavigateToPoints}
      >
        <Image
          source={require('../../../assets/images/greenLogo.png')}
          style={{ height: 20, width: 20, marginRight: 5 }}
        />
        <Text style={{
          color: Colors[Theme][7],
          fontWeight: 'bold',
          fontSize: 14
        }}>
          {pointsLoading ? '...' : `${donorPoints} Pts`}
        </Text>
        <SimpleIcon
          name="chevron-right"
          color={Colors[Theme][7]}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
}