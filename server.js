const express=require('express');
const mongoose=require('mongoose');
const cors = require('cors');
require('dotenv').config()
const file=require('./models/file')
const multer  = require('multer')
const bcrypt = require("bcryptjs")

const upload = multer({ dest: 'uploads/' })

const app=express();

app.use(cors());
app.use(express.json());
app. set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

const uri=process.env.DATABASE_URI;
mongoose.connect(uri, { });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


app.get('/',async(req,res)=>{
    res.render('index');
})

app.post('/upload',upload.single('file'),async(req,res)=>{
    const newFile={
        originalName:req.file.originalname,
        path:req.file.path,
        newName:req.file.filename,
        password: await bcrypt.hash(req.body.password,10)
    }
    const temp=new file(newFile);
    temp.save().then(()=>console.log("file uploaded"));
    res.render("index", { fileLink: `${req.headers.origin}/file/${temp.id}` })
})


app.route('/file/:id').get(handleDownload).post(handleDownload)
async function handleDownload(req,res){
    const temp = await file.findById(req.params.id)
    if(temp.password != null)
    {
        if(req.body.password == null){
            res.render("password");
            return ;
        }
        if(!(await(bcrypt.compare(req.body.password,temp.password))))
        {
            res.render("password",{error:true});
            return 
        }
    }
    temp.download++;
    await temp.save();
    res.download(temp.path,temp.originalName);
}

const port=process.env.PORT||5000
app.listen(port)