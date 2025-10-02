import { Link, Route, Routes } from 'react-router-dom';
import routes from './routes';
import AuthButtons from './modules/auth/components/AuthButtons';
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App() {
    return (
        <div className="container py-3">
            <nav className="navbar navbar-expand-lg bg-body-tertiary rounded mb-3">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Ticket System</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample" aria-controls="navbarsExample" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarsExample">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item"><Link className="nav-link" to="/tickets">Tickets</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/events">Events</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/venues">Venues</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/persons">Persons</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/locations">Locations</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/coordinates">Coordinates</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
                        </ul>
                        <div className="d-flex">
                            <AuthButtons />
                        </div>
                    </div>
                </div>
            </nav>
            <Routes>
                {routes.map((r) => (
                    <Route key={r.path} path={r.path} element={r.element} />
                ))}
            </Routes>
        </div>
    );
}




