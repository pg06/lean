import { graphql } from "@apollo/client/react/hoc";
import { Link } from "react-router-dom";
import { flowRight as compose } from "lodash";
import { RoomQuery } from "../queries/index";
import { useParams } from "react-router-dom";
import "../App.css";

interface User {
  name: string;
  email: string;
  birthday: string;
}

interface Message {
  content: string;
  user: User;
  type: string;
  timestamp: string;
}

interface Room {
  id: string;
  name: string;
  slug: string;
  timestamp: string;
  messages: Message[];
}

interface Data {
  room: Room;
  error: Error;
  loading: boolean;
}

interface Params {
  slug: string;
}

interface Match {
  params: Params;
}

interface Props {
  data: Data;
  match: Match;
}

interface OwnProps {
  match: Match;
}

const HomePage = (props: Props) => {
  const {
    data: { room, error, loading },
  } = props;

  console.log(room);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
    return (
      <div>
        <h4>an error occurred...</h4>
        <p>errrrr</p>
      </div>
    );
  }

  return (
    <section className="room">
      {room.messages.map((message, index) => (
        <div className="message-card" key={message.timestamp}>
          <b>{message.user.name}</b>
          <span>
            <p>{message.content}</p>
          </span>
        </div>
      ))}
    </section>
  );
};

export default compose(
  graphql(RoomQuery, {
    options: ({ match: { params: slug } }: OwnProps) => ({
      variables: { slug },
    }),
  })
)(HomePage);
