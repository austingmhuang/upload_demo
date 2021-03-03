import React, { useState } from "react";
import "../styles/upload.css";
import Canvas from "./Canvas";
import Background from "./Background";
import Title from "./Title";

export default function App() {
  const fileReader = new FileReader();

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
      setInputImage(image.get("image-file"));
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
      setDataResp(Object.keys(response)[0]);
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
      {dataResp}
      <Canvas />
    </>
  );
}
