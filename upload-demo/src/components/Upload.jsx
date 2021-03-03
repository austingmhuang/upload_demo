import React, { useState } from "react";
import "../styles/upload.css";
import mergeImages from "merge-images";

export default function Upload() {
  const fileReader = new FileReader();

  let textImage = new Image();

  const [inputImage, setInputImage] = useState();

  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);

  // Programatically click the hidden file input element when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component) to handle the user-selected file
  const handleChange = event => {
    const file = event.target.files[0];
    console.log(file);
    let image;
    let imgHeight;
    let imgWidth;
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const data = fileReader.result;
      const forImgHeight = new Image();
      forImgHeight.src = data;
      forImgHeight.onload = () => {
        imgWidth = forImgHeight.naturalWidth;
        imgHeight = forImgHeight.naturalHeight;
      };
      image = new FormData();
      image.append("image-file", data);
    };
    postData(file).then(response => {
      /**
       * All this code below here is very weird. I will try to write a more concise and "react" way of
       * accessing the canvas. But for now this works so I will leave it like this...
       */
      let canvasElement = document.createElement("canvas");
      canvasElement.width = imgWidth;
      canvasElement.height = imgHeight;
      let canvas = canvasElement.getContext("2d");
      canvas.fillStyle = "#00FFFF";
      canvas.textAlign = "center";
      canvas.textBaseline = "middle";
      canvas.font = "15px Arial";
      canvas.fillText(Object.keys(response)[0], imgWidth / 2, imgHeight - 50);
      textImage.src = canvas.canvas.toDataURL();

      mergeImages([image.get("image-file"), textImage.src]).then(b64 =>
        setInputImage(b64)
      );
    });
  };

  async function postData(data) {
    const response = await fetch(
      "http://3.236.97.79:8080/predictions/densenet161",
      {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg"
        },
        body: data
      }
    );
    return await response.json();
  }

  return (
    <>
      <button onClick={handleClick}>Upload a file</button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }} /* Make the file input element invisible */
      />
      <img src={inputImage}></img>
    </>
  );
}
