import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonContent
} from "@ionic/react";
import SmallHeader from "../components/Headers/SmallHeader";
import LargeHeader from "../components/Headers/LargeHeader";
import ProductList from "../components/product/ProductList";

export default function Home(props) {
  return (
    <IonPage>
      <SmallHeader title="Home" />
      <IonContent color="medium" fullscreen>
        <LargeHeader title="Home" />
        <br></br>
        <ProductList location={props.location} />
      </IonContent>
    </IonPage>
  );
}
