import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const hashedPassword = async (password: string): Promise<string> =>{
    return await bcrypt.hash(password,10)
};

const algorithm = "aes-256-ctr";
const secretKey = process.env.SECRET_KEY as string
const iv = crypto.randomBytes(16);
export const encrypt = async(userId: string): Promise<string> => {
   
    const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(secretKey, "hex"),
        iv
      );
      const encrypted = Buffer.concat([
        cipher.update(userId.toString(), "utf8"),
        cipher.final(),
      ]); 
      return iv.toString("hex") + ":" + encrypted.toString("hex");
    
}

export const decrypt = async(userId: string): Promise<string> => {
    const [ivHex, encryptedText] = userId.split(":"); 
    const ivBuffer = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey, "hex"),
      ivBuffer
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString();
  };