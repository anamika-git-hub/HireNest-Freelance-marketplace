import { Next, Req, Res } from "../../infrastructure/types/serverPackageTypes"
import { JwtService } from "../../infrastructure/services/JwtService";
import checkTokenBlacklist from "./TokenBlocklist";
interface CustomRequest extends Req{
    user?:{userId:string};
}
export const isUser = (req: CustomRequest, res: Res, next: Next) => {
  try {
      const authHeader = req.headers['authorization'] as string;
      const accessToken = authHeader.split(' ')[1];

      let userData;
      try {
          // Try verifying access token
          userData = JwtService.verifyToken(accessToken) as { id: string };
          console.log('uuuuuuuuuuserdata',userData)
          if (userData) {
              req.user = { userId: userData.id };
              return checkTokenBlacklist(req, res, next);
          }
      } catch (error:any) {
          if (error.name === 'TokenExpiredError') {
              // Handle token expiry
              const refreshHeader = req.headers['refreshtoken'] as string;
              const refreshToken = refreshHeader.split(' ')[1];
              try {
                  // Verify refresh token
                  const refreshData = JwtService.verifyRefreshToken(refreshToken) as { _id: string };
                  if (refreshData) {
                      req.user = { userId: refreshData._id };
                      return checkTokenBlacklist(req, res, next);
                  }
              } catch (refreshError) {
                throw new Error('Refresh token expired. Please log in again.' )
                  // return res.status(401).json({ message: 'Refresh token expired. Please log in again.' });
              }
          } else {
            throw new Error( 'Invalid token. Please log in again.' )
              // return res.status(401).json({ message: 'Invalid token. Please log in again.' });
          }
      }
  } catch (error) {
    throw new Error( 'Internal Server Errorsss')
      // return res.status(500).json({ message: 'Internal Server Error', error });
  }
};
