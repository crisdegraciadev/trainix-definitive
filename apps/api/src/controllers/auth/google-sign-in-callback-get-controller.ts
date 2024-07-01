import { GoogleConfig } from "@config/google-config";
import { Controller, TypedResponse } from "@controllers/controller";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";

export class GoogleSignInCallbackGetController implements Controller<any> {
  async run(req: Request, res: Response<TypedResponse<any>>): Promise<any> {
    const code = req.query.code as string;

    try {
      const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = GoogleConfig;
      const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      console.log("Token acquired");
      const user = oAuth2Client.credentials;
      console.log({ user });

      const { id_token: idToken } = user;

      res.send({ data: { idToken } });
      res.redirect("http://localhost:5173");
    } catch (error) {
      console.log({ error });
    }
  }
}
