export const fetchData = async (url, setData, setLoading) => {
  try {
    if (setLoading) setLoading(true)
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch data')
    const data = await response.json()
    setData(data)
    if (setLoading) setLoading(false)
  } catch (error) {
    console.error('Error fetching data:', error)
    if (setLoading) setLoading(false)
  }
}
