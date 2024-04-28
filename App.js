import { useState } from "react";
import { View, Alert, ActivityIndicator, Text, Image, ImageBackground, ScrollView, Button, Pressable, Modal, StatusBar, StyleSheet} from "react-native";
import Box from "./components/Box";
import Greet from "./components/greet";
import Ad from "./components/Ad";
import { styles, adStyles } from "./styles/Styles";
const logoImg = require("./assets/adaptive-icon.png");

export default function App() {
  return (
    <View style={styles.container}>
  <View style={styles.container}>
    <Box style={{ backgroundColor: "black"}}>Box 1</Box>
    <Box style={{ backgroundColor: "red"}}>Box 2</Box>
    <Box style={{ backgroundColor: "green"}}>Box 2</Box>
  </View>
  <View style={[styles.lastBox]}>
    <Ad style={{ backgroundColor: "green"}}>Box 2</Ad>
  </View>
  </View>
  );
}

