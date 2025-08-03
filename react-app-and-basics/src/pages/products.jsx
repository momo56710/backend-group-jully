import React ,{useState,useEffect} from 'react'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { useNavigate } from 'react-router'
export default function Products() {
    const token = secureLocalStorage.getItem('token')
    const navigate = useNavigate()
   useEffect(() => {
    if (!token) {
        navigate('/login')
    }
   },[token])
    const [products,setProducts] = useState([])
    useEffect(() => {
        axios.get('http://localhost:3000/api/products',{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            console.log(res.data.products)
            setProducts(res.data.products)
        })
        .catch(err => console.log(err))
    },[])
  return (
    <div className='flex flex-wrap items-center justify-center gap-4'>
        {products.map(product => (
            <div key={product.id} className='flex flex-col items-center justify-center border-2 border-gray-300 rounded-md p-4 m-4 w-1/4'>
                <img src={`http://localhost:3000/${product.imageUrl}`} alt={product.title} className='w-20 h-20' />
                <h1>{product.title}</h1>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <p>{product.category}</p>
                <p>{product.rating}</p>
                <p>{product.stock}</p>
            </div>
        ))}
    </div>
  )
}
