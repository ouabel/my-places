import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './Components/LoginPage/LoginPage';
import Signup from './Components/SignupPage/SingupPage';
import HistoryShow from './Components/HistoryShow/HistoryShow';
import PlaceCreate from './Components/PlaceCreate/PlaceCreate';
import PlaceShow from './Components/PlaceShow/PlaceShow';
import PlaceList from './Components/PlaceList/PlaceList';
import PositionShow from './Components/PositionShow/PositionShow';
import AppBar from './Components/AppBar/AppBar';

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

function App() {
  const [isAuth, setIsAuth] = useState(Boolean(localStorage.getItem('auth')));
  const [coords, setCoords] = useState();
  const matchLogin = useRouteMatch('/login');
  const matchRegister = useRouteMatch('/register');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCoords(position.coords);
    });
  }, [])

  if (!isAuth && !matchLogin && !matchRegister) {
    return <Redirect to="/login" />;
  }

  if (isAuth && matchLogin) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      {isAuth && <div><AppBar setIsAuth={setIsAuth} /><br /></div>}
      <Switch>
        <Route path="/register" component={Signup} />
        <Route path="/login" render={() => <LoginPage setIsAuth={setIsAuth} />} />
        <Route path="/history" component={HistoryShow} />
        <Route path="/places/create" component={PlaceCreate} />
        <Route path="/places/:id" render={({ match }) => <PlaceShow coords={coords} match={match} />} />
        <Route path="/places" component={PlaceList} />
        <Route path="/" render={() => <PositionShow coords={coords} />} />
      </Switch>
    </div>

  )
}

export default App

ReactDOM.render(<Router basename="#"><App /></Router>, document.getElementById('root'));
