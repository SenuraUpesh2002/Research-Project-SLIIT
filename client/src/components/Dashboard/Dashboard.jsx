import Home from './Home'
import Header from './header'
import Sidebar from './sidebar'
import './App.css'




function Dashboard (){
    return(
        <div>
            <div className='grid-container'>
                <Header />
                <Sidebar />
                <Home />
                
            </div>

        </div>
    )
}
export default Dashboard;