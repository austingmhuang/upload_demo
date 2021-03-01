import React, { useState, useEffect } from "react";
import "../styles/upload.css";

export default function App() {
  const [dataResp, setDataResp] = useState("");

  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);

  // Programatically click the hidden file input element when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component) to handle the user-selected file
  const handleChange = event => {
    const file = event.target.files[0];

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
      console.log(response);
      console.log(Object.keys(response)[0]);
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
      {dataResp}
    </>
  );
}
