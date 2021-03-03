import React, { useState } from "react";
import "../styles/upload.css";
import mergeImages from "merge-images";
import Upload from "./Upload";

export default function App() {
  return (
    <>
      <div className="Upload">
        <Upload />
      </div>
    </>
  );
}
