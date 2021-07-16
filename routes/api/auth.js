const express = require('express') ;
const router = express.Router() ; 
const auth =  require('../../middleware/auth') ;
const bcrypt =  require('bcryptjs' ) ;
const jwt =  require('jsonwebtoken') ;
const config =  require('config');

const User = require('../../models/Users') ;
const {check, validationResult } = require('express-validator');


router.get('/',auth , async (req,res ) => {
 
  try{
    console.log('inside try ' ) ;
    const user = await User.findById(req.user.id ).select('-password') ; 
    console.log(user) ;
   
    res.json(user ) ; 
  } catch{

    res.status(500 ) ;
  }
})


//  post api routes 
router.post('/',
  [
    // used validatior chech proportey of db elements 
    check('email', 'include a valid email').isEmail() ,
    check('password','enter 6 length or more characters ').isLength({min:6})       
 
  ]
  ,async (req,res ) => {

 
    console.log('inside api/auth'  ) ;
 
    const errors  =  validationResult(req);

    if(!errors.isEmpty() ) {
      console.log('inside is empty'  ) ;
    
      return res.status(400).json({errors:errors.array()}) ;

    }

    console.log('no error found'  ) ;

    // inserting  into  db   
    const  {email ,password} = req.body  ;
    console.log(req.body)   ;





    // res.send('user regestered') ; 
    try{
      // check if user exists 

      let user =  await User.findOne({email} ) ;// {email:email}

     
      if(!user) {
        console.log('user does not exists')  ;
     
        return res.status(400).json( {
          errors: [ { msg:'user does not  exists'}] 
        
        
        })  ;

      }

      console.log('user exists ' )  ;
      
      // check password
      const isMatch = await  bcrypt.compare(password,user.password ) ; 
      if(!isMatch){
        console.log('password does not match')  ;
     
        return res.status(400).json( {
          errors: [ { msg:'password not  exists'}] 
        
        
        })  ;


      }

 
      console.log('sending token ' )  ;


     



      
      // json webntoken  //
      const  payload = {
        user:{
          id : user.id
        }
      }; 

      jwt.sign(
        payload,  
        config.get('jwtsecret'),
        { expiresIn:36000000000 },
        (err,token)=>{
          if(err  ) throw err ;
          res.json({token })  ;
        }
      ) ;

    } catch(err)  {
      console.error(err.message) ;
      res.status(500 ).send("server error "  ) ;
    }


  

  }
)
 
module.exports =  router ;
