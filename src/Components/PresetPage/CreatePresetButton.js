import React, { useState } from "react";
import { Accordion, Row, Table, Card, Modal, Button } from "react-bootstrap";
import api from "helpers/api";
import mappers from "helpers/mappers";
import reverse_mappers from "helpers/reverse_mappers";

function CreatePresetButton({}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [presetName, setPresetName] = useState("");

  const handleChangePresetName = (event) => {
    setPresetName(event.target.value);
  };

  const handleSavePreset = async () => {
    try {
      const body = reverse_mappers.presetsMapper({ name: presetName });
      const res = await api.createOnePreset({ body });
      if (res.ok) {
        const resJSON = await res.json();
        console.log("api.createOnePreset() : ", resJSON);
        // setAllMenus(resJSON.map(mappers.menusMapper));
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="col-6 btn btn-warning"
        onClick={handleShow}
      >
        Ajouter un Preset
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>create a preset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col">
              <div className="">
                <label>Nom du preset</label>
                <input
                  type="text"
                  className="form-control"
                  id="labelPreset"
                  placeholder="Nom du Preset"
                  onChange={handleChangePresetName}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSavePreset}>
            Create Preset
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreatePresetButton;