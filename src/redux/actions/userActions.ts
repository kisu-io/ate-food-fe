import axios from "axios";
import { Dispatch } from "react";
import { BASE_URL } from "../../utils";
import { LocationGeocodedAddress } from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FoodModel, UserModel, OrderModel, OfferModel } from "../models";

export interface UpdateLocationAction {
  readonly type: "ON_UPDATE_LOCATION";
  payload: LocationGeocodedAddress;
}

export interface UserErrorAction {
  readonly type: "ON_USER_ERROR";
  payload: any;
}

export interface UpdateCartAction {
  readonly type: "ON_UPDATE_CART";
  payload: FoodModel;
}

export interface UserLoginAction {
  readonly type: "ON_USER_LOGIN";
  payload: UserModel;
}

export interface CreateOrderAction {
  readonly type: "ON_CREATE_ORDER";
  payload: OrderModel;
}

export interface ViewOrdersAction {
  readonly type: "ON_VIEW_ORDER" | "ON_CANCEL_ORDER";
  payload: [OrderModel];
}

export interface UserLogoutAction {
  readonly type: "ON_USER_LOGOUT";
}
export interface AddRemoveOfferAction {
  readonly type: "ON_ADD_OFFER" | "ON_REMOVE_OFFER";
  payload: OfferModel;
}

export type UserAction =
  | UpdateLocationAction
  | UserErrorAction
  | UpdateCartAction
  | UserLoginAction
  | CreateOrderAction
  | ViewOrdersAction
  | UserLogoutAction
  | AddRemoveOfferAction;

// User Actions Trigger from Components

export const onUpdateLocation = (location: LocationGeocodedAddress) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const locationString = JSON.stringify(location);
      await AsyncStorage.setItem("user_location", locationString);
      // save location in local storage
      dispatch({
        type: "ON_UPDATE_LOCATION",
        payload: location,
      });
    } catch (error) {
      dispatch({
        type: "ON_USER_ERROR",
        payload: error,
      });
    }
  };
};

export const onUpdateCart = (item: FoodModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({
      type: "ON_UPDATE_CART",
      payload: item,
    });
  };
};

export const onUserLogin = (email: string, password: string) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.post<UserModel>(`${BASE_URL}user/login`, {
        email,
        password,
      });

      console.log(response);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "Login Error",
        });
      } else {
        dispatch({
          type: "ON_USER_LOGIN",
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: "ON_USER_ERROR",
        payload: "Login Error",
      });
    }
  };
};

export const onUserSignup = (email: string, phone: string, password: string) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.post<UserModel>(`${BASE_URL}user/create-account`, {
        email,
        phone,
        password,
      });

      console.log(response);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "Login Error",
        });
      } else {
        dispatch({
          type: "ON_USER_LOGIN",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: error,
      });
    }
  };
};

export const onVerifyOTP = (otp: string, user: UserModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      const response = await axios.patch<UserModel>(`${BASE_URL}user/verify`, {
        otp,
      });

      console.log(response);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "User Verification Error",
        });
      } else {
        dispatch({
          type: "ON_USER_LOGIN",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: error,
      });
    }
  };
};

export const onOTPRequest = (user: UserModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      const response = await axios.get<UserModel>(`${BASE_URL}user/otp`);

      console.log(response);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "User Verification Error",
        });
      } else {
        dispatch({
          type: "ON_USER_LOGIN",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: error,
      });
    }
  };
};

export const onCreateOrder = (cartItems: [FoodModel], user: UserModel) => {
  let cart = new Array();
  cartItems.map((item) => {
    cart.push({ _id: item._id, unit: item.unit });
  });

  return async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      const response = await axios.post<OrderModel>(`${BASE_URL}user/create-order`, {
        cart: cart,
      });

      console.log(response);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "User Verification Error",
        });
      } else {
        dispatch({
          type: "ON_CREATE_ORDER",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: error,
      });
    }
  };
};

export const onGetOrders = (user: UserModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      const response = await axios.get<[OrderModel]>(`${BASE_URL}user/order`);

      console.log(response);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "User Verification Error",
        });
      } else {
        dispatch({
          type: "ON_VIEW_ORDER",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: error,
      });
    }
  };
};

export const onCancelOrder = (order: OrderModel, user: UserModel) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      const response = await axios.delete<[OrderModel]>(`${BASE_URL}user/order/${order._id}`);

      console.log(response);

      if (!response) {
        dispatch({
          type: "ON_USER_ERROR",
          payload: "User Verification Error",
        });
      } else {
        dispatch({
          type: "ON_CANCEL_ORDER",
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ON_USER_ERROR",
        payload: error,
      });
    }
  };
};

export const onUserLogout = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      dispatch({
        type: "ON_USER_LOGOUT",
      });
    } catch (error) {
      dispatch({
        type: "ON_USER_ERROR",
        payload: error,
      });
    }
  };
};

export const onApplyOffer = (offer: OfferModel, isRemove: boolean) => {
  return async (dispatch: Dispatch<UserAction>) => {
    if (isRemove) {
      dispatch({
        type: "ON_REMOVE_OFFER",
        payload: offer,
      });
    } else {
      dispatch({
        type: "ON_ADD_OFFER",
        payload: offer,
      });
    }
  };
};
