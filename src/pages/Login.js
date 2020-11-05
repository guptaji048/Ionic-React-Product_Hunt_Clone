import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  IonButton,
  IonRouterLink
} from "@ionic/react";
import NavHeader from "../components/Headers/NavHeader";
import { toast } from "../utils/toast";
import useFormValidation from "../hooks/useFormValidation";
import ValidateLogin from "../components/auth/ValidateLogin";
import firebase from "../firebase";

const INITIAL_STATE = {
  email: "",
  password: ""
};

export default function Login(props) {
  const {
    handleChange,
    handleSubmit,
    values,
    isSubmitting
  } = useFormValidation(INITIAL_STATE, ValidateLogin, authenticateUser);
  const [busy, setbusy] = useState(false);

  async function authenticateUser() {
    setbusy(true);
    const { email, password } = values;
    try {
      await firebase.login(email, password);
      toast("You've Logged in successfully.!");
      props.history.push("/");
    } catch (err) {
      console.log("Authentication Error", err);
      toast(err.message);
    }
    setbusy(false);
  }

  return (
    <IonPage>
      <NavHeader title="Log in" />
      <IonContent>
        <IonItem lines="full">
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            name="email"
            type="email"
            onIonChange={handleChange}
            value={values.email}
            required
          ></IonInput>
        </IonItem>
        <IonItem lines="full">
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            name="password"
            type="password"
            onIonChange={handleChange}
            value={values.password}
            required
          ></IonInput>
        </IonItem>
        <IonRow>
          <IonCol>
            <IonButton
              type="submit"
              color="primary"
              expand="block"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Log In
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-text-center ion-padding vertical">
            <IonRouterLink routerLink={`/forgot`}>
              Forgot Password?
            </IonRouterLink>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
}
