export interface User {
  _id: string;
  name: string;
  email: string;
  birthday: string;
}

export interface Message {
  _id: string;
  content: string;
  type: string;
  user: User;
  timestamp: string;
}

export interface Room {
  _id: string;
  name: string;
  slug: string;
  timestamp: string;
  messages: Message[];
}

export interface History {
  push: Function;
  replace: Function;
}

export interface Params {
  slug: string;
}

export interface Match {
  params: Params;
}

export interface UserState {
  userState: {
    me: User;
  };
}
