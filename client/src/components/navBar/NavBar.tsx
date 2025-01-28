import React from 'react'
import { Link } from 'react-router-dom'
import './navBar.css'

const NavBar = () => {
  return (
    <nav>
    <ul>
        <li>
            <Link to="/">Liste</Link>
        </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/create">Ajouter</Link>
      </li>
    </ul>
  </nav>
  )
}

export default NavBar