import { HomePage, RoomPage } from "./pages";
import { UserContainer } from "./containers";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/room/:slug" exact component={RoomPage} />
    </Switch>
  );
};

const App = () => {
  return (
    <UserContainer>
      <Router>
        <Routes />
      </Router>
    </UserContainer>
  );
};

export default App;
