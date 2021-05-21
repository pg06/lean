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

describe("Test my queries, mutations", () => {
  let tester;

  before(() => {
    tester = new EasyGraphQLTester([userSchema, messageSchema, roomSchema]);
  });

  describe("Should pass if the query is invalid", () => {
    it("Should pass if the query is valid", () => {
      const validUsersQuery = `query { users { id } }`;
      const validRoomsQuery = `query { rooms { id } }`;
      const validMessagesQuery = `query { messages { content } }`;
      tester.test(true, validUsersQuery);
      tester.test(true, validRoomsQuery);
      tester.test(true, validMessagesQuery);
    });

    it("Should create", () => {
      const createUserMutation = `
        mutation createUser($name: String!, $email: String!, $birthday: Date!) {
          createUser(name: $name, email: $email, birthday: $birthday) {
            id
          }
        }
      `;
      const {
        data: { createUser },
      } = tester.mock({
        query: createUserMutation,
        variables: {
          name: "John",
          email: "john@email.com",
          birthday: "2000-01-01",
        },
      });

      const createRoomMutation = `
        mutation createRoom($name: String!) {
          createRoom(name: $name) {
            id
            slug
          }
        }
      `;

      const getRoomMessagesQuery = `
        query roomWithMessages($slug: String!) {
          roomWithMessages(slug: $slug) {
            id
            messages {
              content
            }
          }
        }
      `;

      const {
        data: { createRoom },
      } = tester.mock({
        query: createRoomMutation,
        variables: {
          name: "John",
          email: "john@email.com",
          birthday: "2000-01-01",
        },
      });
      const createMessageMutation = `
        mutation createMessage($content: String!, $userId: String!, $roomId: String!) {
          createMessage(content: $content, userId: $userId, roomId: $roomId) {
            content
          }
        }
      `;
      tester.test(true, createMessageMutation, {
        content: "Hello",
        userId: createUser.id,
        roomId: createRoom.id,
      });

      tester.test(true, getRoomMessagesQuery, {
        slug: createRoom.slug,
      });
    });
  });
});
