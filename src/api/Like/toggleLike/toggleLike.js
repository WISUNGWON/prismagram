// 특정 유저가 해당 글에 대해서 좋아요를 누른적이 없다면 좋아요를 create 해주고
// 좋아요를 누른 기록이 있다면 지우는 코드

import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleLike: async (_, args, { request }) => {
      isAuthenticated(request); // 토큰으로 사용자 인증을 하였는지 검증하는 함수
      const { postId } = args;
      const { user } = request;
      const filterOptions = {
        AND: [
          {
          user: {
            id: user.id
          }
          },
          {
            post:{
              id: postId
            }
          }
        ]
      };
      try {
        const existingLike = await prisma.$exists.like(filterOptions); //$exists : DB내에 쿼리의 조건을 만족하는 객체가 있을 경우 true를 반환(객체의 존재 유무 판단)
        if (existingLike) {
          await prisma.deleteManyLikes(filterOptions); // deleteMany : 조건에 맞는 데이터를 여러건 지우는데 사용하는 함수
        } else {
          await prisma.createLike({
            user: {
              connect: {
                id: user.id
              }
            },
            post: {
              connect: {
                id: postId
              }
            }
          });
        }
        return true;
      } catch {
        return false;
      }
    }
  }
};