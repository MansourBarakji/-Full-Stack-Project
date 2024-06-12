import Axios from "../lib/axios";
import { ORDER_API_ROUTES } from "./routes";

const completeOrder = async (data = {}) => {
  const res = await Axios.put(ORDER_API_ROUTES.PUT.COMPLETE_ORDER , data);
  return res.data;
};

const deleteOrder = async (id) => {
  const res = await Axios.post(ORDER_API_ROUTES.POST.DELTE_ORDER, { id });
  return res.data;
};

const cancelOrder = async (id) => {
  const res = await Axios.post(ORDER_API_ROUTES.POST.CANCEL_ORDER, { id });
  return res.data;
};
const restoreOrder = async (id) => {
  const res = await Axios.post(ORDER_API_ROUTES.POST.RESTORE_ORDER, { id });
  return res.data;
};

const createOrder = async (data = {}) => {
  const res = await Axios.post(ORDER_API_ROUTES.POST.CREATE_ORDER, data);
   return res.data;
 };

 const manageOrder = async (data = {}) => {
  const res = await Axios.post(ORDER_API_ROUTES.POST.MANAGE_ORDER, data );
  return res.data;
}; 
 
 const getMyOrders = async () => {
  const res = await Axios.get(ORDER_API_ROUTES.GET.MY_ORDERS);
   return res.data;
 };

 const getOrdersToManage = async () => {
  const res = await Axios.get(ORDER_API_ROUTES.GET.MANAGE_ORDER);
   return res.data;
 };


const orderApi = {
   createOrder,
   completeOrder,
   getMyOrders,
   deleteOrder,
   cancelOrder,
   restoreOrder,
   getOrdersToManage,
   manageOrder
};
export default orderApi;
