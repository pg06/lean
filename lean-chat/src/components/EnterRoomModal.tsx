import "../App.css";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {MouseEventHandler} from "react";


interface Props {
  show: boolean;
  handleClose: MouseEventHandler;
  setValue: Function;
  handleSubmit: MouseEventHandler;
}

const EnterRoomModal = ({show, handleClose, setValue, handleSubmit}: Props) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Enter Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="change-room">Chat</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Name"
            aria-label="Name"
            aria-describedby="change-room"
            onChange={({ target: { value } }) => {
              setValue(value);
            }}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Enter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EnterRoomModal;
