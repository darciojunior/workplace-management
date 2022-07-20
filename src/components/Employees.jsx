import './Employees.css'

import axios from "axios";
import { useEffect, useState } from "react";
import Main from "./templates/Main";


const baseUrl = 'http://localhost:3001/employees'
const initialState = {
    employee: { name: '', department: '', role: '', workload: '', hourlySalary: '', email: '', phone: '', hireDate: '' },
    list: []
}

export default function Employees() {

    const [employeeState, setEmployee] = useState(initialState.employee)
    const [listState, setList] = useState(initialState.list)
    const [currentPage, setCurrentPage] = useState(1)


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

    function save(event) {
        event.preventDefault();
        let form = document.querySelector('.form')
        let addBtn = document.querySelector('#addEmployee')
        form.classList.add('d-none')
        form.classList.remove('d-block')
        addBtn.classList.remove('d-none')

        const method = employeeState.id ? 'put' : 'post'
        const url = employeeState.id ? `${baseUrl}/${employeeState.id}` : baseUrl
        axios[method](url, employeeState)
            .then(resp => {
                const list = getUpdatedList(resp.data)
                setEmployee(initialState.employee)
                setList(list)
            })
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
        return <form className="form d-none" onSubmit={e => save(e)}>
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Nome</label>
                        <input type="text" name="name" className='form-control' value={employeeState.name} onChange={e => updateField(e)} placeholder="Digite o nome.." required />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Data de contratação</label>
                        <input type="date" name="hireDate" className='form-control' value={employeeState.hireDate} onChange={e => updateField(e)} placeholder="Digite a data de contratação.." required />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Departamento</label>
                        <input type="text" name="department" className='form-control' value={employeeState.department} onChange={e => updateField(e)} placeholder="Digite o departamento.." required />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Cargo</label>
                        <input type="text" name="role" className='form-control' value={employeeState.role} onChange={e => updateField(e)} placeholder="Digite o cargo.." required />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>E-mail</label>
                        <input type="email" name="email" className='form-control' value={employeeState.email} onChange={e => updateField(e)} placeholder="Digite o email.." required />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Telefone</label>
                        <input type="number" name="phone" className='form-control' value={employeeState.phone} onChange={e => updateField(e)} placeholder="Digite o telefone.." required />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Carga horária mensal</label>
                        <input type="number" name="workload" className='form-control' value={employeeState.workload} onChange={e => updateField(e)} placeholder="Digite a carga horária mensal.." required />
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group">
                        <label>Salário/hora</label>
                        <input type="number" name="hourlySalary" className='form-control' value={employeeState.hourlySalary} onChange={e => updateField(e)} placeholder="Digite o salário/hora.." required />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 d-flex justify-content-end">
                    <input type="submit" className="btn btn-primary" value="Salvar" />
                    {/* <button type="submit" className='btn btn-primary' onClick={e => save(e)}>Salvar</button> */}
                    <button type='button' className='btn btn-secondary ml-2' onClick={e => clear(e)}>Cancelar</button>
                </div>
            </div>
            <hr />
        </form>
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
                    <th>Data de contratação</th>
                    <th>Departamento</th>
                    <th>Cargo</th>
                    <th>Contato</th>
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

        return listState.slice(currentPage === 1 ? 0 : (currentPage * 10) - 10, currentPage * 10).map(employee => {
            return (
                <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{`${employee.hireDate.slice(8)}/${employee.hireDate.slice(5, 7)}/${employee.hireDate.slice(0, 4)}`}</td>
                    <td>{employee.department}</td>
                    <td>{employee.role}</td>
                    <td>{employee.email}<br />{`(${employee.phone.slice(0, 2)}) ${employee.phone.slice(2, 7)}-${employee.phone.slice(7, 11)}`}</td>
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

    function pagination() {
        let pages = Math.ceil(listState.length / 10)

        return <div className="pages">
            <button className="btn btn-primary previousPage" onClick={() => changePage("decrease")} disabled={(pages > 1) ? false : true}>Previous</button>
            {renderPageButtons(pages)}
            <button className="btn btn-primary nextPage" onClick={() => changePage("increase")} disabled={(pages > 1) ? false : true}>Next</button>
        </div>
    }

    function renderPageButtons(pages) {
        let numOfPages = [];
        if (pages > 1) {
            for (let i = 1; i <= pages; i++) {
                numOfPages.push({ page: i })
            }
            return numOfPages.map(numOfPage => <button key={numOfPage.page} className={(currentPage === numOfPage.page) ? 'btn active' : 'btn'} onClick={() => changePage(numOfPage.page)}>{numOfPage.page}</button>)
        }
    }

    function changePage(page) {
        switch (page) {
            case 'decrease':
                if (currentPage === 1) break;
                setCurrentPage(currentPage - 1)
                break;
            case 'increase':
                if (currentPage < Math.ceil(listState.length / 10)) setCurrentPage(currentPage + 1);
                break;
            default:
                setCurrentPage(page)
        }
    }

    return <Main>
        <button id="addEmployee" className="btn btn-primary" onClick={() => addEmployee()}>Adicionar funcionário</button>
        {renderForm()}
        {renderTable()}
        {pagination()}
    </Main>
}