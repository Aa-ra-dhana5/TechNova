// // src/route/PrivateRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../componants/AuthContext";

// export const PrivateRoute = ({ children }) => {
//   const { isLoggedIn } = useAuth();

//   if (isLoggedIn === false) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

import { Navigate } from "react-router-dom";
import { useAuth } from "../componants/AuthContext";

export const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a spinner
  }
  // console.log(isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};
