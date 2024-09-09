import React, { useState, useEffect } from 'react'

const Index = () => {
  // Hook : Function cua React giup em tai su dung: useState, useEffect, useMemo, ...
  // const [title, setTitle] = useState('') // Luu tru bien
  // const [body, setBody] = useState('')
  // const [result, setResult] = useState('')

  const [api, setApi] = useState([])
  const [chosen, setChosen] = useState('Tien thanh')
  const [number, setNumber] = useState(0)

  // {
  //     1 : 'data moi ',
  //     2 : 'data cuoi',
  // }

  // const inputChange = (event) => {
  //     setTitle(event.target.value)

  // }

  // const handleClick = (event) => {
  //     // fetch('https://jsonplaceholder.typicode.com/todos/1')
  //     //     .then(response => response.json())
  //     //     .then(json => {
  //     //         console.log(json)
  //     //     })
  //     fetch('https://jsonplaceholder.typicode.com/posts', {
  //         method: 'Post',
  //         body: JSON.stringify({ title, body: body })
  //     })
  //         .then(res => res.json())
  //         .then((json) => setResult(json.id))
  // }

  const callApi = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => {
        setApi(json)
        setChosen(json[0].name)
        // console.log(json[0].name)
      })
  }

  // useEffect: Chay truoc khi render (in) ra HTML
  // Va moi lan DEPENDENCY thay doi
  useEffect(() => {
    callApi()
  }, []) // dependency - Su phu thuoc

  const [text, settext] = useState('')

  const handleRemove = itemToRemove => {
    const newArr = arr.filter((_, index) => index !== itemToRemove)
    setArr(newArr)
  }

  const [arr, setArr] = useState([1, 2, 3])
  const [updateData, setUpdateData] = useState({})
  const handleUpdateInput = (e, index) => {
    setUpdateData({ ...updateData, [index]: e.target.value })
  }

  const handleEdit = index => {
    const value = updateData[index]

    const newArr = [...arr] // arr
    newArr.splice(index, 1, value)
    // newArr[index] = value;
    setArr(newArr)
  }

  useEffect(() => console.log(arr), [arr])

  return (
    <>
      <div className="p-10">
        {/* <div>Ket qua la: {result}</div>
            <input type="text" className="border" value={title} placeholder='Hay'
            onChange={inputChange}
            />
            <input type="text" className="border" value={body} placeholder='Ha'
                onChange={(e) => { callApi() }}
            />
            <div onClick={handleClick}>Gui data </div> */}
        <hr />
        <h1>
          Người bạn đang chọn: <u>{chosen}</u>
        </h1>
        <select
          name=""
          id=""
          onChange={e => {
            setChosen(e.target.value)
          }}
        >
          {api.map(data => (
            <option>{data.name}</option>
          ))}
        </select>
        <br />
        <button onClick={e => setNumber(number + 1)}>Click</button>
        <h1>{number}</h1>

        <hr />

        {arr.map((data, index) => (
          <div key={index}>
            <span className="text-red-500 bg-green-300">{data}</span>
            <button className="border ml-4 p-4 mb-4" onClick={() => handleRemove(index)}>
              Remove ({index})
            </button>
            <div>
              <input
                type="text"
                placeholder={`Gia tri moi  ${index}`}
                class="border"
                onChange={e => handleUpdateInput(e, index)}
                value={updateData[index]}
              />
              <button className="border ml-4 p-4 mb-4" onClick={() => handleEdit(index)}>
                edit ({index})
              </button>
            </div>
          </div>
        ))}

        <hr />
        <input
          type="text"
          className="border"
          value={text}
          onChange={e => {
            settext(e.target.value)
          }}
        />
        <button
          onClick={e => {
            setArr([...arr, text])
            settext('')
          }}
        >
          Them vao mang?
        </button>
      </div>
    </>
  )
}

export default Index
