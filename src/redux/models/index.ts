import { LocationGeocodedAddress } from "expo-location";

// Category: Category
export interface Category {
  id: string;
  title: string;
  icon: string;
}

// Food Model
export interface FoodModel {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: Number;
  readyTime: Number;
  images: [string];
}

// Restaurant Models
export interface Restaurant {
  _id: string;
  name: string;
  foodType: string;
  address: string;
  phone: string;
  images: string;
  foods: [FoodModel];
}

export interface FoodAvailability {
  categories: [Category];
  restaurants: [Restaurant];
  foods: [FoodModel];
}

export interface UserModel {
  firstName: string;
  lastName: string;
  contactNumber: string;
  token: string;
  verified: boolean;
}

export interface UserState {
  user: UserModel;
  location: LocationGeocodedAddress;
  error: string | undefined;
  Cart: [FoodModel];
  //orders
}

export interface ShoppingState {
  availability: FoodAvailability;
  availableFoods: [FoodModel];
  //other models
}
