import './Main.css'

export default function Main(props) {
    return <main className='content'>
        <div>{props.children}</div>
    </main>

}