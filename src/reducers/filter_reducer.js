import { act } from "react-dom/test-utils";
import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    let maxPrice = action.payload.map((product) => product.price);
    maxPrice = Math.max(...maxPrice);
    return {
      ...state,
      filtered_products: [...action.payload],
      all_products: [...action.payload],
      filters: {
        ...state.filters,
        price: maxPrice,
        max_price: maxPrice,
      },
    };
  }
  if (action.type === SET_LISTVIEW) {
    console.log(action.type);
    return {
      ...state,
      grid_view: false,
    };
  }

  if (action.type === SET_GRIDVIEW) {
    return {
      ...state,
      grid_view: true,
    };
  }

  if (action.type === UPDATE_SORT) {
    return {
      ...state,
      sort: action.payload,
    };
  }

  if (action.type === SORT_PRODUCTS) {
    const { sort, filtered_products } = state;

    let tempProducts = [...filtered_products];
    if (sort === "price-lowest") {
      tempProducts = tempProducts.sort((a, b) => a.price - b.price);
    }
    if (sort === "price-highest") {
      tempProducts = tempProducts.sort((a, b) => b.price - a.price);
    }
    if (sort === "name-a") {
      tempProducts = tempProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "name-z") {
      tempProducts = tempProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
    return {
      ...state,
      filtered_products: tempProducts,
    };
  }
  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    return {
      ...state,
      filters: { ...state.filters, [name]: value },
    };
  }
  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    let tempProducts = [...all_products];
    const { text, category, company, color, price, shipping } = state.filters;
    //Search Input filter
    if (text) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().startsWith(text)
      );
    }
    //filtering with category
    if (category !== "all") {
      tempProducts = tempProducts.filter(
        (product) => product.category === category
      );
    }

    // filtering with company
    if (company !== "all") {
      tempProducts = tempProducts.filter(
        (product) => product.company === company
      );
    }

    //filtering with colors
    if (color !== "all") {
      tempProducts = tempProducts.filter((product) =>
        product.colors.find((col) => col.color)
      );
    }

    //filtering with price property
    tempProducts = tempProducts.filter((product) => product.price <= price);

    //filtering products which has free shipping
    if (text) {
      tempProducts = tempProducts.filter(
        (product) => (product.shipping = true)
      );
    }

    return {
      ...state,
      filtered_products: tempProducts,
    };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        text: "",
        company: "all",
        category: "all",
        color: "all",
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }
};

export default filter_reducer;
