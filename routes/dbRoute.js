
const express = require('express')
const router = express.Router()
const db = require('../db/dbConfig')
const verifyToken = require('../verifyToken/verifyToken')

router.get('/', (req,res)=>{
    res.render('user_controller', {message: "default"});
})

router.post('/add',verifyToken,function(req,res){
    let addUrdu,addHindi;
    addUrdu = req.body.addUrdu;
    addHindi = req.body.addHindi;
    var q = 'SELECT * FROM urdutohindi WHERE Urdu = ? OR Hindi = ? ' ;
    db.query(q,[addUrdu,addHindi],(err,result) => {
        arr = Object.keys(result).length;
        if(arr === 0 )
        {
            db.query('INSERT INTO urdutohindi (Urdu,Hindi) VALUES (?,?)',[addUrdu,addHindi],(err,result)=>{
                if(err)
                console.log(err);
                else
                {
                    res.status(200).send({message: 'Data added'});
                }
            });
        }
        else
        {
            res.status(500).send({message: 'data is already added'})
        }
    })
    
})

router.post('/updateUrdu',verifyToken,function(req,res){
    let updateUrdu = req.body.updateUrdu
    let Hindi = req.body.Hindi
    db.query('SELECT * FROM urdutohindi WHERE Hindi = ?',[Hindi],(err,result)=>{
        if(err)
        console.log(err)
        else
        { 
           if(Object.keys(result).length > 0)
            {
               db.query('SELECT * FROM urdutohindi WHERE Urdu = ?',[updateUrdu],(err,result1)=>{
                   if(err)
                   console.log(err)
                   if(Object.keys(result1).length > 0)
                   res.render('user_controller',{message: 'Urdu word already exist'})
                   else{
                    db.query('UPDATE urdutohindi SET Urdu = ? WHERE Hindi = ?',[updateUrdu,Hindi],(err,result2)=>{
                        if(err)
                        console.log(err)
                        else
                        res.status(200).send({message: 'data updated'})
                        })
                   }
                   
               })      
            }
            else
            {
                res.status(404).send({message: 'No valid match'})
            }
        }
    })
   
})

router.post('/updateHindi',verifyToken,function(req,res){
    let Urdu = req.body.Urdu
    let updateHindi = req.body.updateHindi

    db.query('SELECT * FROM urdutohindi WHERE Urdu = ?',[Urdu],(err,result)=>{
        if(err)
        console.log(err)
        else
        {
           if(Object.keys(result).length > 0)
            {
                db.query('SELECT * FROM urdutohindi WHERE Hindi = ?',[updateHindi],(err,result1)=>{
                    if(err)
                    console.log(err)
                    if(Object.keys(result1).length > 0)
                    res.render('user_controller',{message: 'Hindi word already exist'})
                    else{
                        db.query('UPDATE urdutohindi SET Hindi = ? WHERE Urdu = ?',[updateHindi,Urdu],(err,result)=>{
                            if(err)
                            console.log(err)
                            else
                            res.status(200).send({message: 'Data updated'})
                            })
                    }
                })
              
            }
            else
            {
                res.status(404).send({message: 'No valid match'})
            }
        }
    })

})

module.exports = router