import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOptions from "../../components/Account/AccountOptions";

export default function UserLogged() {
  const [userInfo, setuserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setloadingText] = useState("");
  const [reloadUserInfo, setReloadUserInfo] = useState(false);

  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      const user = await firebase.auth().currentUser;
      setuserInfo(user);
      setReloadUserInfo(false);
    })();
  }, [reloadUserInfo]);

  return (
    <View style={styles.viewUserLogged}>
      {userInfo && (
        <InfoUser
          toastRef={toastRef}
          userInfo={userInfo}
          setLoading={setLoading}
          setloadingText={setloadingText}
        ></InfoUser>
      )}
      <AccountOptions
        userInfo={userInfo}
        toastRef={toastRef}
        setReloadUserInfo={setReloadUserInfo}
      ></AccountOptions>
      <Button
        title="Cerrar Sesión"
        buttonStyle={styles.btnCloseSession}
        titleStyle={styles.btnCloseSessionText}
        onPress={() => {
          firebase.auth().signOut();
        }}
      ></Button>
      <Toast ref={toastRef} position="center" opacity={0.9}></Toast>
      <Loading text={loadingText} isVisible={loading}></Loading>
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserLogged: {
    minHeight: "100%",
    backgroundColor: "#f2f2f2",
  },
  btnCloseSession: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnCloseSessionText: {
    color: "#00a680",
  },
});
