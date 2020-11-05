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

export default function Trending(props) {
  return (
    <IonPage>
      <SmallHeader title="Trending" />
      <IonContent fullscreen>
        <LargeHeader title="Trending" />
        <ProductList location={props.location} />
      </IonContent>
    </IonPage>
  );
}
