import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native";
import * as firebase from "firebase";

import { validateEmail } from "../../utils/validations";
import Loading from "../../components/Loading";

export default function LoginFrom(props) {
  const [showPassword, setVisiblePassword] = useState(false);
  const [fromData, setFromdata] = useState(defaultFormValues());
  const { toastRef } = props;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    if (isEmpty(fromData.email) || isEmpty(fromData.password)) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else if (!validateEmail(fromData.email)) {
      toastRef.current.show("El correo no es correcto");
    } else {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(fromData.email, fromData.password)
        .then(() => {
          setLoading(false);
          navigation.navigate("account");
        })
        .catch(() => {
          toastRef.current.show("Error al autentificarse, inténtelo de nuevo.");
        });
    }
  };

  const onChange = (e, type) => {
    setFromdata({ ...fromData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={style.formContainer}>
      <Input
        placeholder="Correo electrónico"
        containerStyle={style.inputForm}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={style.iconRight}
          ></Icon>
        }
        onChange={(e) => onChange(e, "email")}
      ></Input>
      <Input
        placeholder="Contraseña"
        containerStyle={style.inputForm}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={style.iconRight}
            onPress={() => {
              setVisiblePassword(!showPassword);
            }}
          ></Icon>
        }
        onChange={(e) => onChange(e, "password")}
      ></Input>
      <Button
        title="Iniciar sesión"
        containerStyle={style.btnContainerLogin}
        buttonStyle={style.btnLogin}
        onPress={() => onSubmit()}
      ></Button>
      <Loading text="Iniciando sesión" isVisible={loading}></Loading>
    </View>
  );
}

function defaultFormValues() {
  return {
    email: "",
    password: "",
  };
}

const style = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainerLogin: {
    marginTop: 20,
    width: "95%",
  },
  btnLogin: {
    backgroundColor: "#00a680",
  },
  iconRight: {
    color: "#c1c1c1",
  },
});
