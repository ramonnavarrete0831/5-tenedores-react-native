import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListRestaurants from "../../components/Restaurants/ListRestaurants";
import { globalStyles } from "./../../share/globalStyles";
const db = firebase.firestore(firebaseApp);

export default function Restautans(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState({});
  const [totalRestaurant, setTotalRestaurant] = useState(0);
  const [startRestaurant, setStartRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const limitRestaurant = 10;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("restaurants")
        .get()
        .then((snap) => {
          setTotalRestaurant(snap.size);
        });

      const resultRestaurant = [];
      db.collection("restaurants")
        .orderBy("createAt", "desc")
        .limit(limitRestaurant)
        .get()
        .then((response) => {
          setStartRestaurant(response.docs[response.docs.length - 1]);
          response.forEach((doc) => {
            const restaurant = doc.data();
            restaurant.id = doc.id;
            resultRestaurant.push(restaurant);
          });
          setRestaurants(resultRestaurant);
        });
    }, [])
  );

  const handlerLoadMore = () => {
    const resultRestaurant = [];
    restaurants.length < totalRestaurant && setIsLoading(true);

    db.collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurant.data().createAt)
      .limit(limitRestaurant)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartRestaurant(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }

        response.forEach((doc) => {
          const restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurant.push(restaurant);
        });

        setRestaurants([...restaurants, ...resultRestaurant]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        restaurants={restaurants}
        handlerLoadMore={handlerLoadMore}
        isLoading={isLoading}
      />
      {user && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color={globalStyles.green}
          containerStyle={styles.btnContainer}
          onPress={() => {
            navigation.navigate("add-restaurant");
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
