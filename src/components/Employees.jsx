import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Main from "./templates/Main";


const baseUrl = 'http://localhost:3001/employees'
const initialState = {
    employee: { name: '', role: '', workload: '', hourlySalary: '' },
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
        let form = document.querySelector('.form')
        let addBtn = document.querySelector('#addEmployee')
        form.classList.add('d-none')
        form.classList.remove('d-block')        
        addBtn.classList.remove('d-none') 
    }

    function save() {
        let form = document.querySelector('.form')
        let addBtn = document.querySelector('#addEmployee')
        form.classList.add('d-none')
        form.classList.remove('d-block')        
        addBtn.classList.remove('d-none') 

        if (employeeState.name === '' || employeeState.role === '' || employeeState.workload === '' || employeeState.hourlySalary === '') alert('Por favor preencha os dados.')
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
        return <div className="form d-none">
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Nome</label>
                        <input type="text" name="name" className='form-control' value={employeeState.name} onChange={e => updateField(e)} placeholder="Digite o nome.." />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Cargo</label>
                        <input type="text" name="role" className='form-control' value={employeeState.role} onChange={e => updateField(e)} placeholder="Digite o cargo.." />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Carga horária mensal</label>
                        <input type="text" name="workload" className='form-control' value={employeeState.workload} onChange={e => updateField(e)} placeholder="Digite a carga horária mensal.." />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Salário/hora</label>
                        <input type="text" name="hourlySalary" className='form-control' value={employeeState.hourlySalary} onChange={e => updateField(e)} placeholder="Digite o salário/hora.." />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 d-flex justify-content-end">
                    <button className='btn btn-primary' onClick={e => save(e)}>Salvar</button>
                    <button className='btn btn-secondary ml-2' onClick={e => clear(e)}>Cancelar</button>
                </div>
            </div>
            <hr />
        </div>
    }

    function load(employee) {
        setEmployee(employee)
        addEmployee()
    }

    function remove(employee) {
        axios.delete(`${baseUrl}/${employee.id}`).then(resp => {
            const list = getUpdatedList(employee, false)
            setList(list)
        })
    }

    function renderTable() {
        return <table className='table mt-4 table-striped table-bordered'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Carga horária mensal</th>
                    <th>Salário/hora</th>
                    <th>Salário</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {renderRows()}
            </tbody>
        </table>
    }

    function renderRows() {
        let realBRL = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return listState.map(employee => {
            return (
                <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.role}</td>
                    <td>{employee.workload}</td>
                    <td>{realBRL.format(employee.hourlySalary)}</td>
                    <td>{realBRL.format(parseFloat(employee.workload) * parseFloat(employee.hourlySalary))}</td>
                    <td className='actionColumn'>
                        <button className='btn btn-warning' onClick={() => load(employee)}>Editar</button>
                        <button className='btn btn-danger ml-2' onClick={() => remove(employee)}>Excluir</button>
                    </td>
                </tr>
            )
        })
    }

    function addEmployee() {
        let form = document.querySelector('.form')
        let addBtn = document.querySelector('#addEmployee')
        form.classList.add('d-block')
        form.classList.remove('d-none')
        addBtn.classList.add('d-none')
    }

    return <Main>
        <button id="addEmployee" className="btn" onClick={() => addEmployee()}>Adicionar funcionário</button>
        {renderForm()}
        {renderTable()}
    </Main>
}