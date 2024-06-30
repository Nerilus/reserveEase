import React from 'react'
import { Link } from 'react-router-dom'
import './navBar.css'

const NavBar = () => {
  return (
    <nav>
    <ul>
        <li>
            <Link to="/">Acceuil</Link>
        </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </ul>
  </nav>
  )
}

export default NavBar