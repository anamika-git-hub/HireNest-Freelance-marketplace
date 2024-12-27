import { Next, Req, Res } from "../../infrastructure/types/serverPackageTypes"
import { JwtService } from "../../infrastructure/services/JwtService";
import checkTokenBlacklist from "./TokenBlocklist";
interface CustomRequest extends Req{
    user?:{userId:string};
}
export const isUser = (req:CustomRequest, res: Res,next: Next) => {
    console.log(req.headers)
  const authHeader =  req.headers['authorization'] as string;
  const accessToken = authHeader.split(' ')[1]
  const userData=JwtService.verifyToken(accessToken) as {id:string}
  if(userData){
    console.log('uu',userData)
    req.user = {userId:userData.id}
    checkTokenBlacklist(req,res,next);
    
  }else{
    console.log(req.headers)
    const authHeader = req.headers['refreshtoken'] as string;
    const refreshToken = authHeader.split(' ')[1]
    const userData = JwtService.verifyRefreshToken(refreshToken) as {_id:string}
    if(userData){
        console.log(userData)
        req.user = {userId:userData._id}
        checkTokenBlacklist(req,res,next);
        
    }
  }
}