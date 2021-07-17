const mongoose = require('mongoose') ;
const config = require('config' ) ;

// config has url to connect with mongodb atlas
const db = config.get('mongoURI') ;



const connectDB =  async ()=>{
  try{

    console.log('inside db...') ; 
    await  mongoose.connect(db,{
      useUnifiedTopology:true,
      useNewUrlParser:true ,
      useCreateIndex:true
    }) ;  
    console.log('db connected') ;
  }catch(err){

    console.log(db) ;
    console.error(err.mssage) ; 
    process.exit(1);


  }
} ;


module.exports = connectDB ; 








//  use mongoose to connect with db  
// export module so can be used from server 