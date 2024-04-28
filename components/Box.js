import { View,Text, StyleSheet } from "react-native";
import { boxStyles } from "../styles/Styles";
export default function Box ({children, style}) {
    return (
        <View style={[boxStyles.box, style]}>
            <Text style={boxStyles.text}>{children}</Text>
        </View>
    )
}