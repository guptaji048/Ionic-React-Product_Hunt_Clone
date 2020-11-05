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
  IonLoading
} from "@ionic/react";
import NavHeader from "../components/Headers/NavHeader";
import { toast } from "../utils/toast";
import useFormValidation from "../hooks/useFormValidation";
import ValidateSignup from "../components/auth/ValidateSignup";
import firebase from "../firebase";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: ""
};

export default function Signup(props) {
  const {
    handleChange,
    handleSubmit,
    values,
    isSubmitting
  } = useFormValidation(INITIAL_STATE, ValidateSignup, authenticateUser);
  const [busy, setbusy] = useState(false);

  async function authenticateUser() {
    setbusy(true);
    const { name, email, password } = values;
    try {
      await firebase.register(name, email, password);
      toast("You've Signed in successfully.!");
      props.history.push("/");
    } catch (err) {
      console.log("Authentication Error", err);
      toast(err.message);
    }
    setbusy(false);
  }
  return (
    <IonPage>
      <NavHeader title="Sign-Up" />
      <IonLoading message="Please wait..." isOpen={busy} />
      <IonContent>
        <IonItem lines="full">
          <IonLabel position="floating">Full Name</IonLabel>
          <IonInput
            name="name"
            type="text"
            value={values.name}
            onIonChange={handleChange}
            required
          ></IonInput>
        </IonItem>
        <IonItem lines="full">
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            name="email"
            type="email"
            value={values.email}
            onIonChange={handleChange}
            required
          ></IonInput>
        </IonItem>
        <IonItem lines="full">
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            name="password"
            type="password"
            value={values.password}
            onIonChange={handleChange}
            required
          ></IonInput>
        </IonItem>
        <IonRow>
          <IonCol>
            <IonButton
              type="submit"
              onClick={handleSubmit}
              color="primary"
              expand="block"
              disabled={isSubmitting}
            >
              Sign Up
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
}
