
export const ORDER_API_ROUTES ={
    POST:{
         CREATE_ORDER :"/order",
         DELTE_ORDER :"/order/deleteOrder",
         CANCEL_ORDER :'/order/cancelled',
         RESTORE_ORDER:'/order/restored',
         MANAGE_ORDER :'/order/action'
    },
    GET:{
        MY_ORDERS:"/order/userOrders",
        MANAGE_ORDER:"/order/getOrdersToManage"
    },
    PUT:{
        COMPLETE_ORDER: "/order/processed", 
    },
   
}