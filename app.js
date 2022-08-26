const express = require('express')
const bodyParser = require('body-parser')

const app = express();
const db = require('./db/dbConfig')
const cors = require('cors')

app.set('view engine', 'ejs')

app.use(cors())
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const PORT = process.env.PORT || 4000

app.get('/',function(req,res){
    res.render('index',{text_new:[]})
})

app.post('/convert', function(req,res) {
    let text;
    let text_split;
    text = req.body.word;
    // text = "अफसर अफसरों दर्पण"
    text_split = text.split(" "); //splits the text into array
    console.log(text_split)
    let text_length  
    text_length = Object.keys(text_split).length; // length of array
    db.query("SELECT * FROM urdutohindi", function (err,result)
    {
        if(err)
        throw err
        var length_table = Object.keys(result).length
        var newstr = []; 
          //to store new string
        for(var j=0; j < text_length; j++)
        {
            datas = text_split[j]
            var check = 0
            for(var i=0 ; i < length_table; i++)
            {
                if(result[i].Urdu === datas)   //if found in databse add translated word to newstr
                {
                    var newarr = result[i].Hindi.split('/')
                    newstr.push({
                        hindi : newarr,
                        urdu : result[i].Urdu,
                        status : 1
                    })
                    check = 1
                    break
                }
            }
            if(check == 0)  //if not found add the old word to newstr
            {
               var newdata = []
               newdata.push(datas)
               newstr.push({
                   hindi : newdata,
                   urdu : " ",
                   status: 0
               })
            }       
        }
        console.log(newstr)
         res.render('index',{text_new:newstr})
    })
})

app.use('/user_controller',require('./routes/dbRoute'))

app.use('/user',require('./routes/authRoute'))


// setting server
app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
}) 