import { gql } from "@apollo/client";

const GET_SELF = gql`
  query {
    getSelf {
      _id
      name
      email
      birthday
    }
  }
`;

const CREATE_UNLOGGED_USER = gql`
  mutation createUnloggedUser($name: String!) {
    createUnloggedUser(name: $name) {
      _id
      name
      email
      birthday
    }
  }
`;

const COMPLETE_SIGN_IN = gql`
  mutation completeSignIn($name: String!, $email: String!, $birthday: String!) {
    completeSignIn(name: $name, email: $email, birthday: $birthday) {
      _id
      name
      email
      birthday
    }
  }
`;

const GET_ALL_ROOMS = gql`
  query {
    getAllRooms(isDefault: true) {
      _id
      name
      slug
      isDefault
      timestamp
    }
  }
`;

const GET_ROOMS_BY_USER = gql`
  query {
    getRoomsByUser {
      _id
      name
      slug
      isDefault
      timestamp
      messages {
        _id
        content
        type
        user {
          _id
          name
          email
          birthday
        }
        type
        timestamp
      }
    }
  }
`;

const ENTER_ROOM = gql`
  query enterRoom($name: String, $slug: String) {
    enterRoom(name: $name, slug: $slug) {
      _id
      name
      slug
      isDefault
      timestamp
      messages {
        _id
        content
        user {
          _id
          name
          email
          birthday
        }
        type
        timestamp
      }
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($content: String!, $roomId: String!) {
    createMessage(content: $content, roomId: $roomId) {
      _id
      content
      user {
        _id
        name
        email
        birthday
      }
      type
      timestamp
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessagesByRoom($roomId: String!) {
    getMessagesByRoom(roomId: $roomId) {
      _id
      content
      user {
        _id
        name
        email
        birthday
      }
      type
      timestamp
    }
  }
`;

const MESSAGE = gql`
  subscription message($slug: String!) {
    message(slug: $slug) {
      _id
      content
      user {
        _id
        name
        email
        birthday
      }
      type
      timestamp
    }
  }
`;

export {
  COMPLETE_SIGN_IN,
  CREATE_UNLOGGED_USER,
  ENTER_ROOM,
  GET_MESSAGES,
  GET_ROOMS_BY_USER,
  GET_SELF,
  MESSAGE,
  GET_ALL_ROOMS,
  SEND_MESSAGE,
};
