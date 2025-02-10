const jwt =require('jsonwebtoken')



  const generateToken = (id) => {
    return jwt.sign({id},"dev-tinder@12321",{ expiresIn: "1d" });
  };

  module.exports=generateToken