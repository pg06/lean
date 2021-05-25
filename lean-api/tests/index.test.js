"use strict";

const fs = require("fs");
const path = require("path");
const EasyGraphQLTester = require("easygraphql-tester");

const userSchema = fs.readFileSync(
  path.join(__dirname, "..", "src", "typeDefs", "user.graphql"),
  "utf8"
);
const messageSchema = fs.readFileSync(
  path.join(__dirname, "..", "src", "typeDefs", "message.graphql"),
  "utf8"
);
const roomSchema = fs.readFileSync(
  path.join(__dirname, "..", "src", "typeDefs", "room.graphql"),
  "utf8"
);

const createUnloggedUserMutation = `
        mutation createUnloggedUser($name: String!) {
          createUnloggedUser(name: $name) {
            _id
          }
        }
      `;
const completeSignInMutation = `
        mutation completeSignIn($name: String!, $email: String!, $birthday: String!) {
          completeSignIn(name: $name, email: $email, birthday: $birthday) {
            _id
          }
        }
      `;
const enterRoomQuery = `
        query enterRoom($slug: String, $name: String) {
          enterRoom(slug: $slug, name: $name) {
            _id
            messages {
              content
            }
          }
        }
      `;

const sendMessageMutation = `
        mutation sendMessage($content: String!, $userId: String!, $roomId: String!) {
          sendMessage(content: $content, userId: $userId, roomId: $roomId) {
            content
          }
        }
      `;

describe("Test queries/mutations", () => {
  let tester;
  let user;
  let room;

  before(() => {
    tester = new EasyGraphQLTester([userSchema, messageSchema, roomSchema]);
  });

  describe("Should pass if valid", () => {
    it("Login <query createUnloggedUser>", () => {
      const {
        data: { createUnloggedUser },
      } = tester.mock({
        query: createUnloggedUserMutation,
        variables: {
          name: "John",
        },
      });

      user = createUnloggedUser;

      tester.test(true, createUnloggedUserMutation, {
        name: "John",
      });
    });

    it("Enter room with Sign in <query enterRoom>", () => {
      const {
        data: { enterRoom },
      } = tester.mock({
        query: enterRoomQuery,
        variables: {
          slug: "My Room",
          userId: user._id,
        },
      });

      room = enterRoom;

      tester.test(true, enterRoomQuery, {
        slug: enterRoom.slug,
        userId: user._id,
      });
    });

    it("Complete Sign <mutation completeSignIn>", () => {
      const {
        data: { completeSignIn },
      } = tester.mock({
        query: completeSignInMutation,
        variables: {
          userId: user.id,
          name: "John",
          email: "john@email.com",
          birthday: "2000-01-01",
        },
      });

      user = completeSignIn;

      tester.test(true, completeSignInMutation, {
        userId: user.id,
        name: "John",
        email: "john@email.com",
        birthday: "2000-01-01",
      });
    });

    it("Send message <mutation sendMessage>", () => {
      tester.test(true, sendMessageMutation, {
        content: "Hello",
        userId: user._id,
        roomId: room._id,
      });
    });
  });
});
