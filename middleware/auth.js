const jwt = require('jsonwebtoken') ;
const config = require('config') ;

module.exports = function(req,res , next ) {

  console.log('inside middle aut  '  ) ; 
  // get  token from header 
  const token  =  req.header('x-auth-token');

  console.log('inside  auth functinon ');  


  // check if not available 
  if(!token ) { 
    console.log( 'token not available '  ); 
    return res.send(401).json({ msg: 'no token , auth denied.' }) ;

  }
  console.log(token) ;

  // verify token 
  try{
    console.log('jwt verify ')  ; 
    const decoded =  jwt.verify(token, config.get('jwtsecret')) ;     
    req.user = decoded.user ; 
    next() ;

  }catch(err) {

    console.log('inside catc ' )  ; 
    res.status(401).json({ msg: 'invalid token'} ) ;

  }
  



}