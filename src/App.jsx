import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice'
import Footer from './components/Footer/Footer'
import  Header  from './components/Header/Header'
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData){
        dispatch(login(userData))
      } else {
        console.log('Logged out');
        dispatch(logout())
      }
    })
    .catch((error) => {
      console.error('User not found', error);
    })
    .finally(() => {
      setLoading(false)
    })
  },[])

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-900 text-sky-100">
      <div className="w-full block">
        <Header/>
        <main>
          Todo 
          <Outlet/>
        </main>
        <Footer/>
      </div>
    </div>
  ) : null;
}

export default App;
