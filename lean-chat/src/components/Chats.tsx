import { useState } from "react";
import { useCookies } from "react-cookie";
import slugify from "slugify";
import { useMutation } from "@apollo/client";
import * as _ from "lodash";

import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";

import "../App.css";
import { LEAVE_ROOM } from "../queries/index";
import { EnterRoomModal, NewUser } from "../components";
import type { Room, History, Match } from "../types";
import Chat from "./Chat";

interface Props {
  rooms: Room[];
  history: History;
  match: Match;
}

const Chats = ({ rooms, history, match }: Props) => {
  const [show, setShow] = useState(false);
  const [completeSignIn, setCompleteSignIn] = useState(false);
  const [tab /*setTab*/] = useState(
    match.params.slug
      ? match.params.slug
      : rooms && rooms.length
      ? rooms[0].slug
      : "$show_users$"
  );
  const [selectedRooms /*setRooms*/] = useState<Room[]>(
    _.uniqBy(rooms, (r) => r._id)
  );
  const [cookies /*setCookie, removeCookie */] = useCookies(["l"]);
  const [changeRoomName, setChangeRoomName] =
    useState<null | string | undefined>();
  const [leaveRoom /*error*/] = useMutation(LEAVE_ROOM);

  const { push } = history;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChangeRoom = async () => {
    if (changeRoomName) {
      const newSlug = slugify(changeRoomName);
      push(`/room/${newSlug}`);
    }
    handleClose();
    setChangeRoomName(null);
  };

  const changeRoom = async (slug: string | null) => {
    if (slug === "$change_room$") {
      return handleShow();
    } else if (slug === "$leave_room$") {
      const newSlug =
        selectedRooms.length > 1
          ? selectedRooms[selectedRooms.length - 2].slug
          : null;
      if (match.params.slug) {
        leaveRoom({ variables: { slug: match.params.slug } });
      }

      if (newSlug) {
        push(`/room/${newSlug}`);
      } else {
        push(`/`);
      }
    } else if (slug === "$show_users$") {
      push(`/`);
      return;
    }
    if (slug && slug.indexOf("$") === -1) {
      push(`/room/${slug}`);
    }
  };

  return (
    <Container className="container">
      <Col>
        <Tab.Container
          id="chat-tabs"
          onSelect={changeRoom}
          defaultActiveKey={tab}
        >
          <Nav variant="pills">
            <Nav.Item>
              <Nav.Link /*href={`/`}*/ eventKey="$show_users$" disabled>
                Chats:
              </Nav.Link>
            </Nav.Item>
            {selectedRooms.map((_room) => (
              <Nav.Item key={_room.slug}>
                <Nav.Link /*href={`/room/${room.slug}`}*/ eventKey={_room.slug}>
                  {_room.name}
                </Nav.Link>
              </Nav.Item>
            ))}
            <Nav.Item>
              <Nav.Link eventKey="$change_room$">+</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="$leave_room$">Leave Chat</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className={!cookies.l ? "new-user-modal" : ""}>
            <Tab.Pane eventKey="$show_users$"></Tab.Pane>
            {selectedRooms.map((_room) => (
              <Tab.Pane key={_room.slug} eventKey={_room.slug}>
                <Chat room={_room} setCompleteSignIn={setCompleteSignIn} />
              </Tab.Pane>
            ))}
            <Tab.Pane eventKey="$leave_room$"></Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Col>

      <EnterRoomModal
        show={show}
        handleClose={handleClose}
        setValue={setChangeRoomName}
        handleSubmit={handleChangeRoom}
      />

      <NewUser
        show={completeSignIn}
        handleClose={() => setCompleteSignIn(false)}
      />
    </Container>
  );
};

export default Chats;
