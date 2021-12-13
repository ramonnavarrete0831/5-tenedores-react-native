import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/app";
import "firebase/firestore";
import { map } from "lodash";

const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {
  const { idRestaurant, setRating } = props;
  const [userLogger, setUserLogger] = useState(false);
  const [reviews, setReviews] = useState([]);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogger(true) : setUserLogger(false);
  });

  useEffect(() => {
    db.collection("reviews")
      .where("idRestaurant", "==", idRestaurant)
      .get()
      .then((reponse) => {
        const resultReview = [];
        reponse.forEach((restaurant) => {
          const data = restaurant.data();
          data.id = restaurant.id;
          resultReview.push(data);
        });
        setReviews(resultReview);
      });
  }, []);

  const navigation = useNavigation();

  return (
    <View>
      {userLogger ? (
        <Button
          title="Escriba una opinión"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#00a680",
          }}
          onPress={() => {
            navigation.navigate("add-review-restaurant", {
              idRestaurant: idRestaurant,
            });
          }}
        />
      ) : (
        <View>
          <Text
            onPress={() => {
              navigation.navigate("account", { screen: "login" });
            }}
            style={{ textAlign: "center", color: "#00a680", padding: 20 }}
          >
            Para escribir un comentario es necesario loguearse{" "}
            <Text style={{ fontWeight: "bold" }}>
              Pulsa aqui para iniciar sesion
            </Text>
          </Text>
        </View>
      )}
      {map(reviews, (item, index) => (
        <Review key={index} review={item} />
      ))}
    </View>
  );
}

function Review(props) {
  const { title, review, rating, createAt, avatar } = props.review;
  const createReview = new Date(createAt.seconds * 1000);

  return (
    <View style={styles.viewReview}>
      <View style={styles.viewImageAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.imageAvatarUser}
          source={
            avatar
              ? { uri: avatar }
              : require("../../../assets/img/avatar-default.jpg")
          }
        />
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {createReview.getDate()}/{createReview.getMonth() + 1}/
          {createReview.getFullYear()} {createReview.getHours()}:
          {createReview.getMinutes() < 10 ? "0" : ""}
          {createReview.getMinutes()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleAddReview: {
    color: "#00a680",
  },
  viewReview: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
  },
  viewImageAvatar: {
    marginRight: 15,
  },
  imageAvatarUser: {
    width: 50,
    height: 50,
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  reviewTitle: {
    fontWeight: "bold",
  },
  reviewText: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5,
  },
  reviewDate: {
    marginTop: 5,
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
