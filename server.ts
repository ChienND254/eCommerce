import app from './src/app'
import config from './src/configs/mongodb.config'

const PORT = config.app.port
const server = app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}!`);
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`))
    // notify.ping('')
})