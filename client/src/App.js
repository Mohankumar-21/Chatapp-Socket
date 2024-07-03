import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./Pages/Register/Register";
import Mainpage from "./Pages/MainPage/MainPage";
import Login from "./Pages/Login/Login";
import ProtectedRoute from "./Component/ProtectedRoute";
import ChatPage from "./Pages/Chat/ChatPage";
import ConversationPage from "./Pages/Conversation/ConversationPage";
import ProfilePage from "./Pages/Profile/ProfilePage";
import UsersPage from "./Pages/UsersPage/UsersPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/register"
            element={
              <Mainpage>
                <RegisterPage />
              </Mainpage>
            }
          />
          <Route
            path="/login"
            element={
              <Mainpage>
                <Login />
              </Mainpage>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          >
            <Route
              path="conversation/:userId"
              element={<ConversationPage />}
            />
          </Route>

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          >
            <Route
              path="conversation/:userId"
              element={<ConversationPage />}
            />
          </Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
              <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
