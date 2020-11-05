import React, { Fragment, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonList,
  IonIcon,
  IonLabel,
  IonRow,
  IonCol,
  IonButton,
  IonGrid,
  IonItem,
  IonLoading
} from "@ionic/react";
import { personCircleOutline, mailOutline } from "ionicons/icons";
import firebase from "../firebase";
import { toast } from "../utils/toast";
import SmallHeader from "../components/Headers/SmallHeader";
import LargeHeader from "../components/Headers/LargeHeader";
import UserContext from "../context/UserContext";

export default function Profile(props) {
  const { user } = React.useContext(UserContext);
  const [busy, setbusy] = useState(false);

  async function logoutUser() {
    try {
      setbusy(true);
      await firebase.logout();
      props.history.push("/");
      toast("Logged out successfully.!");
    } catch (err) {
      console.error("Logout Error", err);
      toast(err.message);
    }
    setbusy(false);
  }
  return (
    <IonPage>
      <SmallHeader title="Profile" />
      <IonLoading message="Please wait..." isOpen={busy} />
      <IonContent fullscreen>
        <LargeHeader title="Profile" />
        {user ? (
          <Fragment>
            <IonCard>
              <IonCardContent>
                <IonList lines="none">
                  <IonItem>
                    <IonIcon icon={personCircleOutline} slot="start"></IonIcon>
                    <IonLabel>
                      <strong>{user.displayName}</strong>
                      <p>Full Name</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonIcon icon={mailOutline} slot="start"></IonIcon>
                    <IonLabel>
                      <strong>{user.email}</strong>
                      <p>E-Mail</p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  routerLink={`/edit-profile`}
                  color="primary"
                  fill="outline"
                >
                  Edit Profile
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton expand="block" color="primary" onClick={logoutUser}>
                  Log Out
                </IonButton>
              </IonCol>
            </IonRow>
          </Fragment>
        ) : (
          <Fragment>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton
                    expand="block"
                    routerLink={`/signup`}
                    color="primary"
                  >
                    Sign Up
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton
                    expand="block"
                    routerLink={`/login`}
                    color="primary"
                  >
                    Login
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </Fragment>
        )}
      </IonContent>
    </IonPage>
  );
}
