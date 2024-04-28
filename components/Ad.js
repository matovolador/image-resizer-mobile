import { View,Text, StyleSheet } from "react-native";
import {  styles } from "../styles/Styles";
export default function Ad ({children, style}) {
    return (
        <View style={[styles.lastBox,  style]}>
            <Text>{children}</Text>
        </View>
    )
}