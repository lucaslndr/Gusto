import React, { Component, useState, useContext } from "react";
import Page from "Components/Page";
import FrigesProduitCard from "Components/FridgesProduitsCard";
import { Accordion, Row, Table, Card, AccordionContext, useAccordionButton, Button } from "react-bootstrap";

function CustomToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);
  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  );
  const isCurrentEventKey = activeEventKey === eventKey;
  return (
    <button
      type="button"
      style={{ backgroundColor: isCurrentEventKey ? "pink" : "lavender" }}
      onClick={decoratedOnClick}
      // className="row h-100"
    >
      {children}
    </button>
  );
}

export default function FridgesAccordion({ id, fridgeName, fridgeStatus }) {

  return (
    <>
      <Accordion.Item eventKey={id}>
        <Accordion.Header>
          <div className="col">{fridgeName}</div>
          <div className="col"></div>
          <div className="col">{fridgeStatus}</div>
          <div className="col"></div>
        </Accordion.Header>
        <Accordion.Body>
          <div className="container">
            <div className="row row-cols-lg-2 d-flex flex-columns justify-content-center">
              <div className="col red">
                <FrigesProduitCard />
              </div>
              <div className="col blue">
                <FrigesProduitCard />
              </div>
              <div className="col blueviolet">
                <FrigesProduitCard />
              </div>
              <div className="col blue">
                <FrigesProduitCard />
              </div>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}
