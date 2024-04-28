import { StyleSheet } from "react-native";

export const boxStyles = StyleSheet.create({
    box: {
        backgroundColor: "#fff",
        padding: 20,
        
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "white"
    }
})

export const styles = StyleSheet.create({
    container: {
      marginTop: 60,
      borderWidth: 6,
      borderColor: "brown",
      flex:1,
      flexDirection: "column",
      justifyContent: "center"
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
    lastBox: {
        justifyContent: "space-between"
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