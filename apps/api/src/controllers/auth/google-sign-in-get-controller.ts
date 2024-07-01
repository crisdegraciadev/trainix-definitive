import { GoogleConfig } from "@config/google-config";
import { Controller, TypedResponse } from "@controllers/controller";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";

export class GoogleSignInGetController implements Controller<any> {
  async run(req: Request, res: Response<TypedResponse<any>>): Promise<any> {
    const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = GoogleConfig;

    const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

    const authorizedUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/userinfo.profile openid",
      prompt: "consent",
    });

    res.send({ data: { authorizedUrl } });
  }
}
