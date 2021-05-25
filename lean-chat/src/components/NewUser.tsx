import "../App.css";

import { useState } from "react";
import { connect, ConnectedProps } from "react-redux";

import { useCookies } from "react-cookie";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import { COMPLETE_SIGN_IN, CREATE_UNLOGGED_USER } from "../queries/index";
import { useMutation } from "@apollo/client";
import type { User, UserState } from "../types";

const mapStateToProps = ({ userState: { me } }: UserState) => ({
  me,
});

const mapDispatchToProps = (dispatch: any) => ({
  setMe: (me: User) => dispatch({ type: "SET_ME", me }),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface Error {
  name: boolean;
  email: boolean;
  birthday: boolean;
}

interface Props extends PropsFromRedux {
  handleClose: Function;
  show: boolean;
}

const NewUser = ({ me, show, handleClose, setMe }: Props) => {
  const [user, setValue] = useState<User>({
    _id: me ? me._id : "",
    name: me ? me.name : "",
    email: me ? me.email : "",
    birthday: me ? me.birthday : "",
  });
  const [cookies, setCookie, removeCookie] = useCookies(["l"]);
  const [createUnloggedUserMutation, { error: createUnloggedUserError }] =
    useMutation(CREATE_UNLOGGED_USER);
  const [completeSignInMutation, { error: completeSignInError }] =
    useMutation(COMPLETE_SIGN_IN);

  const handleUser = async () => {
    if (cookies.l) removeCookie("l");
    if (!user) return;
    if (!user.name || !user.name.trim().length) alert();
    if (!user._id && user.name) {
      const {
        data: { createUnloggedUser: unloggedUser },
      } = await createUnloggedUserMutation({
        variables: {
          name: user.name,
        },
      });
      if (createUnloggedUserError) {
        // Handle Create Unlogged User Error
        return;
      }
      setCookie("l", unloggedUser._id, { path: "/" });
      localStorage.setItem("l", unloggedUser._id);
      setMe(unloggedUser);
      handleClose();
    }
    if (user._id && user.email && user.birthday) {
      if (cookies.l) removeCookie("l");
      const {
        data: { completeSignIn: loggedUser },
      } = await completeSignInMutation({
        variables: {
          name: user.name,
          email: user.email,
          birthday: user.birthday,
        },
      });
      if (completeSignInError) {
        // Handle Create User Error
        return;
      }
      setCookie("l", loggedUser._id, { path: "/" });
      localStorage.setItem("l", loggedUser._id);
      setMe(loggedUser);
      handleClose();
    }
  };
  const [errors, setErrors] = useState<Error>({
    name: !`${me && me.name ? me.name : ""}`.length,
    email: !`${me && me.email ? me.email : ""}`.length,
    birthday: !`${me && me.birthday ? me.birthday : ""}`.length,
  });
  function validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  return (
    <>
      <Modal size="sm" show={show} onHide={handleClose}>
        <Modal.Body>
          <Form noValidate onSubmit={handleUser}>
            <Form.Group controlId="formUserNickname">
              <Form.Control
                required
                isInvalid={errors.name}
                value={user.name}
                type="text"
                placeholder="Nickname"
                onChange={({ target: { value: name } }) => {
                  setValue({ ...user, name });
                  setErrors({
                    ...errors,
                    name: !name.trim().length,
                  });
                }}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid Name
              </Form.Control.Feedback>
            </Form.Group>
            {me && me._id && me.name && (
              <Form.Group controlId="formUserEmail">
                <Form.Control
                  required
                  isInvalid={errors.email}
                  value={user.email}
                  type="email"
                  placeholder="Email"
                  onChange={({ target: { value: email } }) => {
                    setValue({ ...user, email });
                    setErrors({
                      ...errors,
                      email: !validateEmail(email),
                    });
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid Email
                </Form.Control.Feedback>
              </Form.Group>
            )}
            {me && me._id && me.name && (
              <Form.Group controlId="formUserBirthday">
                <Form.Control
                  required
                  isInvalid={errors.birthday}
                  value={user.birthday}
                  type="text"
                  maxLength={10}
                  onKeyPress={(event: any) => {
                    if (!/[0-9]|\//.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={({ target: { value: birthday } }) => {
                    setValue({
                      ...user,
                      birthday,
                    });
                    const date = new Date(
                      birthday.split("/").reverse().join(" ")
                    ).getTime();
                    setErrors({
                      ...errors,
                      birthday:
                        birthday.length !== 10 ||
                        !date ||
                        date >= new Date().getTime(),
                    });
                  }}
                  placeholder="Birthday"
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid birth date DD/MM/YYYY
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Form>
          <div className="new-user-footer">
            {user && user._id && (
              <Button variant="secondary" onClick={() => handleClose}>
                Close
              </Button>
            )}{" "}
            <Button
              variant="primary"
              disabled={
                (!me && errors.name) ||
                (me && !!Object.values(errors).filter((r) => r).length)
              }
              onClick={handleUser}
            >
              Sign In
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default connector(NewUser);
