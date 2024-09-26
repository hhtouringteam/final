// // import React, { useState } from 'react';
// // import { toast } from 'react-toastify';

// // const AddCategoryForm = () => {
// //   const [categoryName, setCategoryName] = useState('');
// //   const [description, setDescription] = useState('');

// //   const handleAddCategory = async () => {
// //     // Kiểm tra xem tên danh mục đã được nhập chưa
// //     if (!categoryName) {
// //       toast.error('Tên danh mục là bắt buộc!');
// //       return;
// //     }

// //     // Chuẩn bị dữ liệu danh mục để gửi lên server
// //     const categoryData = {
// //       name: categoryName,
// //       description: description , // Trường không bắt buộc
// //     };

// //     try {
// //       // Gửi yêu cầu POST tới server để thêm danh mục
// //       const response = await fetch('http://localhost:5000/api/admin/categories/add', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(categoryData),
// //       });

// //       const data = await response.json();
// //       if (response.ok) {
// //         // Lưu danh mục vào localStorage để có thể sử dụng lại
// //         localStorage.setItem('selectedCategory', JSON.stringify(data.category));

// //         // Reset lại các trường sau khi thêm thành công
// //         setCategoryName('');
// //         setDescription('');
// //         toast.success('Thêm danh mục thành công!');
// //       } else {
// //         toast.error('Có lỗi xảy ra khi thêm danh mục!');
// //       }
// //     } catch (error) {
// //       toast.error('Không thể kết nối với server!');
// //       console.error('Lỗi khi thêm danh mục:', error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <input
// //         type="text"
// //         placeholder="Tên danh mục"
// //         value={categoryName}
// //         onChange={(e) => setCategoryName(e.target.value)}
// //         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
// //       />
// //       <textarea
// //         placeholder="Mô tả"
// //         value={description}
// //         onChange={(e) => setDescription(e.target.value)}
// //         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
// //       />
// //       <button onClick={handleAddCategory} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
// //         Thêm Danh Mục
// //       </button>
// //     </div>
// //   );
// // };

// // export default AddCategoryForm;
// // src/components/forms/AddCategoryForm.js
// // AddCategoryForm.js
// import React, { useState, useContext } from 'react'
// import { toast } from 'react-toastify'
// import { EntitiesContext } from '../../context/EntitiesContext'

// const AddCategoryForm = () => {
//   const [categoryName, setCategoryName] = useState('')
//   const { addCategory } = useContext(EntitiesContext)

//   const handleAddCategory = async e => {
//     e.preventDefault()

//     if (!categoryName) {
//       toast.error('Tên danh mục là bắt buộc!')
//       return
//     }

//     const newCategory = { name: categoryName }

//     try {
//       const response = await fetch('http://localhost:5000/api/admin/categories/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newCategory),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         addCategory(data.category)
//         setCategoryName('')
//         toast.success('Thêm danh mục thành công!')
//       } else {
//         toast.error('Có lỗi xảy ra khi thêm danh mục!')
//       }
//     } catch (error) {
//       toast.error('Không thể kết nối với server!')
//     }
//   }

//   return (
//     <form onSubmit={handleAddCategory} className="bg-gray-800 p-4 rounded">
//       <h2 className="text-xl mb-4">Thêm Danh Mục</h2>
//       <input
//         type="text"
//         placeholder="Tên danh mục"
//         value={categoryName}
//         onChange={e => setCategoryName(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//         required
//       />
//       <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
//         Thêm Danh Mục
//       </button>
//     </form>
//   )
// }

// export default AddCategoryForm

// src/components/forms/AddCategoryForm.js
// src/components/forms/AddCategoryForm.js
// src/components/forms/AddVehicleForm.js
// src/components/forms/AddCategoryForm.js
import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { EntitiesContext } from '../../context/EntitiesContext';

const AddCategoryForm = () => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');

  const { setCategories } = useContext(EntitiesContext);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      toast.error('Tên danh mục là bắt buộc!');
      return;
    }

    const categoryData = {
      name: categoryName,
      description,
    };

    try {
      const response = await fetch('http://localhost:5000/api/admin/categories/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Thêm danh mục không thành công!');
      }

      const data = await response.json();
      console.log("Added category:", data.category);
      setCategories(prevCategories => [...prevCategories, data.category]);

      // Reset form
      setCategoryName('');
      setDescription('');

      toast.success('Thêm danh mục thành công!');
    } catch (error) {
      toast.error(error.message || 'Lỗi khi thêm danh mục!');
      console.error('Error adding category:', error);
    }
  };

  return (
    <form onSubmit={handleAddCategory} className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl mb-4">Thêm Danh Mục</h2>
      <input
        type="text"
        placeholder="Tên danh mục"
        value={categoryName}
        onChange={e => setCategoryName(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
        required
      />
      <textarea
        placeholder="Mô tả"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
        Thêm Danh Mục
      </button>
    </form>
  );
};

export default AddCategoryForm;
