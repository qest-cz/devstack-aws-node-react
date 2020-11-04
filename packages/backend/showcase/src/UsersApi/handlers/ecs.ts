import app from '../express-app'

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
