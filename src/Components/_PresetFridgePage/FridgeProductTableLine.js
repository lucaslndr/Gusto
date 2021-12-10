import React, { Component, useState, useEffect } from "react";
import Value from "helpers/Value";

export default function FridgeProductTableLine({ product, parentProps }) {
  const removed = new Value(useState(false));

  useEffect(() => {
    removed.set(product.value.min == 0 && product.value.max == 0);
  }, [product]);

  const handleProductChangeValue = (property) => (event) => {
    const body = {};
    body[property] = event.target.value;
    product.update(body);
  };

  const removeProduct = () => {
    if (product.value.quantity > 0) {
      product.update({ min: 0, max: 0 });
    } else {
      product.remove();
    }
  };

  return (
    <tr>
      <td>{product.value.name}</td>
      <td>{product.value.quantity}</td>
      <td>
        {removed.value ? (
          product.value.min
        ) : (
          <input
            className="w-100"
            type="number"
            onChange={handleProductChangeValue("min")}
            value={product.value.min}
          />
        )}
      </td>
      <td>
        {removed.value ? (
          product.value.max
        ) : (
          <input
            className="w-100"
            type="number"
            onChange={handleProductChangeValue("max")}
            value={product.value.max}
          />
        )}
      </td>
      <td>
        <button
          onClick={removeProduct}
          type="submit"
          className="btn btn-danger red m-1"
        >
          X
        </button>
      </td>
    </tr>
  );
}
