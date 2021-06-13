import jwt from "jsonwebtoken";


const auth = async (req, res, next) => {
  try {// we need to check user is really who he is claiming to be
    const token = req.headers.authorization.split(" ")[1];// token is at first position in array after split
    const isCustomAuth = token.length < 500;// it means token is our own 
    const secret = process.env.SECRET;
    let decodedData;

    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, secret);// gives data from each token his username and id

      req.userId = decodedData?decodedData.id:null;//storing id of user
    } else {
      decodedData = jwt.decode(token);// here we dont need secret

      req.userId = decodedData?decodedData.sub:null;// sub is google name for specific id that differentiate every single google user
    }    

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
