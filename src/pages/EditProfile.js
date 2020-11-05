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
import UserContext from "../context/UserContext";
import firebase from "../firebase";
import { toast } from "../utils/toast";
import useFormValidation from "../hooks/useFormValidation";
import ValidateEditProfile from "../components/auth/ValidateEditProfile";

export default function EditProfile(props) {
  const { user, setUser } = React.useContext(UserContext);
  const [busy, setbusy] = useState(false);

  const INITIAL_STATE = {
    name: user && user.displayName,
    email: user && user.email,
    newpass: "",
    currpass: ""
  };
  const {
    handleChange,
    handleSubmit,
    setvalues,
    values,
    isSubmitting
  } = useFormValidation(
    INITIAL_STATE,
    ValidateEditProfile,
    updateAuthenticUser
  );

  async function reAuthenticate(email, password) {
    const credentials = firebase.app.auth.EmailAuthProvider.credential(
      email,
      password
    );
    try {
      await user.reauthenticateWithCredential(credentials);
      console.log("Reauthentication Successful");
    } catch (err) {
      console.log("Profile Update Error", err);
      toast(err.message);
    }
  }
  async function updateUserProfile(email, name, password) {
    await user.updateProfile({
      displayName: name
    });
    await user.updateEmail(email);
    if (password) {
      await user.updatePassword(password);
    }
  }
  async function updateAuthenticUser() {
    setbusy(true);
    const { name, email, newpass, currpass } = values;
    try {
      await reAuthenticate(user, email, currpass);
      await updateUserProfile(name, email, newpass);
      const result = await firebase.login(email, newpass || currpass);
      setvalues({
        name: user && user.displayName,
        email: user && user.email,
        currpass: "",
        newpass: ""
      });
      setUser(result.user);
      toast("Proflie updated Successfully.!");
      props.history.push("/profile");
    } catch (err) {
      console.log("Update error", err);
      toast(err.message);
    }
    setbusy(false);
  }
  return (
    <IonPage>
      <NavHeader title="Sign-Up" />
      <IonLoading message={"Loading..."} isOpen={busy} />
      <IonContent>
        <IonItem lines="full">
          <IonLabel position="floating">Full Name</IonLabel>
          <IonInput
            name="name"
            type="text"
            value={values.name}
            onIonChange={handleChange}
          ></IonInput>
        </IonItem>
        <IonItem lines="full">
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            name="email"
            type="email"
            value={values.email}
            onIonChange={handleChange}
          ></IonInput>
        </IonItem>
        <IonItem lines="full">
          <IonLabel position="floating">Current Password</IonLabel>
          <IonInput
            name="cpassword"
            type="password"
            value={values.currpass}
            onIonChange={handleChange}
          ></IonInput>
        </IonItem>
        <IonItem lines="full">
          <IonLabel position="floating">New Password</IonLabel>
          <IonInput
            name="npassword"
            type="password"
            value={values.newpass}
            onIonChange={handleChange}
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
              Save
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
}
