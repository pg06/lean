import { gql } from "@apollo/client";

const UsersQuery = gql`
  query {
    users {
      _id
      name
      email
      birthday
    }
  }
`;

const RoomsDefaultQuery = gql`
  query {
    rooms(isDefault: true) {
      _id
      name
      slug
      isDefault
      timestamp
    }
  }
`;

const RoomsQuery = gql`
  query {
    rooms {
      name
      slug
      isDefault
      timestamp
    }
  }
`;

const RoomQuery = gql`
  query room($name: String, $slug: String) {
    room(name: $name, slug: $slug) {
      name
      slug
      isDefault
      timestamp
      messages {
        content
        user {
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

export { RoomsDefaultQuery, RoomsQuery, RoomQuery, UsersQuery };
