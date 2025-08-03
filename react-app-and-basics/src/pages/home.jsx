import React from 'react'
import { Link } from 'react-router'
export default function Home() {
  return (
    <div>
        <h1>Home</h1>
        <Link to='/products'>Go to Products</Link>
    </div>
  )
}
