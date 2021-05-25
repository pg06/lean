import { useState } from "react";
import { useCookies } from "react-cookie";
import slugify from "slugify";

import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";

import "../App.css";
import { EnterRoomModal, NewUser } from "../components";
import type { Room, History, Match } from "../types";
import Chat from "./Chat";

interface Props {
  room: Room | undefined;
  rooms: Room[];
  history: History;
  match: Match;
}

const Chats = ({ rooms, room, history, match }: Props) => {
  const [show, setShow] = useState(false);
  const [completeSignIn, setCompleteSignIn] = useState(false);
  const [tab, setTab] = useState(
    rooms && rooms.length ? rooms[0].slug : room ? room.slug : "$show_users$"
  );
  const [selectedRooms /*setRooms*/] = useState<Room[]>(
    room && !rooms.filter((r) => r._id === room._id).length
      ? [...rooms, room]
      : rooms
  );
  const [cookies /*setCookie, removeCookie */] = useCookies(["l"]);
  const [changeRoomName, setChangeRoomName] =
    useState<null | string | undefined>();

  const { push } = history;
  // const {
  //   params: { slug },
  // } = match;

  // useEffect(() => {
  //   if (rooms && !selectedRooms.length) {
  //     setRooms(rooms);
  //   }
  //   if (room && !selectedRooms.filter((r) => r.slug === room.slug).length) {
  //     setRooms([...selectedRooms, room]);
  //   }
  // }, []);

  // if (cookies.selectedrooms) removeCookie("selectedrooms");
  // if (selectedRooms) {
  //   setCookie("selectedrooms", selectedRooms.map(({ _id }) => _id).join(";"), {
  //     path: "/",
  //   });
  // }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChangeRoom = async () => {
    if (changeRoomName) {
      const newSlug = slugify(changeRoomName);
      // // const {
      // //   data: { enterRoom: newRoom },
      // // } = await enterRoom({ name: changeRoomName });

      // setRooms([...selectedRooms, newRoom]);
      // setTab(newRoom.slug);
      push(`/room/${newSlug}`);
    }
    handleClose();
    setChangeRoomName(null);
  };

  const changeRoom = (slug: string | null) => {
    if (slug === "$change_room$") {
      return handleShow();
    }
    if (slug === "$show_users$") {
      setTab(slug);
      push(`/`);
      return;
    }
    if (slug && slug.indexOf("$") === -1) {
      setTab(slug);
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
          </Nav>
          <Tab.Content className={!cookies.l ? "new-user-modal" : ""}>
            <Tab.Pane eventKey="$show_users$">
              {/* {users.map((user) => (
                <div key={user.email} className="user-item">
                  {user.name}
                </div>
              ))} */}
            </Tab.Pane>
            {selectedRooms.map((_room) => (
              <Tab.Pane key={_room.slug} eventKey={_room.slug}>
                <Chat room={_room} setCompleteSignIn={setCompleteSignIn} />
              </Tab.Pane>
            ))}
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
