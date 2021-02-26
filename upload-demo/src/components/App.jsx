import React from "react";
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

    async function postData(data) {
      const response = await fetch(
        "http://3.236.97.79:8080/predictions/densenet161",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "image/jpeg"
          },
          body: data
        }
      );
      return await response; // an opaque response
    }
    postData(file).then(response => {
      console.log(response);
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
    </>
  );
}
