import { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Create app directory on component mount
    createAppDirectory();
    // Request permission for accessing media library
    requestMediaLibraryPermission();
    // Request permission for accessing media files from external storage
    requestExternalStoragePermission();
  }, []);

  const appFolderName = "BaruImageResizer";

  const requestMediaLibraryPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'This app needs access to your media library to save images.'
      );
    }
  };

  const requestExternalStoragePermission = async () => {
    const { status } = await MediaLibrary.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission not granted to access media files from external storage');
    }
  };

  const createAppDirectory = async () => {
    try {
      const directory = `${FileSystem.documentDirectory}${appFolderName}/`;
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      console.log('Custom directory created:', directory);
    } catch (error) {
      console.error('Error creating custom directory:', error);
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

    if (!result.cancelled && result.assets[0]?.uri) {
      setImage({ uri: result.assets[0].uri });
      console.log(image);
    } else {
      console.log("Canceled");
    }
  };

  const resizeImage = async (width, height) => {
    try {
      const manipResult = await manipulateAsync(
        image.uri,
        [{ resize: { height: height, width: width } }],
        { compress: 1, format: SaveFormat.PNG }
      );

      const fileUri = `${FileSystem.documentDirectory}${appFolderName}/${getNewFileName(image.uri, width, height)}`;
      await FileSystem.copyAsync({ from: manipResult.uri, to: fileUri });

      // Save the image to media library
      await MediaLibrary.saveToLibraryAsync(fileUri);

      // Display the resized image if needed
      setImage({ uri: fileUri });
    } catch (err) {
      console.log(err);
    }
  };

  const getNewFileName = (uri, width, height) => {
    // Extract the file name from the URI
    const fileName = uri.substring(uri.lastIndexOf('/') + 1);
    // Construct the new file name with dimensions
    return `${fileName}_${width}x${height}.png`;
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <Button title="Resize 500x500" onPress={() => resizeImage(500, 500)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});