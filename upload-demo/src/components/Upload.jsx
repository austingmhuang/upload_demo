import React, { useState } from "react";
import "../styles/upload.css";
import mergeImages from "merge-images";
import extractFramesFromVideo from "../utils/image_gen";

export default function Upload({ ipAddress, port, model }) {
  console.log(ipAddress, model, port);
  const fileReader = new FileReader();

  let textImage = new Image();

  let frames;

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

    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const videoURL = fileReader.result;
      extractFramesFromVideo(videoURL).then(res => {
        frames = res;
        console.log(frames);
      });
    };
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
