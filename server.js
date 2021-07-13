const express = require('express') ;
const app = express() ;
const port =  process.env.port  || 8080;



// connect with db
const connectDB =  require('./config/db');
connectDB() ; 


app.get('/',(req,res ) => {
  res.send('api running '  ) ;
                                        


}); 
app.listen(port,()=>{
  console.log(`app running on port  ${port}`);

})



