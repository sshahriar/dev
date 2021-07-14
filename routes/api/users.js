const express = require('express') ;
const router = express.Router() ; 
const gravatar = require('gravatar') ;
const bcrypt =  require('bcryptjs' ) ;
const User = require('../../models/Users') ;
// const jwt =  require('jsonwebtoken') ; 

const {check, validationResult } = require('express-validator');

//  post api routes 
router.post('/',
  [
    // used validatior chech proportey of db elements 
    check('name', 'name is required').not().isEmpty(),
    check('email', 'include a valid email').isEmail() ,
    check('password','enter 6 length or more characters ').isLength({min:6})       
 
  ]
  ,async (req,res ) => {

    console.log(req.body)   ;

    console.log('inside users '  ) ;
 
    const errors  =  validationResult(req);

    console.log('fuckn '  ) ;
    if(!errors.isEmpty() ) {
      console.log('inside is empty'  ) ;
    
      return res.status(400).json({errors:errors.array()}) ;

    }
    console.log('fuckn123241 '  ) ;
    
    // inserting  into  db   
    const  {name, email ,password} = req.body  ;


    // res.send('user regestered') ; 
    try{
      // check if user exists 

      let user =  await User.findOne({email} ) ;// {email:email}

      if(user) {
        console.log('123fdsfdsfsdfdsfsdfdsfsafdsa')  ;
     
        res.sendStatus(400).json( {
          errors: [ { msg:'user already  exists'}] 
        
        
        })  ;

      }
      console.log('fdsfdsfsdfdsfsdfdsfsafdsa')  ;
      

      // avatar 

      const avatar = gravatar.url(email,{
        s:'200',
        r:'pg',
        d:'mm'
        
      })
        
      // constructur  kinda
      // inserting into database 
      user = new User({
        name,
        email, 
        avatar,
        password


      })
      console.log('inside users 12321323'  ) ;
  


      // encrypt password  
      const  salt =  await  bcrypt.genSalt(10) ;
      user.password =  await bcrypt.hash(password,salt) ;

    
      await   user.save() ;
 




      //return json webntoken  
      // const  payload = {
      //   user:{
      //     id : user.id
      //   }

      // }; 

      // jwt.sign(
      //   payload,  
      //   config.get('jwtsecret'),
      //   {expiresIn:3600000},
      //   (err,token)=>{
      //     if(err  ) throw err ;
      //     res.json({token })  ;
      //   }


      // ) ;

 

    } catch(err)  {
      console.error(err.message) ;
      res.sendStatus(500 ).send("server error "  ) ;
    }


  

  }
)

module.exports =  router ; 
