import React from "react";
import formatDate from "date-fns/format";
import isYesterday from "date-fns/isYesterday";
import isToday from "date-fns/isToday";
import firebase from "../../firebase";
import ProductItem from "./ProductItem";
import { IonLabel, IonItem } from "@ionic/react";

const ProductList = props => {
  const [products, setProducts] = React.useState([]);
  const isTrending = props.location.pathname.includes("trending");

  React.useEffect(() => {
    const unsub = getProduct();
    return () => unsub();
  }, [isTrending]);

  function getProduct() {
    if (isTrending) {
      return firebase.db
        .collection("products")
        .orderBy("voteCount", "desc")
        .onSnapshot(handleSnapShot);
    }
    return firebase.db
      .collection("products")
      .orderBy("created", "desc")
      .onSnapshot(handleSnapShot);
  }

  function handleSnapShot(snapshot) {
    const products = snapshot.docs.map(docs => {
      return { id: docs.id, ...docs.data() };
    });
    setProducts(products);
  }
  let prevData = null;

  return products.map((product, index) => {
    const result = [
      <ProductItem
        key={product.id}
        showCount={true}
        url={`/product/${product.id}`}
        product={product}
        index={index + 1}
      />
    ];
    const currentDate = isToday(product.created)
      ? "Today"
      : isYesterday(product.created)
      ? "Yesterday"
      : formatDate(product.created, "MMM d");

    if (currentDate !== prevData && !isTrending) {
      result.unshift(
        <IonItem color="medium" lines="none" key={currentDate}>
          <IonLabel>
            <strong>{currentDate}</strong>
          </IonLabel>
        </IonItem>
      );
      prevData = currentDate;
    }

    return result;
  });
};

export default ProductList;
