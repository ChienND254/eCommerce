import app from './src/index'
const server = app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`))
    // notify.ping('')
})