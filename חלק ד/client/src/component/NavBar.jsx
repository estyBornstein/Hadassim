import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import '../sass/navBar.scss'; 

function NavBar() {
    const currentUser = useSelector(st => st.user.currentUser);
    return (
        <nav className="navbar-container">
            <div className="navbar-links">
                {!currentUser && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signUp">Sign Up</Link>
                    </>
                )}
                {currentUser && (
                    <>
                        <Link to="/signOut">Sign Out</Link>
                    </>
                )}
                {currentUser?.role === 'ADMIN' && (
                    <>
                        <Link to="/orders">History Orders</Link>
                        <Link to="/suppliers">Suppliers</Link>
                        <h1 className="navbar-greeting">You are the admin</h1>
                    </>
                )}

                {currentUser?.role === 'VENDOR' && (
                    <>
                        <Link to="/orders">History Orders</Link>
                        <h2 className="navbar-message">
                            {`Hello to the company representative ${currentUser.companyName}, your phone is ${currentUser.phone}`}
                        </h2>
                    </>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
