import { View, Text, Image, ImageBackground, ScrollView, Button, Pressable } from "react-native";
const logoImg = require("./assets/adaptive-icon.png");

export default function App() {
  return (
  <View style={{ flex:1, backgroundColor: "plum", padding: 60}}>
    <Button
      title='Press'
      onPress={()=> console.log('Button Pressed')}
      color="midnightblue"
    />
    <Pressable onPress={() => console.log("Image Pressed")}>
      <Image source={logoImg} style={{ width:300, height:300}}/>
    </Pressable>
    <Pressable onLongPress={() => console.log("Text Pressed")}>
      <Text>
        asdasdsaassd
        asdasdsaassdas
        defaultada
        a
        sds
        
        adaptivedsa
        sdsdad
        asdasdsaassda
        
        asdasdsaassdad
        adaptivedsadsad
        adaptive34
        4
        3
      </Text>
    </Pressable>
  </View>
  );
}