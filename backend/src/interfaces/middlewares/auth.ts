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
          console.log('userData',userData);
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
export const isClient= (req: CustomRequest, res: Res, next: Next) => {
  try {
      const authHeader = req.headers['authorization'] as string;
      const accessToken = authHeader.split(' ')[1];

      let userData;
      try {
          // Try verifying access token
          userData = JwtService.verifyToken(accessToken) as { id: string, role: string };
          console.log('userData cleint',userData);
          if (userData.role === 'client') {
              req.user = { userId: userData.id };
              return checkTokenBlacklist(req, res, next);
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
                if (refreshData.role === 'client') {
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
    throw new Error( 'Internal Server Error')
  }
};

export const isFreelancer = (req: CustomRequest, res: Res, next: Next) => {
  try {
      const authHeader = req.headers['authorization'] as string;
      const accessToken = authHeader.split(' ')[1];

      let userData;
      try {
          // Try verifying access token
          userData = JwtService.verifyToken(accessToken) as { id: string , role:string};
          console.log('userData',userData);
          if (userData.role === 'freelancer') {
              req.user = { userId: userData.id };
              return checkTokenBlacklist(req, res, next);
          }
      } catch (error) {
        if(error instanceof Error){
          
          if (error.name === 'TokenExpiredError') {
              // Handle token expiry
              const refreshHeader = req.headers['refreshtoken'] as string;
              const refreshToken = refreshHeader.split(' ')[1];
              try {
                  // Verify refresh token
                  const refreshData = JwtService.verifyRefreshToken(refreshToken) as { id: string ,role:string};
                  if (refreshData.role === 'freelancer') {
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
    throw new Error( 'Internal Server Error')
  }
};

export const isAdmin = (req: CustomRequest, res: Res, next: Next) => {
  try {
      const authHeader = req.headers['authorization'] as string;
      const accessToken = authHeader.split(' ')[1];

      let userData;
      try {
          // Try verifying access token
          userData = JwtService.verifyToken(accessToken) as { id: string ,role:string};
          console.log('userData',userData);
          if (userData.role === 'admin') {
              req.user = { userId: userData.id };
              return checkTokenBlacklist(req, res, next);
          }
      } catch (error) {
        if(error instanceof Error){
          if (error.name === 'TokenExpiredError') {
              // Handle token expiry
              const refreshHeader = req.headers['refreshtoken'] as string;
              const refreshToken = refreshHeader.split(' ')[1];
              try {
                  // Verify refresh token
                  const refreshData = JwtService.verifyRefreshToken(refreshToken) as { id: string ,role:string};
                  if (refreshData.role === 'admin') {
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
    throw new Error( 'Internal Server Error')
  }
};


