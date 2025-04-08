import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { signOut } from "../features/UserSlice";

const SignOut = () => {
    const dispatch = useDispatch();
    let nav = useNavigate();

    const handleSignOut = () => {
        dispatch(signOut());
        nav('/'); // מפנה לדף הבית
    };

    return (
        <>
    
            <button className="signOut-button" onClick={handleSignOut}>
            If you are sure you want to log out click here
            </button></>
    );
};

export default SignOut;