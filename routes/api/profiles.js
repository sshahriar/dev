const express = require('express') ;
const router = express.Router() ; 
const auth = require('../../middleware/auth');
const {check ,validationResult } = require('express-validator'); 

const Profile =  require('../../models/Profiles') ; 
const User =  require('../../models/Users') ; 

// @route get api/profile/me  
// @access private
router.get('/me', auth, async (req,res ) => {
  console.log('inside profile ' ) ; 
  // res.send('profiles route') ;
  console.log(req.body  )  ;  
  try {
    const profile = await Profile.findOne({user:req.user.id}).populate(
      'user' ,
      ['name', 'avatar'] 

    ) ;   

    if(!profile) {
      return res.status(400).json({msg:'no profile for this user'} ) ;

    }
    res.json(profile ) ; 

  }catch(err)  {
    console.error(err.message) ;
    res.status(500 ).send('server error') ;

  } 
})


// @route get api/profile/me 
// @access private
router.post('/' , [auth  ,[
  
    check('status','status is required').not().isEmpty(), 
    check('skills','skills are required').not().isEmpty(), 
  ] ] , async (req, res )=>{

    console.log(req.body  ) ;
    
    
    const errors = validationResult(req);
    if(!errors.isEmpty() ){

      return res.status(400).json({ errors: errors.array() } )  ;
    } 

    console.log('frkfdsf ');

    //insert int db 
    const{
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      facebook,
      linkedin,
      twitter ,
      youtube
    } = req.body  ;  
    // build profile object

    const  profileFields =  {} ; // initialize
    
    console.log('fdsffsadfs') ;
    profileFields.user = req.user.id ; 
    if(company) profileFields.company = company ;
    if(website) profileFields.website = website ;
    if(location) profileFields.location =location ;
    if(bio) profileFields.bio = bio ;
    if(status) profileFields.status = status ;
    if(githubusername) profileFields.githubusername = githubusername ;
    if(skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim() ) ;  
    }


     
    
    console.log(profileFields.skills)  ; 

     profileFields.social = {} ;

    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;


    
    
    try {
       

      let profile =  await Profile.findOne({user: req.user.id }) ;
   
      console.log('------------------------') ; 
   
      console.log(req.user.id  ) ; 
      console.log(profile  ) ; 
      
      if(profile)  {
        console.log('fuck profile exists  ' ) ; 
        profile = await Profile.findOneAndUpdate(
   
          {user: req.user.id } ,
          {$set: profileFields } ,
          {new: true } 
        );    

        return res.json(profile )  ;

      } 
      // create 

      profile = new Profile(profileFields) ;
      await profile.save()  ; 
     

      console.log('profile saverd ' ) ;
      res.json(profile );



    } catch(err){
      console.error(err.message) ; 
      res.status(500).send('Server error') ;
    }
  }
); 



//desc   get all profile 
//access public  
router.get('/' , async(req,res ) =>{
  console.log('insid profilens '  ) ; 

  try{
    const profiles = await  Profile.find().populate('user' , ['name' , 'avatar']);  

    res.json(profiles)  ; 
  } catch(err){
    console.log(err.message) ;  
    res.status(500).send('server  errror'  ) ;

  }



}) 


//desc   get user  by id  
//access public  
router.get('/user/:user_id' , async(req,res ) =>{
  console.log('insid profilens '  ) ; 

  try{
    const profile = await  Profile.findOne({
      user:  req.params.user_id
      
    }).populate('user' , ['name' , 'avatar']);  

    if(!profile)  { 
      return res.status(400).json({msg:'no user'});


    } 

    res.json(profile)  ; 
  } catch(err){
    console.log(err.message) ;  

    if(err.kind== 'ObjectId' ) {
      return res.status(400).json({msg:'no user'});

    }
    
    res.status(500).send('server  errror'  ) ;

  } 
}) 


//route   DELETE  api/profile 
//desc    delete  profile, user  and posts 
//access private
router.delete('/' ,auth , async(req,res ) =>{
  console.log('insid profilens '  ) ; 

  try{
    // todo - remove user posts 

    await  Profile.findOneAndRemove({user:req.user.id} ) ;
    await  User.findOneAndRemove({user:req.user.id} ) ;
    
    res.json({msg: 'user deleted  '  })  ; 

  } catch(err){
    console.log(err.message) ;   
    res.status(500).send('server  errror'  ) ;

  } 
}) 

// vid  6/7/8
// todo add delete experience
// access private  

router.put ('/experience' , [auth  ,[
  
  check('company','company is required').not().isEmpty() 

  ]   ] , async (req, res )=>{

  const errors = validationResult(req ) ; 
  if(!errors.isEmpty( ) ) {
    return res.status(400).json({errors:errors.array() }); 
  } 

  console.log('inside put ')   ; 
  console.log(req.body ) ; 

  const  {
    title ,
    company,
    location,
    from,
    to,
    current ,
    desctiption 

  } = req.body ;

  // create  object  

  const  newExp = {
    title ,
    company , 
    location ,
    from,
    to,
    current ,
    desctiption 
  } ; 
  
  console.log(newExp ) ;
  try {
    let  profile = await Profile.findOne( { user : req.user.id } );
    console.log('--------------------------') ;
 
   
   
    profile.experience.unshift(newExp) ;  
    await profile.save()  ; 

    res.json(profile ) ; 
    
  }catch(err){ 
    console.log(err.message) ; 
    return  res.status(400 ).send('errors adding  exp ');
 
  }
 
  }
)
// delete experience  from profile 
route.delete('/experience/:exp_id',auth,(req,res)=>{

  try{
    const profile =  await Profile.findOne({ user: req.user.id } );

    // get remove index 
    const removeIndex = profile.experience.map(item=>item.id).indexOf(
      req.params.exp_id );

    profile.experience.splice(removeIndex,1 ) ; 
    await profile.save() ;
    res.json(profile ) ;

  } catch( err  ) {
    console.log(err.message) ; 
    return  res.status(400 ).send('errors adding  exp ');
 

  }


}) ;






// todo add delete education  






module.exports =  router ;







