import React, { Component, useState, useEffect } from "react";

export default function FridgeProductCard({ product, parentProps }) {
  const [added, setAdded] = useState(
    // parentProps.states.products.hasElById(product.id)
    false
  );

  useEffect(() => {
    const productConfig = parentProps.states.products.findElById(product.id);
    if (productConfig && productConfig.min != 0 && productConfig.max != 0)
      setAdded(true);
  }, []);

  // const handleAddProduct = () => setAdded(!added);
  // const handleAddProduct = () => {
  //   setAdded(!added);
  //   const productToAdd = { id: product.id, name: product.name, quantity: 0, min: 0, max: 0 }
  //   if (added) parentProps.states.productsAdded.removeMany([productToAdd]);
  //   else parentProps.states.productsAdded.addOrUpdateMany([productToAdd]);
  // };

  const handleAddProduct = () => {
    const productConfig = parentProps.states.products.get(product.id);
    console.log("productConfig : ", productConfig);
    if (productConfig.value) {
      if (added) {
        if (productConfig.value.quantity > 0) {
          productConfig.update({ min: 0, max: 0 });
        } else {
          productConfig.remove();
        }
      } else {
        const productToAdd = {
          id: product.id,
          name: product.name,
          quantity: productConfig.value.quantity,
          min: 1,
          max: 1,
        };
        parentProps.states.products.addOrUpdateMany([productToAdd]);
      }
    } else {
      const productToAdd = {
        id: product.id,
        name: product.name,
        quantity: 0,
        min: 1,
        max: 1,
      };
      parentProps.states.products.addOrUpdateMany([productToAdd]);
    }
    setAdded(!added);
  };

  return (
    <div className={`card productCard m-2`} key={product.id}>
      <div className="card-body p-5 text-center">
        <div className="">
          <img
            className="card-img-top"
            alt="Image"
            src={product.image}
          />
        </div>
        <h5 class="card-title">{product.name}</h5>
        <hr className="my-2" />
        <div className="">
          <button
            onClick={handleAddProduct}
            type="submit"
            className={`btn ${added ? "btn-success" : "btn-dark blue"} m-1`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
