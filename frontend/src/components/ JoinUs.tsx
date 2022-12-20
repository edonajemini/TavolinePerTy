import React from 'react'
import { Link } from 'react-router-dom'

function  JoinUs() {
  return (
    <div className='JoinUs'> 
        <h2>Join Us</h2>
        <p>Join the more than 50,000 restaurants which fill seats and manage reservations with OpenTable.</p>
        <button>
              <Link to="/signup">Sign up</Link>
            </button>
    </div>
  )
}

export default  JoinUs