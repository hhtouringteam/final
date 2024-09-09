import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'
import './App.css'
import Content from './Content'
// const tabs = ["comments", "posts", "albums"]
// const orders = [20, 30, 25]
// const lessons = [
//     {

//         id: 1,
//         name: "huy"

//     },
//     {
//         id: 2,
//         name: "huy2"
//     },
//     {
//         id: 3,
//         name: "huy3"
//     }
// ]

const Index = () => {
  // const [counter, setCounter] = useState(() => {
  //     const total = orders.reduce((total, rew) => total + rew)
  //     return total
  // })

  // const handleIncreat = () => {
  //     setCounter(counter + 1)

  // }

  // const [info, setInfo] = useState({
  //     name: 'Huy',
  //     age: 20,
  //     address: 'HCM'
  // })
  // const handleChange = () => {
  //     setInfo({ ...info, age: info.age + 1, name: "hh" })
  // }
  // useEffect = (() => {
  //     document.title = title
  // })
  // const [title, setTitle] = useState('')
  // const [posts, setPost] = useState([])
  // const [type, setType] = useState('posts')
  // const [showGoToTop, setShowGoToTop] = useState(false)

  // useEffect(() => {
  //     fetch(`https://jsonplaceholder.typicode.com/${type}`)
  //         .then(res => res.json())
  //         .then(posts =>
  //             setPost(posts)
  //         )
  // }, [type])

  // useEffect(() => {

  //     const handleScroll = () => {
  //         if (window.scrollY >= 200) {
  //             setShowGoToTop(true)
  //         } else {
  //             setShowGoToTop(false)
  //         }

  //     }

  //     window.addEventListener("scroll", handleScroll)
  //     return () => {

  //         window.removeEventListener("scroll", handleScroll)

  //     }
  // }, [])

  // const [width, setWidth] = useState(window.innerWidth)
  // const [height, setHeight] = useState(window.innerHeight)
  // useEffect(() => {
  //     const handleResize = () => {
  //         setWidth(window.innerWidth)
  //         setHeight(window.innerHeight)
  //     }
  //     window.addEventListener('resize', handleResize)

  //     return () => {
  //         window.removeEventListener('resize', handleResize)
  //     }
  // }, []);

  // const [countdown, setCountdown] = useState(190)
  // useEffect(() => {
  //     const timeId = setInterval(() => {
  //         setCountdown(prevState => prevState - 1)
  //     }, 1000);
  //     return () => clearInterval(timeId);
  // }, [])
  // const [avatar, setAvatar] = useState()

  // useEffect(() => {

  //     return () => {
  //         avatar && URL.revokeObjectURL(avatar.preview)
  //     }

  // }, [avatar]);

  // const handlePreviewAvatar = (e) => {
  //     const file = e.target.files[0];
  //     file.preview = URL.createObjectURL(file)
  //     setAvatar(file)
  // }

  // const [lessonId, setLessonId] = useState(1)

  // useEffect(() => {
  //     const handleComment = ({ detail }) => {

  //     }
  //     window.addEventListener('lesson-1', handleComment)
  // }, [])
  const context = useContext(ThemeContext)

  return (
    <div>
      {/* <h1>{counter}</h1>
            <button onClick={handleIncreat}>Increat</button> */}

      {/* <h1>{JSON.stringify(info)}</h1>
            <button onClick={(handleChange)}>Change</button> */}

      {/* {tabs.map(tab => (
                <button
                    key={tab}
                    style={type === tab ? {
                        color: "#fff ",
                        backgroundColor: '#007bff',
                        padding: '20px',
                        margin: '20px',
                        border: '1px solid '
                    } : {}}
                    onClick={() => { setType(tab) }}
                >

                    {tab}
                </button>
            ))} */}
      {/* <input
                value={title}
                onChange={(event) => { setTitle(event.target.value) }}
            /> */}

      {/* <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        {post.title || post.name}
                    </li>
                ))}

            </ul>
            {showGoToTop && (
                <button
                    style={{
                        position: 'fixed',
                        right: 20,
                        bottom: 20
                    }}
                >
                    Back to top
                </button>
            )}*/}
      {/*    <h1>{width} {height}</h1> */}

      {/* <h1>{countdown}</h1> */}

      {/* <input
                type="file"
                onChange={handlePreviewAvatar}
            />
            {avatar && (
                <img src={avatar.preview} alt="" width='80%' />
            )} */}
      {/* 
            <ul>
                {lessons.map(lesson => (

                    <li
                        key={lesson.id}
                        style={{
                            color: lessonId === lesson.id ?
                                'red' :
                                '#333'
                        }}
                        onClick={() => setLessonId(lesson)}
                    >
                        {lesson.name}
                    </li>
                ))}
            </ul> */}

      <div style={{ padding: 10 }}>
        <button onClick={context.toggleTheme}>Toogle theme</button>

        <Content />
      </div>
    </div>
  )
}
export default Index
