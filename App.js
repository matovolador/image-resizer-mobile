import { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  useEffect(() => {
    // Create app directory on component mount
    createAppDirectory();
  }, []);

  const createAppDirectory = async () => {
    try {
      // Create a directory named 'resized_images' in the document directory
      const directory = `${FileSystem.documentDirectory}resized_images/`;
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      console.log('App directory created:', directory);
    } catch (error) {
      console.error('Error creating app directory:', error);
    }
  };

  const directory = `${FileSystem.documentDirectory}resized_images/`;

  const checkDirectoryExists = async () => {
    try {
      const info = await FileSystem.getInfoAsync(directory);
      if (info.exists) {
        console.log('Directory exists:', directory);
      } else {
        console.log('Directory does not exist:', directory);
      }
    } catch (error) {
      console.error('Error checking directory:', error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled && result.assets[0]?.uri) {
      setImage({ uri: result.assets[0].uri });
      console.log(image);
    } else {
      console.log("Canceled");
    }
  };

  const resizeImage = async (width,height) => {
    checkDirectoryExists();
    try {
      const manipResult = await manipulateAsync(
        image.uri,
        [{ resize: { height: height, width: width } }],
        { compress: 1, format: SaveFormat.PNG }
      );
  
      const fileUri = FileSystem.documentDirectory + 'resized_image.png';
      const base64String = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await FileSystem.writeAsStringAsync(fileUri, base64String, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Display the resized image if needed
      setImage({ uri: fileUri });
      
    }catch(err){
      console.log(err)
    }
  };

  

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <Button title="Resize 500x500" onPress={() => resizeImage(500,500)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});