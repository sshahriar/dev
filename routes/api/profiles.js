const express = require('express') ;
const router = express.Router() ; 


router.get('/',(req,res ) => {
  res.send('profiles route') ; 


})

module.exports =  router ;