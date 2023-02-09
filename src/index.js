import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App/App';
import SignIn from './SignIn/signin';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import ErrorPage from './ErrorPage/errorPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { store } from "./_store"
import { Provider } from 'react-redux';
import Chat from './Chat/Chat';
import { PrivateRoute } from './_components/PrivateRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route path="login" element={<SignIn defaultIsLogin={true} />} />
      <Route path="signup" element={<SignIn defaultIsLogin={false} />} />
      <Route path="chat" element={<PrivateRoute  children={<Chat />} />} />
    </Route>
  )
);

const root = createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="691360415248-6gf1jba8hm1j8ba0hhmnccns5p57viha.apps.googleusercontent.com">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
                                                             