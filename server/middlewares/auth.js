import jwt from 'jsonwebtoken';

// Middleware to deccode jwt and get clerkid

const authUser = async (req, res, next) => {

   try {

    const {token} = req.headers;

    if(!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    const token_decode = jwt.decode(token)
    req.body.clerkId = token_decode.clerkId;
    next();
    
   } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
   }
}

export default authUser;