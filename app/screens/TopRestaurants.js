import React, { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Toast from "react-native-easy-toast";
import ListTopRestaurant from "../components/Ranking/ListTopRestaurant";

const db = firebase.firestore(firebaseApp);

export default function TopRestaurants(props) {
  const { navigation } = props;
  const [restaurants, setRestaurants] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    db.collection("restaurants")
      .orderBy("rating", "desc")
      .limit(5)
      .get()
      .then((restaurantes) => {
        const restaurantsArray = [];
        restaurantes.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          restaurantsArray.push(data);
        });
        setRestaurants(restaurantsArray);
      });
  }, []);

  return (
    <View>
      <ListTopRestaurant restaurants={restaurants} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
}
