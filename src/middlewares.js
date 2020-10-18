export const isAuthenticated = request => {
    if (!request.user){ // request에 담긴 user객체의 여부에 따라서 로그인 인증 여부 판단
        throw Error("You need to log in to perform this action");
    }
    return;
};