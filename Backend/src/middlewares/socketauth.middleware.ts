import { Server } from "socket.io";
import {
  decodeAccessToken,
  decodeRefreshToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util";
import { checkIfUserExists } from "../services/user.service";
import IUser from "../interfaces/user.interface";
import { TokenExpiredError } from "jsonwebtoken";

export const authenticateSocket = (io: Server) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.query.token as string;
    const refreshToken = socket.handshake.headers["cookie"]
      ?.split("; ")
      .find((c) => c.startsWith("refreshToken="))
      ?.split("=")[1];

    if (!token || !refreshToken) {
      return next(new Error("Access token or refresh token is missing"));
    }

    let decodedToken;
    try {
      decodedToken = decodeAccessToken(token);
    } catch (error) {
      if (error === TokenExpiredError) {
        try {
          const claims = decodeRefreshToken(refreshToken);

          if (!claims) throw new Error("Invalid Refresh Token");
          const user: IUser = await checkIfUserExists(claims.username);

          const newAccessToken = await verifyRefreshToken(user, refreshToken);
          socket.handshake.query.token = newAccessToken.newAccessToken; // Update the token for future use
          // Optionally, you can send the new tokens back to the client
          const newRefreshToken = generateRefreshToken(user);
          socket.emit("updateTokens", {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });

          next();
          return;
        } catch (refreshError) {
          return next(new Error((refreshError as Error).message)); // Refresh token invalid or expired
        }
      } else {
        return next(new Error("Invalid access token"));
      }
    }

    if (!decodedToken) {
      return next(new Error("Invalid or expired access token"));
    }

    next();
  });
};
