import app from './src/index'
const PORT = process.env.PORT || 3055
const server = app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}!`);
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`))
    // notify.ping('')
})