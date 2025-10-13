import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SimpleIcon } from './icons';
import { Colors, Theme } from '../constants/setting';
import { Height } from '../constants/scales';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  rightElementText?: string;
  rightElementIcon?: string;
  onRightElementPress?: () => void;
}

export default function Header(props: HeaderProps) {
  const { title, rightElementText, rightElementIcon, onRightElementPress } = props;
  const navigation = useNavigation() as any;
  return (
    <View style={styles.header}>
      {/* Left content */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 30 }}>
        <SimpleIcon
          name="chevron-left"
          color={Colors[Theme][7]}
          size={20}
        />
        <Text style={styles.headerText}>{title}</Text>
      </TouchableOpacity>

      {/* Right content */}
      {rightElementText && rightElementIcon &&
        <TouchableOpacity onPress={onRightElementPress} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 30 }}>
          <SimpleIcon name={rightElementIcon} size={24} color="#fff" />
          <Text style={styles.headerText}>{rightElementText}</Text>
        </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    backgroundColor: Colors[Theme][2],
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});