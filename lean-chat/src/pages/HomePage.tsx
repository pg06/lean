import { graphql } from "@apollo/client/react/hoc";
import { useCookies } from "react-cookie";
import { flowRight as compose } from "lodash";
import { GET_ALL_ROOMS, GET_ROOMS_BY_USER } from "../queries/index";
import "../App.css";
import Chats from "../components/Chats";
import type { Room, User, History, Match } from "../types";

interface UserData {
  getAllUsers: User[];
  getSelf: User;
  error: Error;
  loading: boolean;
}

interface RoomData {
  getAllRooms: Room[];
  getRoomsByUser: Room[];
  error: Error;
  loading: boolean;
}

interface Props {
  roomsData: RoomData;
  roomsByUserData: RoomData;
  usersData: UserData;
  history: History;
  match: Match;
}

const HomePage = (props: Props) => {
  const {
    roomsData: { getAllRooms, error: errorAllRooms, loading: loadingAllRooms },
    roomsByUserData: {
      getRoomsByUser,
      error: errorRoomsByUser,
      loading: loadingRoomsByUser,
    },
    history,
    match,
  } = props;
  const { push } = history;
  const [cookies] = useCookies(["l"]);
  const rooms: Room[] = [];
  if (getAllRooms) {
    getAllRooms.forEach((r) => {
      if (!rooms.filter((_r) => _r._id === r._id).length) rooms.push(r);
    });
  }
  if (getRoomsByUser) {
    getRoomsByUser.forEach((r) => {
      if (!rooms.filter((_r) => _r._id === r._id).length) rooms.push(r);
    });
  }

  if (loadingAllRooms || loadingRoomsByUser) {
    return <p>Loading...</p>;
  }

  if (errorAllRooms || errorRoomsByUser) {
    console.error(errorAllRooms);
    console.error(errorRoomsByUser);
    return (
      <div>
        <h4>[HomePage] an error occurred...</h4>
        {errorAllRooms && <p>[All Rooms] {errorAllRooms.message}</p>}
        {errorRoomsByUser && <p>[Rooms By User]{errorRoomsByUser.message}</p>}
      </div>
    );
  }

  if (rooms.length && cookies.l) {
    push(`/room/${rooms[0].slug}`);
  }

  return (
    <Chats rooms={rooms} room={undefined} history={history} match={match} />
  );
};

export default compose(
  graphql<RoomData>(GET_ALL_ROOMS, { name: "roomsData" }),
  graphql<RoomData>(GET_ROOMS_BY_USER, { name: "roomsByUserData" })
)(HomePage);
