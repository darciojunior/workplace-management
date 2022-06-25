import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Main from "./templates/Main";


const baseUrl = 'http://localhost:3001/employees'
const initialState = {
    employee: { name: '' },
    list: []
}

export default function Employees() {

    const [employeeState, setEmployee] = useState(initialState.employee)
    const [listState, setList] = useState(initialState.list)


    useEffect(() => {
        axios(baseUrl).then(resp => {
            setList(resp.data)
        })
    }, [])


    function clear() {
        setEmployee(initialState.employee)
    }

    function save() {
        if (employeeState.name === '') alert('Por favor preencha os dados.')
        else {
            const method = employeeState.id ? 'put' : 'post'
            const url = employeeState.id ? `${baseUrl}/${employeeState.id}` : baseUrl
            axios[method](url, employeeState)
                .then(resp => {
                    const list = getUpdatedList(resp.data)
                    setEmployee(initialState.employee)
                    setList(list)
                })
        }
    }

    function getUpdatedList(employee, add = true) {
        const list = listState.filter(emp => emp.id !== employee.id)
        if (add) list.unshift(employee)
        return list
    }

    function updateField(event) {
        const employee = { ...employeeState }
        employee[event.target.name] = event.target.value
        setEmployee(employee)
    }

    function renderForm() {
        return <div className="form">
            <label>Nome</label>
            <input type="text" name="name" value={employeeState.name} onChange={e => updateField(e)} placeholder="Digite o nome" />
            <hr />
            <button onClick={e => save(e)}>Salvar</button>
            <button onClick={e => clear(e)}>Cancelar</button>
        </div>
    }

    function load(employee) {
        setEmployee(employee)
    }

    function remove(employee) {
        axios.delete(`${baseUrl}/${employee.id}`).then(resp => {
            const list = getUpdatedList(employee, false)
            setList(list)
        })
    }

    function renderTable() {
        return <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {renderRows()}
            </tbody>
        </table>
    }

    function renderRows() {
        return listState.map(employee => {
            return (
                <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td><button onClick={() => load(employee)}>Editar</button></td>
                    <td><button onClick={() => remove(employee)}>Excluir</button></td>
                </tr>
            )
        })
    }

    return <Main>
        {renderForm()}
        {renderTable()}
    </Main>
}