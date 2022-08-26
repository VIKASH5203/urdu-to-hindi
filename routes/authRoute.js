const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../db/dbConfig')
const util = require('util');

const jwt = require('jsonwebtoken')

router.get('/loginPage',(req,res)=>{
    res.render('login')
})

router.post('/login',(req,res)=>{
  
    let username = req.body.username
    let password = req.body.password

    db.query('SELECT * FROM users WHERE username = ?',[username],(err,result)=>{
        if(err)
        console.log(err)
        if(Object.keys(result).length !== 0)
        {
          bcrypt.compare(password, result[0].password).then(function(result) {
            if(result === true)
            jwt.sign({username: username,password:password}, process.env.SECRET_KEY , function(err, token) {
                if(err) 
                console.log(err)
                else
               {
                res.status(200).send({
                    token:token,
                    auth : true
                })
                // res.redirect('/user_controller') 
               }
              })
            else
            res.status(404).send({
                message:'invalid username or password'
            })
          })
        }
        else{
            res.status(404).send({
                message:"no user found"
            })
        }
    })  
})

// app.post('/signup',(req,res)=>{
//     let username = req.body.username
//     let password = req.body.password
//     bcrypt.hash(password,1).then((hash)=>{
//         db.query('INSERT INTO users (username,password) VALUES (?,?)',[username,hash],(err,result)=>{
//             if(err)
//             console.log(err)
//             else
//             // res.render('index',{text_new:[]})
//             res.status(200).send({
//                 message:"done"
//             })
//         })
//     })
// })

  
module.exports = router