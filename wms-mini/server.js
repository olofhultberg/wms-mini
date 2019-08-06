require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
//Auth
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const saltRounds = 10;


const sql = require('mssql');

 //config db
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME
}

const app = express();
app.set('appSecret', process.env.APP_SECRET)

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'x-access-token');
    next();
}



app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// --------------------------
// --- UNPROTECTED ROUTES ---
// --------------------------

app.get('/', function(req,res){
    res.send("Warehouse management system (mini) - Grafokett AB v1.0");
    console.log(req.headers);
});

// ------- Authentication --------

app.post('/register', multipartMiddleware, function(req, res){
    // check that we have all the info we need
    console.log(req.headers)
    console.log(req.body.name)
    console.log(req.body.email)
    console.log(req.body.department)
    console.log(req.body.password)
    //res.status(200).send("It's on..")
    if(!req.body.name || !req.body.email || !req.body.department || !req.body.password ){
        return res.json({
            'status': false,
            'message':  'All fields are required'
        })
    }

    console.log(`All good going on with registration for: ${req.body.name}`)
    //register user now that we know that all is ok
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        console.log("Hashing done")
        //create a pool to handle the connection
    new sql.ConnectionPool(config).connect().then(pool => {
            let insertSql = `INSERT INTO users(name,email,department,password) VALUES('${
            req.body.name}','${req.body.email}','${req.body.department}','${hash}'); SELECT SCOPE_IDENTITY() AS LastId;`;
            return pool.request().query(insertSql)
            }).then(result => {
                let rows = result.recordset
                let LastId = rows[0].LastId;
                        //create a user object        
                        let user = {
                            id: LastId,
                            name: req.body.name,
                            email: req.body.email,
                            department: req.body.department
                        }
                        console.log(user)
                        delete req.body.password
                        //create payload for jwt
                        const payload = {
                            user: user
                        }
                        console.log("Create payload done")
                        //create token
                        let token = jwt.sign(payload, app.get('appSecret'), {
                            expiresIn: "24h" //set expire to 24 hours
                        });
                        console.log("Create token done")
                        res.setHeader('Access-Control-Allow-Origin', "*")
                        res.status(200).json({
                            user: user,
                            token: token
                        });
                    sql.close();
                    }).catch(err => {
                    res.status(500).send({message: `${err}`})
                    sql.close();
                   })
       
    })
})

app.post('/login', multipartMiddleware, function(req, res) {
    console.log("Login..", req.user)
    new sql.ConnectionPool(config).connect().then(pool => {
        let selectSql = `SELECT * from users where email='${req.body.email}'`
        return pool.request().query(selectSql)
    }).then(result =>{
        let rows = result.recordset;
        if (rows.length == 0){
            return res.json({
                status: false,
                message: "Sorry, wrong email"
            });
        }
        let user = rows[0];
        console.log(`Logged in.. ${user}`)
        let authenticated = bcrypt.compareSync(req.body.password, user.password);
        delete user.password;
        if (authenticated) {
            const payload = {
                user: user
            };
    
            let token = jwt.sign(payload, app.get('appSecret'), {
                expiresIn: '24h' //
            })
          
        return res.json({
            status: true,
            token: token,
            payload: payload
            });
        }
        return res.json({
          status: false,
          message: "Wrong Password, please retry"
        });
    })    
})

app.use(function(req, res, next) {
    //check header
    //console.log(req.headers["x-access-token"])
    let token = req.body.token || req.query.token || req.headers["x-access-token"];
        console.log('Token: ', token)
    //decode token
    if (token) {
        let decoded = jwt.verify(token, app.get('appSecret'))
       
        if(decoded){
            //if everything is ok, save to request to use in other routes
            req.decoded = decoded;
            next();
        } else {
            return res.json({
                status: false,
                message: "Failed to authenticate token."    
            })
        }
       
    } else {
        return res.json({
            success: false,
            message: 'No token provided.'
        })
    }
})

// ------------------------
// --- PROTECTED ROUTES ---
// ------------------------

app.get('/getDeviceByPyOrder', function(req,res){
    //res.send("Warehouse management system (mini) - Grafokett AB v1.0");
    //res.send("GET ./py_order " + req.body.order);
    console.log(req.headers)
    console.log(`Py order = ${req.body.order}`)

   
    console.log(config)

    //create a pool to handle the connection
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.request().query(`select * from register where py_order='${req.body.order}'`)
    }).then(result => {
        let rows = result.recordset
        res.setHeader('Access-Control-Allow-Origin', "*")
        res.status(200).json(rows);
        sql.close();
    }).catch(err => {
        res.status(500).send({message: `${err}`})
        sql.close();
    })


});







// ------- Fetch endpoints --------
// --------------------------------

// ------- Orders --------
// ------- Articles --------
// ------- Log --------
// ------- Packlista --------





app.listen(PORT, function(){
    console.log(`App running on localhost:${PORT}`);
});

