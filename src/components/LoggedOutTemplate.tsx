import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMediaQuery } from 'react-responsive';
import {
  HomeIcon,
  ViewListIcon,
  UserAddIcon,
  LoginIcon
} from '@heroicons/react/outline';
import HBChessLogo from '../assets/hblogo.png';

const LoggedOutTemplate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
  const sidebarRef = useRef(document.createElement('div'));
  const mobileSidebarRef = useRef(document.createElement('div'));
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [mobileSidebarWidth, setMobileSidebarWidth] = useState(0);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user]);

  useEffect(() => {
    setSidebarWidth(sidebarRef.current.clientWidth);
    setMobileSidebarWidth(mobileSidebarRef.current.clientHeight);
  }, [sidebarRef.current, mobileSidebarRef.current]);

  const closeSidebar = () => {
    if (sidebarRef !== null) {
      sidebarRef.current.classList.add('-translate-x-full');
    }
  };

  return (
    <div className="flex relative flex-col h-screen md:flex-row">
      <div
        ref={mobileSidebarRef}
        className="flex justify-between text-green-100 bg-green-800 md:hidden"
      >
        <a href="#" className="block p-4 font-bold text-white">
          HBChess
        </a>

        <button
          className="p-4 focus:bg-green-700 focus:outline-none"
          onClick={() => {
            if (sidebarRef !== null) {
              sidebarRef.current.classList.toggle('-translate-x-full');
            }
          }}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div
        ref={sidebarRef}
        className="absolute inset-y-0 left-0 z-20 py-7 px-2 space-y-6 w-64 text-gray-100 bg-gray-800 transition duration-200 ease-in-out -translate-x-full md:relative md:translate-x-0"
      >
        <Link
          to="/"
          className="flex items-center px-4 space-x-2 text-white"
          onClick={closeSidebar}
        >
          <img className="w-auto h-16" src={HBChessLogo} alt="HBChess" />
          <span className="text-2xl font-extrabold">HBChess</span>
        </Link>

        <nav>
          <Link
            to="/"
            className="flex flex-row py-2.5 px-4 hover:text-white hover:bg-green-700 rounded transition duration-200"
            onClick={closeSidebar}
          >
            <span className="flex items-center pr-2">
              <HomeIcon
                className="w-5 h-5 text-gray-50 group-hover:text-nyanza"
                aria-hidden="true"
              />
            </span>
            Home
          </Link>
          <Link
            to="/leaderboard"
            className="flex flex-row py-2.5 px-4 hover:text-white hover:bg-green-700 rounded transition duration-200"
            onClick={closeSidebar}
          >
            <span className="flex items-center pr-2">
              <ViewListIcon
                className="w-5 h-5 text-gray-50 group-hover:text-nyanza"
                aria-hidden="true"
              />
            </span>
            Leaderboard
          </Link>
          <Link
            to="/auth/signup"
            className="flex flex-row py-2.5 px-4 hover:text-white hover:bg-green-700 rounded transition duration-200"
            onClick={closeSidebar}
          >
            <span className="flex items-center pr-2">
              <UserAddIcon
                className="w-5 h-5 text-gray-50 group-hover:text-nyanza"
                aria-hidden="true"
              />
            </span>
            Sign Up
          </Link>
          <Link
            to="/auth/login"
            className="flex flex-row py-2.5 px-4 hover:text-white hover:bg-green-700 rounded transition duration-200"
            onClick={closeSidebar}
          >
            <span className="flex items-center pr-2">
              <LoginIcon
                className="w-5 h-5 text-gray-50 group-hover:text-nyanza"
                aria-hidden="true"
              />
            </span>
            Log In
          </Link>
        </nav>
      </div>

      <div className="flex-1 w-full h-full">
        <div className="h-full bg-center bg-hero-pattern blur-sm" />
        {isDesktop ? (
          <div
            className="absolute top-0 right-0 h-full"
            style={{
              width: `calc(100% - ${sidebarWidth}px)`
            }}
          >
            <Outlet />
          </div>
        ) : (
          <div
            className="absolute right-0 bottom-0 w-full"
            style={{
              height: `calc(100% - ${mobileSidebarWidth}px)`
            }}
          >
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoggedOutTemplate;
