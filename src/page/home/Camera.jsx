import React from 'react'
import { useEffect, useState } from 'react'

export default function Camera() {
  const gioitinhApi = [
    {
      value: 'nam',
      src: 'https://png.pngtree.com/png-clipart/20190520/original/pngtree-male-worker-icon-graphic-png-image_3668949.jpg',
    },
    {
      value: 'nu',
      src: 'https://png.pngtree.com/png-vector/20190118/ourlarge/pngtree-vector-female-student-icon-png-image_326761.jpg',
    },
    { value: 'khac', src: 'https://cdn-icons-png.flaticon.com/512/6096/6096534.png' },
  ]
  const tinhThanh = [
    {
      value: 'HCM',
      label: 'Thanh Pho HCM',
    },
    { value: 'DN', label: 'Dong Nai' },
    { value: 'DNG', label: 'Da nang' },
    { value: 'D', label: 'Dong' },
  ]

  const [fileAvatar, setFileAvatar] = useState(null)
  const [avatar, setAvatar] = useState('')
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [birthDate, setBirthDate] = useState('')
  const [colors, setColors] = useState('')
  const url = 'https://jsonplaceholder.typicode.com/users'
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState(tinhThanh[0].value)
  const [editUserId, setEditUserId] = useState() // ID người dùng đang được chỉnh sửa
  const [gioitinh, setGioitinh] = useState('')

  // function getCameraApi(callback) {
  //     fetch(cameraApi)
  //         .then(function (response) {
  //             return response.json()
  //         })
  //         .then(callback)
  // }

  // const renderCameraApi = (fetchedUsers) => {
  //     setUsers(fetchedUsers);
  // }

  useEffect(() => {
    const fetchApi = async () => {
      await fetch(url).then(async res => setUsers(await res.json()))
    }
    fetchApi()
    // getCameraApi((fetchedUsers) => {
    //     renderCameraApi(fetchedUsers);
    // });
    // console.log("API called. UI được cập nhật một lần.");
  }, [])

  useEffect(() => {
    console.log('UI được cập nhật lại.')
    console.log(users)
  }, [users])
  const handleCreate = event => {
    event.preventDefault()

    // Kiểm tra tuổi
    const selectedDate = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - selectedDate.getFullYear()
    const monthDifference = today.getMonth() - selectedDate.getMonth()
    const dayDifference = today.getDate() - selectedDate.getDate()

    if (age < 18 || (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
      alert('Bạn phải đủ 18 tuổi trở lên để tiếp tục.')
      setBirthDate('') // Reset lại birthDate nếu không đủ tuổi
      return // Dừng lại, không thực hiện tiếp các thao tác dưới đây
    }

    // // Kiểm tra avatar
    // if (!avatar) {
    //     alert("Bạn chưa chọn avatar!");
    //     return;
    // }

    const newUser = {
      // id: users.length + 1,
      avatar: avatar,
      age: birthDate,
      name: name,
      email: email,
      address: { city: address },
      gioitinh: gioitinh,
      color: colors,
    }

    if (editUserId) {
      fetch(`${url}/${editUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
        .then(response => response.json())
        .then(data => {
          setUsers(users.map(user => (user.id === editUserId ? data : user)))
          setEditUserId(null)
        })
        .catch(error => {
          console.error('Error:', error)
        })
    } else {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
        .then(response => response.json())
        .then(data => {
          setUsers([...users, data])
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }

    setName('')
    setEmail('')
    setAddress('')
    setBirthDate('')
    setAvatar('')
    setColors('')
  }

  const handleDelete = id => {
    fetch(`${url}/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setUsers(users.filter(user => user.id !== id))
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const handleEdit = user => {
    setName(user.name)
    setEmail(user.email)
    setAddress(user.address.city)
    setEditUserId(user.id)
  }

  const handleAvatar = e => {
    const file = e.target.files[0]
    setFileAvatar(file)
    if (file) {
      const reader = new FileReader()

      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleClearAvatar = () => {
    setAvatar('')
    document.getElementById('avatarInput').value = null
  }

  const handleDateChange = event => {
    setBirthDate(event.target.value)
  }
  const handlecolorChange = event => {
    setColors(event.target.value)
  }
  useEffect(() => console.log(gioitinh), [gioitinh])

  return (
    <div>
      {/* handleCreate() */}
      <form onSubmit={handleCreate} className="flex flex-col gap-2 w-1/2">
        {/* 
                File: Preview hình (coi trước khi create)
                Chọn hình bằng button dấu cộng chứ ko phải choose file mặc định

                Date: Chọn ngày sinh -> Ko được dưới 18 tuổi -> Alert nếu ko đủ

                Color: Chọn màu yêu thích -> hiển thị màu dưới bảng
                */}
        <label htmlFor="" className="text-red-500">
          Chon avatar
        </label>

        <input id="avatarInput" type="file" className="hidden" onChange={handleAvatar} />

        <div
          onClick={() => document.getElementById('avatarInput').click()}
          className="inline-block p-2 bg-blue-500 text-white rounded-full cursor-pointer text-center w-10 h-10"
        >
          <i className="fas fa-plus"></i>
        </div>
        {avatar && (
          <div>
            <img src={avatar} alt="Avatar Preview" className="w-100px h-100px" onClick={() => setAvatarOpen(true)} />
            <button onClick={handleClearAvatar} className="border px-2 py-1 bg-blue-300">
              Hủy chọn
            </button>
          </div>
        )}
        {avatarOpen && (
          <div
            className="fixed inset-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50"
            onClick={() => setAvatarOpen(false)} // Đóng modal khi click ra ngoài ảnh
          >
            <img src={avatar} alt="Avatar Large" className="w-90% h-90%" />
          </div>
        )}
        <input type="date" value={birthDate} onChange={handleDateChange} className="border p-2 rounded" />
        <input type="color" value={colors} onChange={handlecolorChange} />

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2"
        />
        {/* <input
                    type="text"
                    placeholder='Address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                 
                /> */}

        <select name="tinhThanh" id="tinhThanh" onChange={e => setAddress(e.target.value)} className="border p-2">
          {tinhThanh.map(tinh => (
            <option value={tinh.value}>{tinh.label}</option>
          ))}
        </select>
        {/* <select name="cars" id="cars" onChange={(e) => setAddress(e.target.value)} className='border p-2'>
                    <option value="Tp hcm">TPHCM</option>
                    <option value="Ha Noi">Hà Nội</option>
                    <option value="Da nang">Đà Nẵng</option>
                    <option value="audi">ko biet</option>
                </select> */}

        <div className="flex gap-2">
          {gioitinhApi.map(gender => (
            <label htmlFor={gender.value} className={`${gioitinh === gender.value && `border border-red-500`}`}>
              <img alt="" className="size-10" src={gender.src} />
              <input
                name="gender"
                type="radio"
                id={gender.value}
                value={gender.value}
                hidden
                onChange={e => setGioitinh(e.target.value)}
              />
            </label>
          ))}

          {/* <label htmlFor="nam" className={`${gioitinh === 'nam' && `border border-red-500`}`}>
                        <img alt="" className='size-10' src="https://png.pngtree.com/png-clipart/20190520/original/pngtree-male-worker-icon-graphic-png-image_3668949.jpg" />
                        <input name="gender" type="radio" id="nam" value='nam' hidden onChange={(e) => setGioitinh(e.target.value)} />
                    </label>

                    <label htmlFor="nu" className={`${gioitinh === 'nu' && `border border-red-500`}`}>
                        <img alt="" className='size-10' src="https://png.pngtree.com/png-vector/20190118/ourlarge/pngtree-vector-female-student-icon-png-image_326761.jpg" />
                        <input name="gender" type="radio" id="nu" value='nu' hidden onChange={(e) => setGioitinh(e.target.value)} />
                    </label>

                    <label htmlFor="khac" className={`${gioitinh === "khac" && `border border-red-500`}`}>
                        <img alt="" className='size-10' src="https://cdn-icons-png.flaticon.com/512/6096/6096534.png" />
                        <input type="radio" name='gender' id='khac' value="khac" hidden onChange={(e) => setGioitinh(e.target.value)} />
                    </label> */}
        </div>

        <button class="border px-2 py-1 bg-green-300">{editUserId ? 'Edit' : 'Create +'}</button>
      </form>

      <table className="mt-10">
        <tr className="border-black border-2 [&>td]:px-4">
          <th>ID</th>
          <th>Avatar</th>
          <th>Name</th>
          <th>Email</th>
          <th>Address</th>
          <th>Gioi Tinh</th>
          <th>Color</th>
          <th>Action</th>
        </tr>
        <tbody>
          {users.map((user, index) => {
            let gender

            if (user.gioitinh) {
              gender = gioitinhApi.find(gt => gt.value === user.gioitinh)
            }

            return (
              <tr key={index} className="border-black border-2 [&>td]:px-4">
                <td>{user.id}</td>
                <td>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      style={{ width: '50px', height: '50px' }}
                      onError={e => {
                        e.target.onerror = null
                      }}
                    />
                  ) : (
                    ''
                  )}
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address.city}</td>
                <td>{gender ? <img alt="" src={gender.src} className="size-10" /> : ''}</td>
                {/* khac */}
                {/* gioiTinhApi -> [] */}
                {/* Check neu gioiTInhApi[0].value ===  'khac' -> src*/}
                <td>
                  {user.color ? (
                    <div
                      style={{ backgroundColor: user.color, width: '30px', height: '30px', borderRadius: '50%' }}
                    ></div>
                  ) : (
                    ''
                  )}

                  {/* <div
                                        style={{
                                            backgroundColor: user.color,
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                        }}
                                    ></div> */}
                </td>

                <td>
                  <button class="border px-2 py-1 bg-blue-300" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button class="border px-2 py-1 bg-red-300" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
