import React from "react";
import { IonPage, IonContent, IonSearchbar } from "@ionic/react";
import firebase from "../firebase";
import SmallHeader from "../components/Headers/SmallHeader";
import LargeHeader from "../components/Headers/LargeHeader";
import ProductItem from "../components/product/ProductItem";

export default function Search() {
  const [filteredProduct, setFilteredProduct] = React.useState([]);
  const [product, setProduct] = React.useState([]);
  const [filter, setfilter] = React.useState("");

  React.useEffect(() => {
    getInitalProducts();
  }, []);
  React.useEffect(() => {
    handleSearch();
  }, [filter]);

  function getInitalProducts() {
    firebase.db
      .collection("products")
      .get()
      .then(snapshot => {
        const products = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
        setProduct(products);
      });
  }

  function handleChange(evt) {
    if (evt.key === "Enter") {
      setfilter(evt.target.value);
    }
  }

  function handleSearch() {
    const query = filter.toLowerCase();
    const matchedProduct = product.filter(product => {
      return (
        product.description.toLowerCase().includes(query) ||
        product.url.toLowerCase().includes(query) ||
        product.postedBy.name.toLowerCase().includes(query)
      );
    });
    setFilteredProduct(matchedProduct);
  }
  return (
    <IonPage>
      <SmallHeader title="Search" />
      <IonContent>
        <LargeHeader title="Search" />
        <IonSearchbar
          placeholder="Search here"
          spellcheck="false"
          type="url"
          value={filter}
          onKeyPress={handleChange}
          animated
        />
        {filteredProduct.map((fproduct, index) => (
          <ProductItem
            key={fproduct.id}
            showCount={false}
            product={fproduct}
            index={index}
            url={`/product/${fproduct.id}`}
          />
        ))}
      </IonContent>
    </IonPage>
  );
}
