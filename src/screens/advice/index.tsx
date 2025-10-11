import { useState } from "react";
import { Text, View, Button, ScrollView } from "react-native";
import { styles } from "./style";
import { Height, Size50, Size110, Width } from "../../constants/scales";
import { ContainerTopTitle } from "../../components/containers";
import * as Advices from "../../constants/advices";
import { ButtonOval } from "./components/button";
import { Colors, Theme } from "../../constants/setting";
import React from "react";


export function Advice() {
  const [index, setIndex] = useState(0);
  
  function addIndex(){
    if (index < Advices.advices.length-1){
      setIndex((last) => last+1);
    }
  }

  function subIndex(){
    if (index > 0){
      setIndex((last) => last-1);
    }
  }

  return (
    <ScrollView>
      <ContainerTopTitle title={"Cuidados"} />

      <View style={styles.main}>
        <Text style={{...styles.title}}>{Advices.title}</Text>
        <View style={styles.row}>
          <ButtonOval
            color={Advices.adColors[index]}
            size={Size50}
            icon={"chevron-left"}
            func={subIndex}
          />

          <View style={{...styles.circle, borderColor: Advices.adColors[index]}}>
            <Text style = {{
              color: Advices.adColors[index],
              fontSize: Size110 * 0.9
            }}>
              {index+1}
            </Text>
          </View>

          <ButtonOval
            color={Advices.adColors[index]}
            size={Size50}
            icon={"chevron-right"}
            func={addIndex}
          />
        </View>
        <Text style={{...styles.subtitle}}>{Advices.advices[index]}</Text>
        <View style={styles.row}>
          {Advices.adColors.map((color, idx) => {
            return (
              <View key={idx} style={{
                backgroundColor: idx == index ? color : Colors[Theme][1],
                borderWidth: 3,
                marginHorizontal:2,
                borderColor: color, 
                width: Width/(Advices.adColors.length) - 15, 
                marginTop: 30,
                height: 25 
              }}>
              </View>
            );
          })}
          
        </View>
      </View>
    </ScrollView>
  );
}
