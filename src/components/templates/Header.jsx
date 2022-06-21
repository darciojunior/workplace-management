import './Header.css'

import { Link } from 'react-router-dom'

export default function Header() {
    return <header className='header'>
        <div className="nav-menu">
            <Link to={'/employees'} className='nav-btn'>Funcionários</Link>
        </div>
    </header>
}