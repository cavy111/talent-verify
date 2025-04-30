import React, {useContext} from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role=[] }) => {
    const {currentUser, loading} = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!currentUser){
        return <Navigate to="/login" />;
    }

    if (role.length > 0 && !role.includes(currentUser.user_type)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
}

export default PrivateRoute;