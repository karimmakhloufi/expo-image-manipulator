import React, { useState, useEffect } from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";

export default function App() {
  const [ready, setReady] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const cache = await FileSystem.readDirectoryAsync(
        FileSystem.cacheDirectory
      );
      const document = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      console.log("cache", cache);
      console.log("document", document);
      const image = Asset.fromModule(require("./assets/icon.png"));
      await image.downloadAsync();
      setImage(image);
      setReady(true);
    })();
  }, []);

  const _rotate90andFlip = async () => {
    const manipResult = await manipulateAsync(
      image.localUri || image.uri,
      [{ rotate: 90 }, { flip: FlipType.Vertical }],
      { compress: 1, format: SaveFormat.PNG }
    );
    console.log(manipResult);
    await FileSystem.copyAsync({
      from: manipResult.uri,
      to: FileSystem.documentDirectory,
    });
    setImage(manipResult);
  };

  const _renderImage = () => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: image.localUri || image.uri }}
        style={styles.image}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {ready && image && _renderImage()}
      <Button title="Rotate and Flip" onPress={_rotate90andFlip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
