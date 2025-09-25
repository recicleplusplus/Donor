import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGetDonorStatistics } from "./hooks/useGetDonorStatistics";
import { useDonorPoints } from "./hooks/useDonorPoints";
import { useProfileImage } from "./hooks/useProfileImage";
import { Colors, Theme } from "../../constants/setting";
import { View, ScrollView, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "./style";
import { ContainerTopClean } from "../../components/containers";
import SizedBox from '../../components/SizedBox';
import { ImageCircleIcon } from "../../components/images";
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatisticsCard } from '../../components/home/StatisticsCard';
import React, { useState, useEffect } from 'react';
import { DonorData } from '../../types/donor_types';
import { ProfileImage } from '../../types/donor_types';
import { HomeHeader } from '../../components/home/HomeHeader';
import { ButtonTextIcon } from '../../components/buttons';
import { SimpleIcon } from '../../components/icons';
import { PointsIndicator } from '../../components/home/PointsIndicator';

interface HomePageContentProps {
	donorState: any,
	recyclableDonorData: DonorData[] | null;
	userImage: ProfileImage;
}
export function HomePageContent(props: HomePageContentProps) {
	const { donorState, recyclableDonorData, userImage } = props;
	const navigation = useNavigation() as any;
	const { donorStatistics } = useGetDonorStatistics(recyclableDonorData, donorState.id);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ScrollView>
				<HomeHeader donorName={donorState.name} userImage={userImage} />

				<PointsIndicator donorId={donorState.id} />

				{donorStatistics ? (
					<StatisticsCard donorStatistics={donorStatistics} styles={styles} />
				) : (
					<View style={{ alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: Colors[Theme][2], textAlign: 'center', padding: 20, fontWeight: 'bold' }}>
							Nenhuma estatística disponível
						</Text>
					</View>
				)}
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Collection')}>
						<MaterialCommunityIcons name="recycle" size={28} color="white" />
						<Text style={styles.text}>Cadastrar</Text>
					</TouchableOpacity>
				</View>
				{/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
					<Text style={{ color: Colors[Theme][2], textAlign: 'left', padding: 20, fontWeight: 'bold' }}>Histórico</Text>
				</View> */}
				{/* <ScrollView horizontal> */}
				{/* {donorData.map((item, index) => (
							<View style={[styles.containerEdit, { marginRight: 50 }]} key={index}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<CardHome
										tipo={item.type}
										endereco={item.address.name}
										peso={item.weight}
										sacolas={item.bags}
										caixas={item.boxes}
										foto=''
										nome={item.collector.name}
										id={item.collector.id}
									/>
								</View>
							</View>
						))} */}
				{/* </ScrollView> */}
			</ScrollView>
		</GestureHandlerRootView>
	);
}
