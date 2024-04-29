import { useState } from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';


export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  let self = this;
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
      console.log(image)
    }
  };

  const resizeImage = async (width,height) => {
    try{
      console.log(image.uri)
      const manipResult = await manipulateAsync(
        image.localUri || image.uri,
        [{resize:{
          height: height, 
          width: width
        }}],
        { compress: 1, format: SaveFormat.PNG,  }
      );
      setImage(manipResult);
    }catch(err){
      console.log(err)
    }
  };

  

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
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