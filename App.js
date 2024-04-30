import { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, Alert, TextInput, Text, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [newWidth, setNewWidth] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalWidth, setOriginalWidth] = useState(''); // Get the original width of the image
  const [originalHeight, setOriginalHeight] = useState('') // Get the original height of the image

  useEffect(() => {
    // Request permission for accessing media library
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'This app needs access to your media library to save images.'
      );
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

    if (!result.canceled && result.assets[0]?.uri) {
      setImage({ uri: result.assets[0].uri });
      getImageSize(result.assets[0].uri, asignOriginalValues=true);
    }
  };

  const getImageSize = async (uri, asignOriginalValues=false) => {
    const {width, height} = await new Promise((resolve) => {
      Image.getSize(uri, (width, height) => {
        resolve({width: width, height: height});
      });
    });
    
    console.log('Width:', width, 'Height:', height);

    // Check if width and height are valid
    if (width !== undefined && height !== undefined) {
      setNewWidth(width.toString());
      setNewHeight(height.toString());
      setOriginalHeight(height);
      setOriginalWidth(width);
    } else {
      console.warn('Image width or height is undefined');
    }
  };

  const resizeImage = async () => {
    try {
      const manipResult = await manipulateAsync(
        image.uri,
        [{ resize: { width: parseInt(newWidth), height: parseInt(newHeight) } }],
        { compress: 1, format: SaveFormat.PNG }
      );

      const directory = `${FileSystem.documentDirectory}resized_images/`;
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

      const fileUri = `${directory}resized_image.png`;
      await FileSystem.copyAsync({ from: manipResult.uri, to: fileUri });

      await MediaLibrary.saveToLibraryAsync(fileUri);
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <View style={styles.inputContainer}>
        <View style={styles.rowContainer}>
          <TextInput
            value={newWidth}
            onChangeText={(text) => setNewWidth(text)}
            keyboardType="numeric"
            placeholder="Width"
            style={styles.input}
          />
          <Text style={styles.crossText}>x</Text>
          <TextInput
            value={newHeight}
            onChangeText={(text) => setNewHeight(text)}
            keyboardType="numeric"
            placeholder="Height"
            style={styles.input}
            editable={!maintainAspectRatio}
          />
        </View>
        <View style={styles.checkBoxContainer}>
          <Text>Maintain Aspect Ratio</Text>
          <Switch
            value={maintainAspectRatio}
            onValueChange={(value) => {
              setMaintainAspectRatio(value);
              if (!value) { // If aspect ratio is disabled
                setNewHeight('');
              } else { // If aspect ratio is enabled
                if (originalWidth && originalHeight) {
                  const newHeight = Math.round((parseInt(newWidth) * originalHeight) / originalWidth);
                  setNewHeight(newHeight.toString());
                }
              }
            }}
          />
        </View>
      </View>
      <Button title="Resize" onPress={resizeImage} />
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
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginRight: 5,
  },
  crossText: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});