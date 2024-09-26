export const get = table => {
  fetch(`localhost:5000/${table}`)
    .then(res => res.json())
    .then(json => json)
}
export const getOne = (table, id) => {
  fetch(`localhost:5000/${table}/${id}`)
    .then(res => res.json())
    .then(json => json)
}

export const post = (table, data) => {
  fetch(`localhost:5000/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(json => json)
}

post('category', { name: 'Honda' })
