import { connect, ConnectedProps } from "react-redux";

import { NewUser } from "../components";
import { UserState } from "../types/index";

const mapStateToProps = ({ userState: { me } }: UserState) => ({
  me,
});

const connector = connect(mapStateToProps, () => ({}));
type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  children: JSX.Element;
}

const UserContainer = (props: Props) => {
  const { me, children } = props;
  console.log(props);
  if (!me) {
    return <NewUser show={true} handleClose={() => {}} />;
  }
  return children;
};

export default connector(UserContainer);
