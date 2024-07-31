const { log } = require('console');
const mysql = require('mysql2')
const os = require('os');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'chien123',
    database: 'shopDev',
    port: '8811'
})
log(os.cpus().length)
// const batchSize = 100000;
// const totaLSize = 1_000_000

// let currentId = 1;

// const insertBatch =  async () => {
//     const values = []
//     for (let i = 0; i < batchSize && currentId <= totaLSize; i++) {
//         const name = `name-${currentId}`
//         const age = currentId
//         const address = `address-${currentId}`
//         values.push([name,age,address])
//         currentId++
//     }

//     if (!values.length) {
//         pool.end(err => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log('connect poll');
//             }
//         })
//         return
//     }
//     const sql = `INSERT INTO test_table (name, age, address) VALUES ?`

//     pool.query(sql, [values], async function(err, results) {
//         if (err) throw err

//         console.log(`Insert ${results.affectedRows} records`);
//         await insertBatch()
//     })
// }

// insertBatch().catch(console.error)