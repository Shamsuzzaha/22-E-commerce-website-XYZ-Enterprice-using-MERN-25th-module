import { create } from "zustand";
import axios from "axios";
import { unauthorized } from "../utility/utility.js";

const BASE_URL = import.meta.env.VITE_BASE_URL || process.env.BASE_URL;

const CartStore = create((set) => ({
    isCartSubmit: false,

    CartForm: { productID: "", color: "", size: "" },

    CartFormChange: (name, value) => {
        set((state) => ({
            CartForm: {
                ...state.CartForm,
                [name]: value,
            },
        }));
    },

    CartSaveRequest: async (PostBody, productID, quantity) => {
        try {
            set({ isCartSubmit: true });
            PostBody.productID = productID;
            PostBody.qty = quantity;
            let res = await axios.post(`${BASE_URL}/api/v1/SaveCartList`, PostBody);
            return res.data["status"] === "success";
        } catch (e) {
            unauthorized(e.response.status);
        } finally {
            set({ isCartSubmit: false });
        }
    },

    CartList: null,
    CartCount: 0,
    CartTotal: 0,
    CartVatTotal: 0,
    CartPayableTotal: 0,

    CartListRequest: async () => {
        try {
            let res = await axios.get(`${BASE_URL}/api/v1/CartList`);
            set({ CartList: res.data["data"] });
            set({ CartCount: res.data["data"].length });

            let total = 0;
            res.data["data"].forEach((item) => {
                if (item["product"]["discount"] === true) {
                    total += parseInt(item["qty"]) * parseInt(item["product"]["discountPrice"]);
                } else {
                    total += parseInt(item["qty"]) * parseInt(item["product"]["price"]);
                }
            });

            let vat = total * 0.05;
            let payable = vat + total;

            set({ CartTotal: total });
            set({ CartVatTotal: vat });
            set({ CartPayableTotal: payable });
        } catch (e) {
            unauthorized(e.response.status);
        }
    },

    RemoveCartListRequest: async (cartID) => {
        try {
            set({ CartList: null });
            await axios.post(`${BASE_URL}/api/v1/RemoveCartList`, { _id: cartID });
        } catch (e) {
            unauthorized(e.response.status);
        }
    },
}));

export default CartStore;
