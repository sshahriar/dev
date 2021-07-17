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

module.exports =  router ;
