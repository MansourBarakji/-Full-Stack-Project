
export const USER_API_ROUTES ={
    POST:{
        REGISTER_USER:"/user/register",
        LOGIN_USER:"/user/login",
        VERIFY_USER: "/user/verify",
        RESET_PASS :"/user/resetPassword",
        SEND_EMAIL: "/user/sendResetPasswordEmail",
    },
    GET:{
        PROFILE_USER:"/user/profile",
       
    },
    PUT:{
        EDIT_USER: "/user/editProfile", 
    }
}