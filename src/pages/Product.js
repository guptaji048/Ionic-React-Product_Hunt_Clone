import React from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton
} from "@ionic/react";
import { closeCircleOutline } from "ionicons/icons";

import firebase from "../firebase";
import { Plugins } from "@capacitor/core";
import UserContext from "../context/UserContext";
import NavHeader from "../components/Headers/NavHeader";
import ProductItem from "../components/product/ProductItem";
import ProductPhotos from "../components/product/ProductPhotos";
import ProductService from "../components/product/ProductService";

const { Browser } = Plugins;

const Product = props => {
  const { user } = React.useContext(UserContext);
  const [product, setProduct] = React.useState(null);
  const productId = props.match.params.productId;
  const productRef = firebase.db.collection("products").doc(productId);

  React.useEffect(() => {
    getProduct();
  }, [productId]);

  function getProduct() {
    productRef
      .get()
      .then(doc => {
        setProduct({ ...doc.data(), id: doc.id });
      })
      .catch(err => {
        console.error("Get Product err", err);
      });
  }

  function handleUpVote() {
    if (!user) {
      props.history.push("/login");
    } else {
      ProductService.addUpVote(user, productId)
        .then(newProduct => setProduct(newProduct))
        .catch(() => props.history.push("/login"));
    }
  }

  function handleDeleteProduct() {
    productRef
      .delete()
      .then(() => {
        console.log(`Document with Id ${product.id} removed.!`);
      })
      .catch(err => {
        console.error("Err deleting documents", err);
      });
    props.history.push("/");
  }

  function postedByAuthUser(product) {
    return user && user.uid === product.postedBy.id;
  }

  async function openBrowser() {
    await Browser.open({
      url: product.url
    });
  }

  return (
    <IonPage>
      <NavHeader
        title={product && product.title}
        option={product && postedByAuthUser(product)}
      />
      <IonContent>
        {product && (
          <React.Fragment>
            <IonGrid>
              <IonRow>
                <IonCol class="ion-text-center">
                  <ProductItem product={product} browser={openBrowser} />
                  <ProductPhotos photos={product.photos} />
                  <IonButton onClick={() => handleUpVote()} size="small">
                    Upvote
                  </IonButton>
                  <IonButton onClick={() => handleDeleteProduct()} size="small">
                    Delete
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </React.Fragment>
        )}
      </IonContent>
    </IonPage>
  );
};
export default Product;
