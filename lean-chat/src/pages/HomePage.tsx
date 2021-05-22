import { graphql } from "@apollo/client/react/hoc";
import { useQuery, useLazyQuery } from "@apollo/client";
import { flowRight as compose } from "lodash";
import { RoomQuery, RoomsDefaultQuery, UsersQuery } from "../queries/index";
import { useState } from "react";
import { RoomPage } from "../pages";
import "../App.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

interface User {
  id: string;
  name: string;
  email: string;
  birthday: string;
}

interface Room {
  id: string;
  name: string;
  slug: string;
  timestamp: string;
}

interface UserData {
  users: User[];
  error: Error;
  loading: boolean;
}

interface RoomData {
  rooms: Room[];
  error: Error;
  loading: boolean;
}

interface History {
  push: Function;
}

interface Params {
  slug: string;
}

interface Match {
  params: Params;
}

interface Props {
  roomsData: RoomData;
  usersData: UserData;
  history: History;
  match: Match;
}

const TabTitle = (props: { title: string; slug: string; removeRoom: any }) => {
  return (
    <div className="tab-title">
      <span>{props.title}</span>
      <span className="close-room">×</span>
      <span
        className="close-room fake"
        onClick={() => props.removeRoom(props.slug)}
      >
        ×
      </span>
    </div>
  );
};

const useImperativeQuery = (query: any) => {
  const { refetch } = useQuery(query, { skip: true });

  const imperativelyCallQuery = (variables: object) => {
    return refetch(variables);
  };

  return imperativelyCallQuery;
};

const HomePage = (props: Props) => {
  const {
    roomsData: { rooms, error, loading },
    usersData: { users, error: errorUsers, loading: loadingUsers },
    history: { push },
    match: {
      params: { slug },
    },
  } = props;
  const getRoom = useImperativeQuery(RoomQuery);

  console.log(props);

  const [tab, setTab] = useState(slug || "$show_users$");
  const [changeRoomName, setChangeRoomName] = useState();
  const [selectedRooms, setRooms] = useState([]);
  console.log(selectedRooms);

  const removeRoom = (slug: string) => {
    if (selectedRooms) {
      setRooms(selectedRooms.filter((r) => r.slug !== slug));
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChangeRoom = async () => {
    if (changeRoomName) {
      const {
        data: { room: newRoom },
      } = await getRoom({ name: changeRoomName });
      console.log(selectedRooms);
      setRooms([...selectedRooms, newRoom]);
      setTab(newRoom.slug);
      push(`/room/${newRoom.slug}`);
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

  if (loading || loadingUsers) {
    return <p>Loading...</p>;
  }

  if (error || errorUsers) {
    console.error(error);
    return (
      <div>
        <h4>an error occurred...</h4>
        <p>errrrr</p>
      </div>
    );
  }

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
              <Nav.Link /*href={`/`}*/ eventKey="$show_users$">Users</Nav.Link>
            </Nav.Item>
            {[...rooms, ...selectedRooms].map((room) => (
              <Nav.Item key={room.slug}>
                <Nav.Link /*href={`/room/${room.slug}`}*/ eventKey={room.slug}>
                  {room.name}
                </Nav.Link>
              </Nav.Item>
            ))}
            <Nav.Item>
              <Nav.Link eventKey="$change_room$">+</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="$show_users$">
              {users.map((user) => (
                <div key={user.email} className="user-item">
                  {user.name}
                </div>
              ))}
            </Tab.Pane>
            {[...rooms, ...selectedRooms].map((room) => (
              <Tab.Pane key={room.slug} eventKey={room.slug}>
                <RoomPage match={{ params: room.slug }} />
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>

        {/* <Tabs
          id="controlled-tab-example"
          transition={false}
          activeKey={tab}
          onSelect={changeRoom}
        >
          <Tab eventKey="$show_users$" title="Rooms">
            {users.map((user) => (
              <div key={user.email}>{user.name}</div>
            ))}
          </Tab>
          {(selectedRooms || rooms || []).map((room) => (
            <Tab
              key={room.slug}
              eventKey={room.slug}
              title={
                // <TabTitle
                //   title={room.name}
                //   slug={room.slug}
                //   removeRoom={removeRoom}
                // ></TabTitle>
                room.name
              }
            >
              <RoomPage match={{ params: room.slug }} />
            </Tab>
          ))}
          <Tab eventKey="$change_room$" title="+"></Tab>
        </Tabs> */}
      </Col>

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
                setChangeRoomName(value);
              }}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleChangeRoom}>
            Enter
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default compose(
  graphql<RoomData>(RoomsDefaultQuery, { name: "roomsData" }),
  graphql<UserData>(UsersQuery, { name: "usersData" })
)(HomePage);
