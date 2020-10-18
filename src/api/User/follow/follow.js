import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    follow: async (_, args, { request }) => {
      isAuthenticated(request);
      const { id } = args;
      const { user } = request;
      try {
        await prisma.updateUser({
          where: { id: user.id },
          data: {
            following: { // user의 id에 해당하는 following에 following할 id를 넣어서 update한다
              connect: { //followingㅎ 대상이된 user는 자동으로 follower가 생긴다
                id
              }
            }
          }
        });
        return true;
      } catch {
        return false;
      }
    }
  }
};