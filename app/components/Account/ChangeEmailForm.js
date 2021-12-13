import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { validateEmail } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";

export default function ChangeEmailForm(props) {
  const { setShowModal, toastRef, setReloadUserInfo, email } = props;
  const [formData, setFormData] = useState(setDefault);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveInformation, setSaveInformation] = useState(false);

  const onSubmit = () => {
    setErrors({});

    if (!formData.email || email === formData.email) {
      setErrors({ email: "Email no ha cambiado" });
    } else if (!validateEmail(formData.email)) {
      setErrors({ email: "Email no tiene un formato correcto" });
    } else if (!formData.password) {
      setErrors({ password: "La contraseña no puede ser vacia" });
    } else {
      setSaveInformation(true);
      reauthenticate(formData.password)
        .then((reponse) => {
          firebase
            .auth()
            .currentUser.updateEmail(formData.email)
            .then(() => {
              setSaveInformation(false);
              setReloadUserInfo(true);
              toastRef.current.show("Email actualizado correctamente.");
              setShowModal(false);
            })
            .catch(() => {
              setErrors({ password: "Error al actualizar el email." });
              setSaveInformation(false);
            });
        })
        .catch((reponse) => {
          setErrors({ password: "La contraseña es incorrecta" });
          setSaveInformation(false);
        });
    }
  };

  const onChange = (type, e) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Email"
        defaultValue={email}
        containerStyle={styles.input}
        onChange={(e) => onChange("email", e)}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        errorMessage={errors.email}
      />
      <Input
        placeholder="Password"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? false : true}
        onChange={(e) => onChange("password", e)}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        errorMessage={errors.password}
      ></Input>
      <Button
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        title="Cambiar Email"
        onPress={onSubmit}
        loading={saveInformation}
      />
    </View>
  );
}

function setDefault() {
  return {
    email: "",
    password: "",
  };
}
function btn() {
  return {
    backgroundColor: "#00a680",
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
    width: "95%",
    marginTop: 20,
  },
  btn: btn(),
});
