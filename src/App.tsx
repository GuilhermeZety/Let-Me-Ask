//System
import { BrowserRouter, Route, Switch } from 'react-router-dom';

//contexts 
import { AuthContextProvider } from './contexts/AuthContext'

//pages
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';

//scss
import './assets/styles/global.scss';

//função principal
function App() {

  //Return
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter >
  )
}

export default App;
