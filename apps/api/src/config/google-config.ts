const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = "http://127.0.0.1:3000/auth/google/callback";

export const GoogleConfig = {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
};
