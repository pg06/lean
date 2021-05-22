import { HomePage, RoomPage } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/room/:slug" exact component={HomePage} />
    </Switch>
  );
};

const App = () => {
  return (
    <Router>
      <Routes />
    </Router>
  );
};

export default App;
