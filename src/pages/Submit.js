import React from "react";
import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonLabel,
  IonRow,
  IonCol,
  IonButton
} from "@ionic/react";
import SmallHeader from "../components/Headers/SmallHeader";
import LargeHeader from "../components/Headers/LargeHeader";
import firebase from "../firebase";
import { toast } from "../utils/toast";
import UserContext from "../context/UserContext";
import useFormValidation from "../hooks/useFormValidation";
import ValidateSubmitProduct from "../components/auth/ValidateSubmitProduct";
import Upload from "../components/forms/Upload";

const INITIAL_STATE = {
  title: "",
  description: "",
  url: ""
};
export default function Submit({ history }) {
  const { user } = React.useContext(UserContext);
  const [isSubmitting, setisSubmitting] = React.useState(false);
  const [thumb, setThumb] = React.useState([]);
  const [photos, setPhotos] = React.useState([]);

  const { handleChange, handleSubmit, values } = useFormValidation(
    INITIAL_STATE,
    ValidateSubmitProduct,
    createProduct
  );

  async function createProduct() {
    try {
      if (!user) {
        history.push("/login");
        return;
      }
      setisSubmitting(true);
      const { title, description, url } = values;
      const id = firebase.db.collection("products").doc().id;

      await Promise.all([
        ...thumb.map((f, index) =>
          firebase.storage
            .ref()
            .child(`products/${id}_thumb_${index}.jpg`)
            .put(f)
        ),
        ...photos.map((f, index) =>
          firebase.storage
            .ref()
            .child(`products/${id}_photos_${index}.jpg`)
            .put(f)
        )
      ]);

      const productPhotos = await Promise.all(
        photos.map((f, index) =>
          firebase.storage
            .ref()
            .child(`products/${id}_photos_${index}.jpg`)
            .getDownloadURL()
        )
      );
      const productThumb = await Promise.all(
        thumb.map((f, index) =>
          firebase.storage
            .ref()
            .child(`products/${id}_thumb_${index}.jpg`)
            .getDownloadURL()
        )
      );

      const newProduct = {
        title,
        url,
        description,
        postedBy: {
          id: user.uid,
          name: user.displayName
        },
        thumbnail: productThumb[0] || null,
        photos: productPhotos,
        voteCount: 1,
        comments: [],
        votes: [
          {
            votedBy: { id: user.uid, name: user.displayName }
          }
        ],
        created: Date.now()
      };
      setPhotos([]);
      setThumb([]);
      await firebase.db
        .collection("products")
        .doc(id)
        .set(newProduct);
      history.push("/");
    } catch (error) {
      console.error("Create Product error", error);
      toast(error.message);
    }
    setisSubmitting(false);
  }
  return (
    <IonPage>
      <SmallHeader title="Submit" />

      <IonContent fullscreen>
        <LargeHeader title="Submit" />
        <IonItem lines="full">
          <IonLabel position="floating">Title</IonLabel>
          <IonInput
            name="title"
            value={values.title}
            type="text"
            onIonChange={handleChange}
            required
          />
        </IonItem>
        <IonItem lines="full">
          <IonLabel position="floating">Description</IonLabel>
          <IonInput
            name="description"
            value={values.description}
            type="text"
            onIonChange={handleChange}
            required
          />
        </IonItem>
        <IonItem lines="full">
          <IonLabel position="floating">Url</IonLabel>
          <IonInput
            name="url"
            value={values.url}
            type="url"
            onIonChange={handleChange}
            required
          />
        </IonItem>
        <IonRow>
          <IonCol>
            <Upload
              files={thumb}
              onChange={setThumb}
              placeHolder="Select Thumbnail"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <Upload
              files={photos}
              onChange={setPhotos}
              placeHolder="Select Product Photos"
              multiple
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton
              type="submit"
              color="primary"
              expand="block"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Create
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
}
