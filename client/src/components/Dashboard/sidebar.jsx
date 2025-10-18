import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsSpeedometer2 }
 from 'react-icons/bs'
 


function sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
    
                <mpma className='icon_header'/> <h6>FUELWATCH</h6>
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="/sensor">
                    <BsSpeedometer2 className='icon' /> Live Operations
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="forecasting">
                    <BsFillGrid3X3GapFill className='icon'/> Forecasting
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="/Suppliers">
                    <BsPeopleFill className='icon'/> Vehicles
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="/Info">
                    <BsListCheck className='icon'/> Test
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsMenuButtonWideFill className='icon'/> Alerts
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsFillGearFill className='icon'/> Profile
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default sidebar