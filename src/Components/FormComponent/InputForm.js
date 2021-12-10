import React, { Component, useState } from "react";

export default function InputForm(props) {
  return (
    <div className="mb-3">
      <input
        type={props.type}
        className="form-control"
        id="formGroupExampleInput"
        placeholder={props.label}
        value={props.value}
      />
    </div>
  );
}
