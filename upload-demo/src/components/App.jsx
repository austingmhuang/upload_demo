import React from "react";
import _ from "lodash";
import "../styles/upload.css";

export default function Upload() {
  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);

  // Programatically click the hidden file input element when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component) to handle the user-selected file
  const handleChange = event => {
    const file = event.target.files[0];
    var r = new FileReader();
    r.readAsBinaryString(file);
    var data;
    r.onload = () => {
      data = r.result;
      console.log(data);

      const formData = new FormData();

      formData.append("image-file", data);

      fetch("http://3.236.97.79:8080/predictions/densenet161", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/octet-stream" },
        body: formData
      })
        .then(response => {
          return response.json();
        })
        .then(json => {
          console.log(json);
        });
    };
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
    </>
  );
}
