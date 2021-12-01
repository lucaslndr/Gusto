import { ip } from "./config.js";
import requester from "./requester";

import loginData from "./fakeData/login";
import logoutData from "./fakeData/logout";
import getInfoData from "./fakeData/getInfo";
import getFridgesData from "./fakeData/getFridgesData";
import getProductsInFridgeData from "./fakeData/getProductsInFridgeData";
import getMenusInFridgeData from "./fakeData/getMenusInFridgeData";
import addProductsInFridgeData from "./fakeData/addProductsInFridgeData";
import addMenusInFridgeData from "./fakeData/addMenusInFridgeData";
import getAllProductsData from "./fakeData/getAllProductsData";
import getAllMenusData from "./fakeData/getAllMenusData";

const API = function ({ url, authToken, fake }) {
  this.fake = fake == undefined ? true : fake;
  this.url = this.url
    ? url
    : this.fake
    ? "https://jsonplaceholder.typicode.com"
    : ip;
  this.authToken = authToken ? authToken : null;
  this.requester = requester(this);
};

// ---------- auth ---------- //

API.prototype.login = function ({ body } = {}) {
  if (this.fake) return loginData;
  return this.requester({
    method: "POST",
    path: "/api/user/login",
    body,
  });
};

API.prototype.logout = async function ({} = {}) {
  if (this.fake) return logoutData;
  const res = await this.requester({ method: "GET", path: "/api/user/logout" });
  return res;
};

API.prototype.getInfo = async function ({} = {}) {
  if (this.fake) return getInfoData;
  const res = await this.requester({ method: "GET", path: "/me/info" });
  return res;
};

// ---------- fridge ---------- //

API.prototype.getFridges = function ({} = {}) {
  if (this.fake) return getFridgesData;
  return this.requester({
    method: "GET",
    path: "/fridges",
  });
};

API.prototype.getProductsInFridge = function ({ id } = {}) {
  if (this.fake) return getProductsInFridgeData;
  return this.requester({
    method: "GET",
    path: `/fridges/${id}/products`,
  });
};

API.prototype.getMenusInFridge = function ({ id } = {}) {
  if (this.fake) return getMenusInFridgeData;
  return this.requester({
    method: "GET",
    path: `/fridges/${id}/menus`,
  });
};

API.prototype.addProductsInFridge = function ({ id, body } = {}) {
  if (this.fake) return addProductsInFridgeData;
  return this.requester({
    method: "POST",
    path: `/fridges/${id}/products`,
    body
  });
};

API.prototype.addMenusInFridge = function ({ id, body } = {}) {
  if (this.fake) return addMenusInFridgeData;
  return this.requester({
    method: "POST",
    path: `/fridges/${id}/menus`,
    body
  });
};

API.prototype.getAllProducts = function ({ } = {}) {
  if (this.fake) return getAllProductsData;
  return this.requester({
    method: "GET",
    path: `/products`,
  });
};

API.prototype.getAllMenus = function ({ } = {}) {
  if (this.fake) return getAllMenusData;
  return this.requester({
    method: "GET",
    path: `/menus`,
  });
};

// ---------- users ---------- //

API.prototype.getUsers = async function ({}) {
  const res = await this.requester({ method: "GET", path: "/users" });
  return res;
};

API.prototype.createUser = async function ({ body }) {
  const res = await this.requester({ method: "POST", path: "/users", body });
  return res;
};

API.prototype.getOneUser = async function ({ id }) {
  const res = await this.requester({ method: "GET", path: `/users/${id}` });
  return res;
};

API.prototype.updateOneUser = async function ({ id, body }) {
  const res = await this.requester({
    method: "POST",
    path: `/users/${id}`,
    body,
  });
  return res;
};

API.prototype.deleteOneUser = async function ({ id }) {
  const res = await this.requester({ method: "DELETE", path: `/users/${id}` });
  return res;
};

export default new API({ fake: true });