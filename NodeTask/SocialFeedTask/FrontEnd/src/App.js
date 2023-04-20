import './App.css';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Navbar from './Components/Navbar';
import Feed from './Components/Feed';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import UploadFeed from './Components/UploadFeed';
import Edit from './Components/Edit';

function App() {
  // let path = useLocation
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route exact path="*" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/sign-up" element={<SignUp />}/>
        <Route path="/feed" element={<Feed />} />
        <Route path="/upload" element={<UploadFeed />}/>
        <Route path="/edit-profile" element={<Edit />}/>
      </Routes>
    </Router>
  );
}

export default App;
