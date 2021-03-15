import React, { useState } from "react";
import "../styles/upload.css";
import mergeImages from "merge-images";
import extractFramesFromVideo from "../utils/image_gen";
import dataURItoFile from "../utils/dataToURIFile";
import postData from "../utils/postData";

export default function Upload({ ipAddress, port, model }) {
  const fileReader = new FileReader();

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
        for (let i = 0; i < frames.length; i++) {
          postData(frames[i]).then(res => {
            console.log(res);
          });
        }
        setInputImage(frames[2]);
      });
    };
  };

  return (
    <>
      <button onClick={handleClick}>Upload a video</button>
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
