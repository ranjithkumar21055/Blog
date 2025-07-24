import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice'
import Footer from './components/Footer/Footer'
import  Header  from './components/Header/Header'
import "./App.css";
import { Navigate, Outlet } from "react-router-dom";

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
      
    })
    .finally(() => {
      setLoading(false)
    })
  },[])

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-900 text-sky-100">
      <div className="w-full flex flex-col justify-between min-h-screen">
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
