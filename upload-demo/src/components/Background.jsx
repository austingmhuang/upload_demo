import React from "react";
import "../styles/background.css";

export default function background(props) {
  console.log(props);
  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${props.image})` }}
    >
      {props.children}
    </div>
  );
}
