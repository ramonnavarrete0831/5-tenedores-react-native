import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { size } from "lodash";

import { reauthenticate } from "../../utils/api";

export default function ChangePasswordFrom(props) {
  const { setShowModal, toastRef } = props;
  const [showPasswords, setShowPasswords] = useState(false);
  const [fromData, setFromData] = useState(setData());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e, type) => {
    setFromData({ ...fromData, [type]: e.nativeEvent.text });
  };

  const onSubmit = async () => {
    let isSetError = true;
    let errorsTemp = {};
    setErrors({});

    if (
      !fromData.password ||
      !fromData.new_password ||
      !fromData.repeat_password
    ) {
      errorsTemp = {
        password: !fromData.password
          ? "La contraseña no puede estar vacia"
          : "",
        new_password: !fromData.new_password
          ? "La contraseña no puede estar vacia"
          : "",
        repeat_password: !fromData.repeat_password
          ? "La contraseña no puede estar vacia"
          : "",
      };
    } else if (fromData.new_password !== fromData.repeat_password) {
      errorsTemp = {
        new_password: "La contraseña no son iguales",
        repeat_password: "La contraseña no son iguales",
      };
    } else if (size(fromData.new_password) < 6) {
      errorsTemp = {
        new_password: "La contraseña tiene que ser mayor a 5 caracteres",
        repeat_password: "La contraseña tiene que ser mayor a 5 caracteres",
      };
    } else {
      setIsLoading(true);
      await reauthenticate(fromData.password)
        .then(async () => {
          await firebase
            .auth()
            .currentUser.updatePassword(fromData.new_password)
            .then(() => {
              isSetError = false;
              setIsLoading(false);
              setShowModal(false);
              firebase.auth().signOut();
            })
            .catch(() => {
              errorsTemp = {
                other: "Error al actualizar la contraseña",
              };
              setIsLoading(false);
            });
        })
        .catch((error) => {
          errorsTemp = {
            password: "La contraseña no es correcta",
          };
          setIsLoading(false);
        });
    }

    isSetError && setErrors(errorsTemp);
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Contraseña actual"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPasswords ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPasswords ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => {
            setShowPasswords(!showPasswords);
          },
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={errors.password}
      />
      <Input
        placeholder="Nueva contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPasswords ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPasswords ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => {
            setShowPasswords(!showPasswords);
          },
        }}
        onChange={(e) => onChange(e, "new_password")}
        errorMessage={errors.new_password}
      />
      <Input
        placeholder="Repetir nueva contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPasswords ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPasswords ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => {
            setShowPasswords(!showPasswords);
          },
        }}
        onChange={(e) => onChange(e, "repeat_password")}
        errorMessage={errors.repeat_password}
      />
      <Button
        title="Cambiar contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
      <Text>{errors.other}</Text>
    </View>
  );
}

function setData() {
  return {
    password: "",
    new_password: "",
    repeat_password: "",
  };
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
