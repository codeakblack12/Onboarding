import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, useWindowDimensions, TouchableOpacity} from 'react-native';
export default function OnboardingItem({item}) {

  const {width} = useWindowDimensions()
  return (
    <TouchableOpacity activeOpacity={0.9} style={[styles.container, {width}]}>
      <Image source={item.image} style={[styles.image, {width, resizeMode: "contain"}]} />
        <View style={{flex: 0.3}} >
            <Text style={styles.title} >{item.title}</Text>
            <Text style={styles.description} >{item.description}</Text>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
      flex: 0.7,
      justifyContent: "center"
  },
  title: {
      fontWeight: "800",
      fontSize: 28,
      marginBottom:10,
      color: "#493d8a",
      textAlign: "center",
  },
  description: {
      fontWeight: "300",
      color: "#62656b",
      textAlign: "center",
      paddingHorizontal: 64,
  }
});
