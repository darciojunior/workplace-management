import './LandingPage.css'

import axios from "axios";
import { useEffect, useState } from 'react'
import Main from './templates/Main'

const baseUrl = 'http://localhost:3001/employees'

export default function LandingPage() {

const [list, setList] = useState([]);

    useEffect(() => {
        axios(baseUrl).then(resp => {
            setList(resp.data)
        })
    }, [])

    return <Main><p>Bem vindo à página inicial do gerenciamento do workplace</p>
    <div>Dashboard: Você possui {list.length} funcionários cadastrados.</div></Main>
}