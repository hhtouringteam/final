// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom' // Import useParams để lấy slug
// import config from '../../configs/config'
// import { getCourses } from '../../services/apiServer'
// export default function Text() {
//   const { slug } = useParams() // Lấy slug từ URL
//   const [course, setCourse] = useState(null)

//   // Gọi API để lấy thông tin khóa học dựa trên slug

//   const [ass, setAss] = useState([])

//   useEffect(() => {
//     getCourses().then(ss => setAss(ss))
//   }, [])
//   const [products, setProducts] = useState(null)
//   useEffect(() => {
//     fetch('http://localhost:5000/products')
//       .then(response => response.json())
//       .then(data => setProducts(data))
//       .catch(error => console.error('Error fetching products:', error))
//   }, [])

//   return (
//     <div className="container mx-auto mt-10 p-4">
//       <h1 className="text-4xl font-bold mb-6">Course Detail</h1>

//       {/* Hiển thị chi tiết khóa học */}
//       {course ? (
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <h2>{course.name}</h2>
//           <p>{course.description}</p>
//           <img src={course.image} alt={course.name} />
//         </div>
//       ) : (
//         <p>Loading course details...</p>
//       )}
//     </div>
//   )
// }
