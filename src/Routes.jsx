import { Routes, Route } from 'react-router-dom'

import LandingPage from './components/LandingPage'
import Employees from './components/Employees'

export default function RoutesPath() {
    return <Routes>
        <Route exact path='/' element={<LandingPage />} />
        <Route exact path='/employees' element={<Employees />} />
    </Routes>
}