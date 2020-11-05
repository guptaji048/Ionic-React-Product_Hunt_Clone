import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  IonButton
} from "@ionic/react";
import NavHeader from "../components/Headers/NavHeader";
import { toast } from "../utils/toast";
import useFormValidation from "../hooks/useFormValidation";
import ValidatePasswordReset from "../components/auth/ValidatePasswordReset";
import firebase from "../firebase";

const INITIAL_STATE = {
  email: ""
};

export default function Forgot() {
  const {
    handleChange,
    handleSubmit,
    values,
    isSubmitting
  } = useFormValidation(
    INITIAL_STATE,
    ValidatePasswordReset,
    handlePasswordReset
  );
  const [busy, setbusy] = useState(false);

  async function handlePasswordReset(props) {
    setbusy(true);
    const { email } = values;
    try {
      await firebase.resetPassword(email);
      toast("Check your E-mail.!");
      props.history.push("/login");
    } catch (err) {
      console.log("Password Reset Error", err);
      toast(err.message);
    }
    setbusy(false);
  }

  return (
    <IonPage>
      <NavHeader title="Forgot Password" />
      <IonContent>
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
        <IonRow>
          <IonCol>
            <IonButton
              type="submit"
              color="primary"
              expand="block"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Get Reset Link
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
}
