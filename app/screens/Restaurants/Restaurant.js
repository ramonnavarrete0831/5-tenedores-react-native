import React, { useRef, useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import { map } from "lodash";
import { Rating, ListItem, Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Loading from "../../components/Loading";
import CarouselImages from "../../components/CarouselImages";
import Map from "../../components/Map";
import ListReviews from "../../components/Restaurants/ListReviews";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation, route } = props;
  const { id, name } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const toastRef = useRef();
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogger, setUserLogger] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogger(true) : setUserLogger(false);
  });

  useFocusEffect(
    useCallback(() => {
      db.collection("restaurants")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setRestaurant(data);
          setRating(data.rating);
        })
        .catch((error) => {});
    }, [])
  );

  useEffect(() => {
    if (userLogger && restaurant) {
      db.collection("favorites")
        .where("idRestaurant", "==", restaurant.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        });
    }
  }, [userLogger, restaurant]);

  navigation.setOptions({ title: name });

  const addFavorite = () => {
    if (!userLogger) {
      toastRef.current.show(
        "para usar el sistema de favoritos tienes que estar logueado."
      );
    } else {
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idRestaurant: restaurant.id,
      };

      db.collection("favorites")
        .add(payload)
        .then(() => {
          setIsFavorite(true);
          toastRef.current.show("restaurante añadido a favoritos");
        })
        .catch(() => {
          toastRef.current.show("Error al añadir el restaurante  a favoritos");
        });
    }
  };

  const removeFavorite = () => {
    if (!userLogger) {
      toastRef.current.show(
        "para usar el sistema de favoritos tienes que estar logueado."
      );
    } else {
      db.collection("favorites")
        .where("idRestaurant", "==", restaurant.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            const idFavorite = doc.id;
            db.collection("favorites")
              .doc(idFavorite)
              .delete()
              .then(() => {
                setIsFavorite(false);
                toastRef.current.show("restaurante eliminado de favoritos");
              })
              .catch(() => {
                toastRef.current.show(
                  "Error al eliminar el restaurante  de favoritos"
                );
              });
          });
        });
    }
  };

  if (!restaurant) {
    return <Loading isVisible={true} text="Cargando ..."></Loading>;
  }

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          color={isFavorite ? "#f00" : "#000"}
          size={35}
          underlayColor="transparent"
          onPress={isFavorite ? removeFavorite : addFavorite}
        />
      </View>
      <CarouselImages
        arrayImages={restaurant.images}
        height={200}
        width={screenWidth}
      />
      <TitleRestaurant
        name={restaurant.name}
        descripcion={restaurant.descripcion}
        rating={rating}
      />
      <RestaurantInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      />
      <ListReviews
        navigation={navigation}
        idRestaurant={restaurant.id}
        setRating={setRating}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
}

function TitleRestaurant(propos) {
  const { name, descripcion, rating } = propos;

  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionRestaurant}>{descripcion}</Text>
    </View>
  );
}

function RestaurantInfo(props) {
  const { location, name, address } = props;
  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null,
    },
    {
      text: "111 222 333",
      iconName: "phone",
      iconType: "material-community",
      action: null,
    },
    {
      text: "ramonnavarrete0831@gmail.com",
      iconName: "email",
      iconType: "material-community",
      action: null,
    },
  ];

  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Información sobre el restaurante
      </Text>
      <Map location={location} name={name} height={100} />
      {map(listInfo, (item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680",
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  viewRestaurantTitle: {
    padding: 15,
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "gray",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15,
  },
});
