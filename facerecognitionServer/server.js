const express = require("express");
const bodyParse = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const admin = require("firebase-admin");

const app = express();

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-brain-d6760.firebaseio.com"
});

var db = admin.firestore();

//console.log(pg.select('*').from('users').then(data=>console.log(data)))

app.use(bodyParse.json());
app.use(cors());

/*bcrypt-nodejs*/

app.listen(3000, () => {
  console.log("app is running on port 3000 ");
});

app.post("/signin", (req, res) => {
  let flag = false;
  db.collection("login")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data().email === req.body.email) {
          const isValid = bcrypt.compareSync(
            req.body.password,
            doc.data().hash
          );
          if (isValid) {
            flag = true;
            db.collection("users")
              .get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  if (doc.data().email === req.body.email) {
                    res.json(doc.data());
                  }
                });
              })
              .catch(err => res.status(400).json("Unable to get the user"));
          } else {
            res.status(400).json("Wrong credentials");
          }
        }
      });
      if (!flag) {
        res.status(400).json("Wrong credentials");
      }
    });
});

app.get("/users", (req, res) => {
  arr = [];
  db.collection("users")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        var user = doc.data();
        arr.push(user);
      });
      res.json(arr);
    });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let flag = false;
  db.collection("users")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data().id == id) {
          flag = true;
          res.json(doc.data());
        }
      });
      if (!flag) {
        res.status(400).json("User does not exist");
      }
    })
    .catch(err => {
      res.status(400).json("Error getting the information");
    });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db.collection("users")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data().id == id) {
          const entry = doc.data().entries;
          db.collection("users")
            .doc(doc.id)
            .update({ entries: entry + 1 });
          res.json(entry + 1);
        }
      });
    })
    .catch(err => {
      res.status(400).json("Enable getting the entries");
    });
});

app.put("/update", (req,res)=>{
  let arr=[]
  const {newEmail,newName,id}=req.body;
  db.collection("users")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.data().id,id)
        if(doc.data().id == id){
         let userRef = db.collection("users").doc(doc.id); 
         return userRef.update({
            email: newEmail,
            name: newName
        }).then(db.collection("users").doc(doc.id).get().then(snapshot=>{arr.push(snapshot.data())}))
        .then(function() {
          db.collection("login")
          .get()
          .then(snapshot2 => {
            snapshot2.forEach(doc2 => {
              if(doc2.data().id == id) {
                var loginRef = db.collection("login").doc(doc2.id);
                return loginRef.update({
                  email: newEmail
              })
              .then(
                res.json(arr))
              }
            });
          })
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        })
      }
        let user = doc.data();
        arr.push(user);

      });
    });
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  var loginRef = db.collection("login").doc();
  var setLogin = loginRef
    .set({
      id: Math.floor(Math.random() * 10000 + 1),
      email: email,
      hash: hash
    })
    .then(
      db.runTransaction(t => {
        return t.get(loginRef).then(doc => {
          var userRef = db.collection("users").doc();
          userRef
            .set({
              id: doc.data().id,
              email: doc.data().email,
              name: req.body.name,
              entries: 0,
              joined: new Date()
            })
            .then(
              db.runTransaction(z => {
                return z.get(userRef).then(user => {
                  res.json(user.data());
                });
              })
            );
        });
      })
    )
    .catch(err => {
      status(400).json("Enable getting the entries");
    });
});

app.delete("/delete", (req, res) => {
  const email  = req.body.email;
  arr = [];
   db.collection("users")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data().email === email) {
          db.collection("users")
            .doc(doc.id)
            .delete() 
            .then(function(){
                db.collection("login")
                  .get()
                  .then(snapshot2 => {
                    snapshot2.forEach(doc2 => {
                      if (doc2.data().email === email) {
                        db.collection("login")
                        .doc(doc2.id)
                        .delete()
                      }
                    });
                  })
            })
            .catch(function() {
              res.json("error deleting!");
            })
        }
        if(doc.data().email!=email){
        let user = doc.data();
        arr.push(user);
      }
      });

      res.json(arr)
    });
});

app.get("/", (req, res) => {
  res.send("this is working");
});

/*db.collection("users").doc(doc.id).delete().then(function() {
          res.json("successfully deleted!");
      }).catch(function(){
        res.json("error deleting!");
      });*/

/*
/ --> res = this is working
/sign in --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
