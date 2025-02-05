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
          userData = JwtService.verifyToken(accessToken) as { id: string, role: string };
          if (userData) {
              req.user = { userId: userData.id };
              return checkTokenBlacklist(req, res, next);
          }
      } catch (error) {
        if (error instanceof Error){
          if (error.name === 'TokenExpiredError') {
              // Handle token expiry
              const refreshHeader = req.headers['refreshtoken'] as string;
              const refreshToken = refreshHeader.split(' ')[1];
              try {
                  // Verify refresh token
                  const refreshData = JwtService.verifyRefreshToken(refreshToken) as { id: string };
                  if (refreshData) {
                      req.user = { userId: refreshData.id };
                      return checkTokenBlacklist(req, res, next);
                  }
              } catch (refreshError) {
                throw new Error('Refresh token expired. Please log in again.' )
              }
          } else {
            throw new Error( 'Invalid token. Please log in again.' )
          }
        }
      }
  } catch (error) {
    throw new Error( 'Internal Server Errorsss')
  }
};

export const checkAuth= (userRole:string) => {
  return async(req: CustomRequest, res: Res, next: Next) => {
    try {
        const authHeader = req.headers['authorization'] as string;
        const accessToken = authHeader.split(' ')[1];

        let userData;
        try {
            // Try verifying access token
            userData = JwtService.verifyToken(accessToken) as { id: string, role: string };
            if(userRole !== 'user'){
              if (userData.role === userRole) {
                req.user = { userId: userData.id };
                return checkTokenBlacklist(req, res, next);
              }
            }else{
              if(userData){
                req.user = { userId: userData.id };
                return checkTokenBlacklist(req, res, next);
              }
            }
           
        } catch (error) {
          if(error instanceof Error){
            if (error.name === 'TokenExpiredError') {
              // Handle token expiry
              const refreshHeader = req.headers['refreshtoken'] as string;
              const refreshToken = refreshHeader.split(' ')[1];
              try {
                  // Verify refresh token
                  const refreshData = JwtService.verifyRefreshToken(refreshToken) as { id: string,role:string };
                  if(userRole !== 'user'){
                    if (refreshData.role === userRole) {
                      req.user = { userId: refreshData.id };
                      return checkTokenBlacklist(req, res, next);
                    }
                  }else {
                    if (refreshData) {
                      req.user = { userId: refreshData.id };
                      return checkTokenBlacklist(req, res, next);
                  }
                  }
                 
              } catch (refreshError) {
                throw new Error('Refresh token expired. Please log in again.' )
              }
            } else {
              throw new Error( 'Invalid token. Please log in again.' )
            }
          }  
        }
    } catch (error) {
      throw new Error( 'Internal Server Error')
    }
  }
};


