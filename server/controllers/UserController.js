import {WebHook} from 'svix'

const clerkWebhooks = async(req, res) => {

  try{

    const whook = new WebHook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body),{
        "svix-id" : req.headers['svix-id'],
        "svix-timestamp" : req.headers['svix-timestamp'],
        "svix-signature" : req.headers['svix-signature'],
    });

    const {data, type} = req.body;

    switch(type){
       case "user.created": {


          break;
       }

       case "user.updated": {


          break;
       }


       case "user.deleted": {


          break;
       }     


       default:
          break;
    }

  }
  catch(error){
    console.log(error.message);
    res.json({success: false, message: error.message});
  }


}