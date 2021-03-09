import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./styles/upload.css";
import Upload from "./components/Upload";
import Form from "./components/Form";

export default function App() {
  return (
    <>
      <Form />
      <Upload />
    </>
  );
}
