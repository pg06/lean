import { graphql } from "@apollo/client/react/hoc";
import { flowRight as compose } from "lodash";
import { GET_ALL_ROOMS, GET_ROOMS_BY_USER, ENTER_ROOM } from "../queries/index";
import "../App.css";
import { Component } from "react";
import Chats from "../components/Chats";
import type { User, Room, Message, Match, History } from "../types";

interface Data {
  enterRoom: Room;
  error: Error;
  loading: boolean;
}

interface MessageData {
  message: Message;
  error: Error;
  loading: boolean;
  subscribeToMore: Function;
}

interface UserData {
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
  data: Data;
  meData: UserData;
  roomsData: RoomData;
  roomsByUserData: RoomData;
  messageData: MessageData;
  match: Match;
  history: History;
  children: Component;
}

interface OwnProps {
  match: Match;
}

const RoomPage = (props: Props) => {
  const {
    data: { enterRoom: room, error, loading },
    roomsData: { getAllRooms },
    roomsByUserData: { getRoomsByUser },
    match,
    history,
  } = props;
  const {
    params: { slug },
  } = match;
  const { push } = history;

  if (slug.indexOf("$") > -1) {
    push("/");
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return (
      <div>
        <h4>[RoomPage] an error occurred...</h4>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <Chats
      rooms={[...(getAllRooms || []), ...(getRoomsByUser || []), room]}
      history={history}
      match={match}
    />
  );
};

export default compose(
  graphql<RoomData>(GET_ALL_ROOMS, { name: "roomsData" }),
  graphql<RoomData>(GET_ROOMS_BY_USER, { name: "roomsByUserData" }),
  graphql(ENTER_ROOM, {
    options: ({
      match: {
        params: { slug },
      },
    }: OwnProps) => ({
      variables: { slug },
      skip: !slug || slug.indexOf("$") > -1,
    }),
  })
)(RoomPage);
