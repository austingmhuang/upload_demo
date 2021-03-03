import React, { useState, useRef, useEffect } from "react";
import "../styles/upload.css";
// import Canvas from "./Canvas";
import Background from "./Background";
import Title from "./Title";
import mergeImages from "merge-images";
import dude from "./7.png";
import dudette from "./8.png";

export default function App() {
  const fileReader = new FileReader();

  let textImage = new Image();

  const [dataResp, setDataResp] = useState("");
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
    let image;
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const data = fileReader.result;
      image = new FormData();
      image.append("image-file", data);
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
    postData(file).then(response => {
      let canvasElement = document.createElement("canvas");
      canvasElement.width = 100;
      canvasElement.height = 100;
      let canvas = canvasElement.getContext("2d");
      canvas.fillStyle = "#f6d021";
      canvas.textAlign = "center";
      canvas.textBaseline = "middle";
      canvas.font = "15px Arial";
      canvas.fillText(Object.keys(response)[0], 50, 10);
      textImage.src = canvas.canvas.toDataURL();
      mergeImages([image.get("image-file"), textImage.src]).then(b64 =>
        setInputImage(b64)
      );
    });
  };

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
