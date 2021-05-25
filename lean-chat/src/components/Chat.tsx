import "../App.css";
import { useQuery, useMutation } from "@apollo/client";
import { ChatMessage } from "../components";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import type { Room, User, UserState } from "../types";
import { SEND_MESSAGE, GET_MESSAGES, MESSAGE } from "../queries";
import { connect } from "react-redux";

interface Props {
  room: Room;
  setCompleteSignIn: Function;
  me?: User;
}

const Chat = (props: Props) => {
  const { room, setCompleteSignIn, me } = props;
  const [content, setMessage] = useState("");
  const [shiftPressed, pressShift] = useState(false);
  const [sendMessage /*error*/] = useMutation(SEND_MESSAGE);
  const { data, loading, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { roomId: room._id },
  });

  subscribeToMore({
    document: MESSAGE,
    variables: { slug: room.slug },
    updateQuery: (prev, { subscriptionData: { data } }) => {
      if (!data) return prev;
      if (
        prev.getMessagesByRoom.filter(
          ({ _id }: { _id: string }) => _id === data.message._id
        ).length
      ) {
        return prev;
      }
      return Object.assign({}, prev, {
        getMessagesByRoom: [...prev.getMessagesByRoom, data.message],
      });
    },
  });

  const onKeyUp = (event: any) => {
    var code = event.keyCode ? event.keyCode : event.which;
    if (code === 16) {
      pressShift(false);
    }
  };
  const onKeyDown = (event: any) => {
    var code = event.keyCode ? event.keyCode : event.which;
    if (code === 16) {
      pressShift(true);
    }
    if (code === 13 && !shiftPressed) {
      handleMessage(event);
    }
  };
  const completeSignIn = () => {
    setCompleteSignIn(true);
  };
  const handleMessage = async (event: any) => {
    event.preventDefault();
    // setMessage(content.trim());
    if (content.trim().length) {
      await sendMessage({
        variables: {
          content,
          roomId: room._id,
        },
      });
    }
    setMessage("");
  };
  return (
    <div>
      <section className="room">
        <div className="messages">
          {!loading &&
            [...data.getMessagesByRoom].map((message) => (
              <ChatMessage key={message._id} message={message} />
            ))}
        </div>
      </section>
      {me && me.email && me.birthday ? (
        <section className="room-input">
          <Form noValidate onSubmit={handleMessage}>
            <Form.Group>
              <Form.Control
                required
                value={content}
                as="textarea"
                rows={1}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                placeholder="Enter a message"
                onChange={({ target: { value } }) => {
                  setMessage(value);
                }}
              />
            </Form.Group>
          </Form>
        </section>
      ) : (
        <section className="room-input">
          <Button onClick={completeSignIn} block>
            Complete SignIn to send message
          </Button>
        </section>
      )}
    </div>
  );
};

const mapStateToProps = ({ userState: { me } }: UserState) => ({
  me,
});
export default connect(mapStateToProps, null)(Chat);
