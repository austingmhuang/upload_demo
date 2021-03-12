import React, { useState } from "react";
import "../styles/upload.css";
import mergeImages from "merge-images";
import extractFramesFromVideo from "../utils/image_gen";

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
          postData(frames[i]).then(res => {});
        }
        setInputImage(frames[2]);
      });
    };
  };

  /**
   * @param {Takes in a File, which in this case is an image} data
   *
   * Sends data to written server, and will return its response in JSON format.
   * This response is an object like such: {"Key":Value}
   */

  async function postData(data) {
    let imageFile = dataURItoFile(data);

    try {
      const response = await fetch(
        `http://3.236.97.79:8080/predictions/densenet161`,
        {
          method: "POST",
          headers: {
            "Content-Type": "image/jpeg"
          },
          body: imageFile
        }
      );

      return await response.json();
    } catch (error) {
      console.log("bababbabababa");
    } finally {
      return { "ML FAILED": 100 };
    }
  }

  function dataURItoFile(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    let mimeString = dataURI
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    let file = new File([ab], "image.png", { type: mimeString });
    return file;
  }

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
