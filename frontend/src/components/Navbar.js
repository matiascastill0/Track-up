import { Link } from 'react-router-dom';

export default function navbar() {
    return (<nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
        <h1 className="page-header text-center">Track-Up</h1>
            <span className="navbar-toggler-icon"></span>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto"> {/* ml-auto will align the nav items to the right */}
                    <li className="nav-item active">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">About</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">Register</Link>
                    </li>
                    {/* Puedes agregar más elementos <li> para otros enlaces según sea necesario */}
                </ul>
            </div>
        </div>
    </nav>)
}