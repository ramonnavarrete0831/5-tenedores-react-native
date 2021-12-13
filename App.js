import React, { useEffect } from "react";
import { YellowBox } from "react-native";
/*import { firebaseApp } from "./app/utils/firebase";
import firebase from "firebase/app";*/

import Navigation from "./app/navigations/Navigation";
import { decode, encode } from "base-64";

//import messaging from "@react-native-firebase/messaging";
//import { Notifications } from "expo";
//import * as Permissions from "expo-permissions";
//import * as Notifications from "expo-notifications";

//https://github.com/vitalets/react-native-extended-stylesheet#demo
//https://github.com/oliverbenns/expo-deploy

YellowBox.ignoreWarnings(["Setting a timer"]);
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App(props) {
  useEffect(() => {
    /*messaging()
      .getToken()
      .then((token) => {
        console.log(token);
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      console.log(token);
    });*/
  }, []);

  /*useEffect(() => {
    (async () => {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = status;
      if (status !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        const token = await Notifications.getExpoPushTokenAsync();
        console.log(token);
      }
    })();
  }, []);*/

  return <Navigation />;
}

/*
AIzaSyAsSkeRFoxF7uzuTcebA4TLRAdy6GZNmuU

Google Certificate Fingerprint:     3D:F2:70:77:01:24:C4:04:26:75:CB:11:96:06:BC:62:70:25:7C:C1
Google Certificate Hash (SHA-1):    3DF270770124C4042675CB119606BC6270257CC1
Google Certificate Hash (SHA-256):  C73698E51DE7126CB33973024D40A2D1DEECAAF30CB3E9ADE654D6418698C483
Facebook Key Hash:                  PfJwdwEkxAQmdcsRlga8YnAlfME=
*/
