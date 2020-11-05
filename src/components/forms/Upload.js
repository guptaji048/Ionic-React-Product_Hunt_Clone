import React from "react";
import PropType from "prop-types";
import { IonButton, isPlatform } from "@ionic/react";
import { Plugins, CameraResultType } from "@capacitor/core";
import { dataURItoBlob } from "../../utils/file";
import "./Upload.css";

const { Camera } = Plugins;

function Upload({ onChange, placeHolder, files, multiple, ...rest }) {
  const handleSelectFile = async event => {
    if (isPlatform("mobile")) {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });
      const blob = dataURItoBlob(image.dataUrl);
      onChange([blob]);
    } else {
      onChange([...event.target.files]);
    }
  };

  return (
    <div className="file-input-container">
      {!isPlatform("mobile") && (
        <input
          id="file"
          type="file"
          className="file-input"
          accept="image/*"
          multiple={multiple}
          onChange={handleSelectFile}
        />
      )}
      <IonButton onClick={handleSelectFile} {...rest}>
        {files.length ? `${files.length} Selected` : placeHolder}
      </IonButton>
    </div>
  );
}

Upload.PropType = {
  multiple: PropType.bool,
  files: PropType.array,
  placeHolder: PropType.string,
  onChange: PropType.func
};

export default Upload;
