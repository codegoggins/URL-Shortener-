const express=require('express');
const bodyParser=require('body-parser');

const app = express();
const port =3000;
const static = express.static('public'); 

//firebase
var admin = require("firebase-admin");

var serviceAccount = require("./url-shortener-e6fb6-firebase-adminsdk-d3mbf-6214fbb7f4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.use(static);
app.use(bodyParser.json());

const urlsdb = admin.firestore().collection("urlsdb");
const usersdb = admin.firestore().collection("usersdb");



app.get('/:short',(req,res)=>{
    console.log(req.params);
    const short=req.params.short;

    const doc = urlsdb.doc(short);

    doc.get().then(response=>{
        const data = response.data();
        // console.log(data);
        if(data && data.url){
            res.redirect(301,data.url);
        }else{
            res.redirect(301)
        }
    })

    // res.send('We will redirect you to ' + short);
});


app.post('/admin/urls/',(req,res)=>{ 
 const {email,password,short,url}=req.body;

 usersdb.doc(email).get().then(response=>{
     const user = response.data();
    //  console.log(user);

     if(user && user.email == email && user.password == password){
          const doc=urlsdb.doc(short);
          doc.set({url});
          res.send("Done");
     }else{
         res.status(403).send("Not Possible");
     }
 })
});

app.listen(port,()=>{
  console.log(`App listening at:${port}`);
});