import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "plum",
      padding: 60
    },
    box: {
        width: 250,
        height: 250,
        // padding: 10,
        paddingHorizontal: 10,
        paddingVertical:20,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: "purple",
        borderStyle: "solid",
        borderRadius: 5,
    },
    lightblueBg: {
        backgroundColor: "lightblue",
        
    },
    lightgreenBg: {
        backgroundColor: "lightgreen",
    },
    boxShadow: {
        shadowColor: "#333333",
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
    androidShadow:{
        shadowColor: "#333333",
        elevation: 10,
    },
    darkMode: {
        backgroundColor: "black",
    
    },
    darkModeText: {
        color: "white"        
    },
    boldText:{
        fontWeight: "bold"
    }
  });