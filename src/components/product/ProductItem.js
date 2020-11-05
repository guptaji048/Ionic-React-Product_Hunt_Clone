import React from "react";
import { withRouter } from "react-router-dom";
import {
  IonItem,
  IonCard,
  IonCardContent,
  IonList,
  IonThumbnail,
  IonImg,
  IonLabel,
  IonText,
  IonIcon,
  IonButton
} from "@ionic/react";
import {
  chevronUpCircleOutline,
  personCircleOutline,
  timeOutline,
  caretUp
} from "ionicons/icons";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import UserContext from "../../context/UserContext";
import ProductService from "./ProductService";
import "./productItem.css";

const ProductItem = ({ product, url, browser, history }) => {
  const { user } = React.useContext(UserContext);

  const addUpVote = e => {
    e.preventDefault();
    e.stopPropagation();
    ProductService.addUpVote(user, product.id).catch(() => {
      history.push("/login");
    });
  };
  return (
    <IonCard routerLink={url} onClick={browser} button>
      <IonCardContent class="ion-no-padding">
        <IonList lines="none">
          <IonItem>
            <IonThumbnail slot="start">
              <IonImg src={product.thumbnail} />
            </IonThumbnail>
            <IonLabel>
              <div className="ion-text-wrap">
                <strong style={{ fontSize: "1rem" }}>{product.title}</strong>
              </div>
              <div className="ion-text-wrap" style={{ fontSize: "0.8rem" }}>
                {product.description}
              </div>
              <p
                style={{
                  alignItems: "center",
                  fontSize: "0.8rem",
                  fontWeight: "normal"
                }}
              >
                <IonIcon
                  icon={chevronUpCircleOutline}
                  style={{ verticalAlign: "middle" }}
                />{" "}
                <IonText style={{ verticalAlign: "middle" }}>
                  {product.voteCount} points
                </IonText>
                {" | "}
                <IonIcon
                  icon={personCircleOutline}
                  style={{ verticalAlign: "middle" }}
                />{" "}
                <IonText style={{ verticalAlign: "middle" }}>
                  {product.postedBy.name}
                </IonText>
                {" | "}
                <IonIcon
                  icon={timeOutline}
                  style={{ verticalAlign: "middle" }}
                />{" "}
                <IonText style={{ verticalAlign: "middle" }}>
                  {formatDistanceToNow(product.created)}
                </IonText>
                {product.comments.length > 0 && (
                  <React.Fragment>
                    {" | "}
                    <IonIcon style={{ verticalAlign: "middle" }}>
                      {product.comments.length} comments
                    </IonIcon>{" "}
                  </React.Fragment>
                )}
              </p>
            </IonLabel>
            <IonButton slot="end" onClick={addUpVote} size="large">
              <div className="upvote-button">
                <IonIcon icon={caretUp} />
                {product.voteCount}
              </div>
            </IonButton>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default withRouter(ProductItem);
