import { useState } from "react";
import { View, Alert, ActivityIndicator, Text, Image, ImageBackground, ScrollView, Button, Pressable, Modal, StatusBar, StyleSheet} from "react-native";
import Greet from "./components/greet";
import { styles } from "./styles/Styles";
const logoImg = require("./assets/adaptive-icon.png");

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  return (
  <View style={styles.container}>
    <Greet name="Bruce Wayne" />
    <Greet name="Clark Kent" />
    <Button title="Alert" onPress={() => Alert.alert("Invalid Data","Data was incorrect")}></Button>
        <ActivityIndicator size="large" color="midnightblue" animating={isLoaderVisible} />
    <Button title="Alert 2" onPress={() => Alert.alert("Invalid Data","Data was incorrect", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel pressed")
      },
      {
        text : "OK",
        onPress: () => console.log("OK Pressed")
      }
    ])}></Button>
    
        <ActivityIndicator size="large" color="midnightblue" animating={isLoaderVisible} />
    <StatusBar
      backgroundColor="lightgreen" barStyle="light-content" hidden
    />
    <Button
      title='Press'
      onPress={()=> setIsModalVisible(true)}
      color="midnightblue"
    />
    <Modal 
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex:1, backgroundColor: "lightblue", padding: 60}}>
        <Text>Modal Content</Text>
        <Button title="Close" color="midnightblule" onPress={() => setIsModalVisible(false)}/>
      </View>
    </Modal>
  </View>
  );
}

