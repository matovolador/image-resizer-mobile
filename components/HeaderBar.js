// HeaderBar.js
import { SafeAreaView, Image, StyleSheet } from 'react-native';

const HeaderBar = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    top:0,
    width: '100%',
    height: 100,
    backgroundColor: '#4a148c',
    justifyContent: 'center',
    alignItems: 'top',
  },
  logo: {
    flex:1,
    margin:10,
    width: '20',
    height: '20',
    resizeMode: 'contain', // Add resizeMode to ensure the image fits inside the container
  },
});

export default HeaderBar;