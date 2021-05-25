import "../App.css";
import type { Message } from "../types";
import Badge from "react-bootstrap/Badge";
import { useEffect, useRef } from "react";
import { useCookies } from "react-cookie";

interface Props {
  message: Message;
}

const ChatMessage = ({ message }: Props) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [cookies] = useCookies(["l"]);
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageRef]);

  let badgeVariant = message.type;
  if (message.type === "info") {
    badgeVariant = "light";
  }
  if (message.type !== "message") {
    return (
      <div className="message-alert">
        <Badge pill variant={badgeVariant}>
          {message.user.name}{" "}
          {message.content === "$enter_room$" ? "joined" : "left"}
        </Badge>
      </div>
    );
  }
  const meClassName = ({ user: { _id } }: Message) =>
    _id === cookies.l ? "me" : "";
  return (
    <div ref={messageRef} className={"message-card " + meClassName(message)}>
      <p>
        <b>{message.user.name}</b>
      </p>
      <span>
        {message.content.split("\n").map((c, i) => (
          <div key={i}>{c}</div>
        ))}
      </span>
    </div>
  );
};

export default ChatMessage;
