import React, { useState } from "react";
import { useForm } from "react-hook-form";
import mergeImages from "merge-images";

function Form() {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = event => {
    const file = event.image[0];
    let ipAddress = event.ipAddress;
    let port = event.port;
    let model = event.model;

    console.log(file, ipAddress, port, model);
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

    postData(file, ipAddress, port, model).then(response => {
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
  const fileReader = new FileReader();

  let textImage = new Image();

  const [inputImage, setInputImage] = useState();

  async function postData(data, ipAddress, port, model) {
    const response = await fetch(
      `http://${ipAddress}:${port}/predictions/${model}`,
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
    <div className="wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="IP Address"
          name="ipAddress"
          ref={register({ required: true })}
        />
        {errors.ipAddress && <span>Need IP Address</span>}
        <input
          type="text"
          placeholder="Port"
          name="port"
          ref={register({ required: true })}
        />
        {errors.port && <span>Need port</span>}
        <input
          type="text"
          placeholder="MLModel"
          name="model"
          ref={register({ required: true })}
        />
        {errors.model && <span>Need Model</span>}
        <input
          type="file"
          name="image"
          accept="image/png, image/jpeg"
          ref={register({ required: true })}
        />
        <input type="submit" />
      </form>
      <img src={inputImage}></img>
    </div>
  );
}

export default Form;
