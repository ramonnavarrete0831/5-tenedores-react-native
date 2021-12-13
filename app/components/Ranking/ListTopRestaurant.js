import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Card, Image, Rating, Icon } from "react-native-elements";

export default function ListTopRestaurant(props) {
  const { restaurants, navigation } = props;
  return (
    <FlatList
      data={restaurants}
      renderItem={(restaurant) => (
        <Restaurant restaurant={restaurant} navigation={navigation} />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

function Restaurant(props) {
  const { restaurant, navigation } = props;
  const { id, name, rating, images, descripcion } = restaurant.item;
  const [color, setColor] = useState("#000");

  useEffect(() => {
    if (restaurant.index === 0) {
      setColor("#efb819");
    } else if (restaurant.index === 1) {
      setColor("#e3e4e5");
    } else if (restaurant.index === 2) {
      setColor("#cd7f32");
    }
  }, []);

  const abrirDetalle = () => {
    navigation.navigate("restaurants", {
      screen: "restaurant",
      params: { id: id, name: name },
    });
  };

  return (
    <TouchableOpacity onPress={abrirDetalle}>
      <Card containerStyle={styles.containerCard}>
        <Icon
          type="material-community"
          name="chess-queen"
          size={40}
          color={color}
          containerStyle={styles.containerIcon}
        />
        <Image
          style={styles.restaurantImage}
          resizeMode="cover"
          source={
            images[0]
              ? { uri: images[0] }
              : require("../../../assets/img/no-image.png")
          }
        />
        <View style={styles.titleRating}>
          <Text style={styles.title}>{name}</Text>
          <Rating imageSize={20} startingValue={rating} readonly />
        </View>
        <Text style={styles.description}>{descripcion}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    marginBottom: 30,
    borderWidth: 0,
  },
  containerIcon: {
    position: "absolute",
    top: -30,
    left: -30,
    zIndex: 1,
  },
  restaurantImage: {
    width: "100%",
    height: 200,
  },
  titleRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    color: "grey",
    marginTop: 0,
    textAlign: "justify",
  },
});
