const AuthorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
//edge cases according to authormodel
//if body is empty
  let data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please provide your author details in body" })
    };

//for every required feilds
    if (!req.body.fname) {return res.status(400).send({ msg: "Please enter the fname" }) }

    if (!req.body.lname) {return res.status(400).send({ msg: "Please enter the lname" }) }

    if (!req.body.title) {return res.status(400).send({ msg: "Please enter the title" }) }

    if (!req.body.email) {return res.status(400).send({ msg: "Please enter the email" }) }

    if (!req.body.password) {return res.status(400).send({ msg: "Please enter the password" }) }

//checking alphabet
    if (!(/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(data.fname))) {
      return res.status(400).send({ status: false, msg: "Fname should be in alphabat type" })
    };
    if (!(/^\s*([a-zA-Z])([^0-9]){2,64}\s*$/.test(data.lname))) {
      return res.status(400).send({ status: false, msg: "Lname should be in alphabat type" })
    };

//checking emailid is registered or not and also email format valid or not 
    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email))) {
      return res.status(400).send({ status: false, msg: "please enter a valid Email" })
    };

//checking email is regusterd or not
  let emailId= await AuthorModel.findOne({email:data.email})
     if(emailId)
     {return res.status(400).send ({status:false,msg:"Email is already registerd"})}

    let authorCreated = await AuthorModel.create(data);
    {return res.status(201).send({data:data})};

  }
   catch (err) {
   return res.status(500).send({ msg: "Error", error: err.message });
  }
};

const loginUser = async function (req, res) {
  try {
    let authorName = req.body.email;
    let password = req.body.password;
    //edge case for authorname and pasword
    //checking body and email-password must be present 
    let data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please provide your Blog details in body" })
    };

    if (!authorName) { return res.status(400).send({ status: false, msg: "Email is required" }); }

    if (!password) { return res.status(400).send({ status: false, msg: "Password is required" }); }

//checking emailid is registered or not and also email format valid or not 
    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(authorName))) {
      return res.status(400).send({ status: false, msg: "please enter a valid Email" })
    };

//checking both feilds are matched or not
    let author = await AuthorModel.findOne({ emailId: authorName, password: password, });
    if (!author)
      return res.status(400).send({ status: false, msg: "Email and Password does'nt match", });

    //After checking all edge cases ... now creating token
    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "radon",
        organisation: "FunctionUp",
      },
      "functionup-radon"
    );
    { res.setHeader("x-api-key", token)};
  {return  res.status(201).send({ status: true, token: token })};

  } catch (err) {
   return res.status(500).send({ error: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.loginUser = loginUser;
