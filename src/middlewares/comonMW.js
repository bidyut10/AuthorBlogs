const jwt = require("jsonwebtoken");
const blogsModel = require("../models/blogsModel");


const authenticate = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    // console.log(token); to checking only

    //checking token must be present in header
    if (!token) token = req.headers["x-api-key"];
    if (!token)
      { return res.send({ status: false, msg: "Token must be present" })};

    //after that decode and verify the token
    let decodedToken = jwt.verify(token, "functionup-radon");

    //checking the decoding token
    if (!decodedToken)
      {return res.send({ status: false, msg: "Token is invalid" })};
    req.decodedToken = decodedToken;
    next();

  } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};



const authorisation = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    //checking token must be present in header    
    if (!token) token = req.headers["x-api-key"];
    if (!token)
     { return res.send({ status: false, msg: "Token must be present" })};

    //after that decode and verify the token
    let decodedToken = jwt.verify(token, "functionup-radon");

    //checking the decoding token/basically checking edge cases
    if (!decodedToken)
      {return res.send({ status: false, msg: "token is invalid" })};
    req.decodedToken = decodedToken;

    //checking authorId
    let modifyAuthor = req.params.authorId || req.headers.authorId;
    let loggedUser = decodedToken.userId;
    if (modifyAuthor !== loggedUser) {
      return res.send({ status: false, msg: "Modified Author must be logged-in" });
    }
    // res.status(200).send({msg:"authorisation successful"})
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


module.exports.authorisation = authorisation;
module.exports.authenticate = authenticate;
