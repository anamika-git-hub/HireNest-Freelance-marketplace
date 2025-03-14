import Redis from "ioredis";

const redis = new Redis();

export const TempUserRepository = {
  storeTempUser: async (userData: any) => {
    const tempId = `tempUser:${Date.now()}`;
    await redis.set(tempId, JSON.stringify(userData), "EX", 600); 
    return tempId;
  },

  getTempUser: async (tempId: string) => {
    const data = await redis.get(tempId);
    return data ? JSON.parse(data) : null;
  },

  deleteTempUser: async (tempId: string) => {
    await redis.del(tempId);
  },

  updateOtp: async (tempId: string, newOtp: string) => {
    const data = await redis.get(tempId);
    if (data) {
      const userData = JSON.parse(data);
      userData.otp = newOtp;
      await redis.set(tempId, JSON.stringify(userData), "EX", 600); 
    }
  },
};
