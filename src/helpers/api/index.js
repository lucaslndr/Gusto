import { ip } from "./config.js";
import requester from "./requester";

const API = function ({ url, authToken, fake }) {
  this.fake = fake == undefined ? true : fake;
  this.url = this.url
    ? url
    : this.fake
    ? "https://jsonplaceholder.typicode.com"
    : ip;
    console.log("url : ", this.url)
  this.authToken = authToken ? authToken : null;
  this.requester = requester(this);
};

// ---------- auth ---------- //

API.prototype.login = async function ({ body, err } = {}) {
  if (this.fake & !err) return require("helpers/api/fakeData/login.json");
  else if (this.fake & err)
    return require("helpers/api/fakeData/login_err.json");
  const res = await this.requester({ method: "POST", path: "/", body });
  return res;
};

API.prototype.logout = async function ({ err } = {}) {
  if (this.fake & !err) return require("helpers/api/fakeData/logout.json");
  else if (this.fake & err)
    return require("helpers/api/fakeData/logout_err.json");
  const res = await this.requester({ method: "GET", path: "/" });
  return res;
};

API.prototype.getMyInfo = async function ({ body } = {}) {
  const res = await this.requester({ method: "GET", path: "/auth/me", body });
  return res;
};

// ---------- users ---------- //

API.prototype.getUsers = async function ({}) {
  const res = await this.requester({ method: "GET", path: "/users" });
  return res;
};

API.prototype.createUser = async function ({ body }) {
  if (this.fake)
    return {
      success: 1,
      userCreated: {
        id: 1,
        username: "luky",
        phoneNumber: "0607080910",
      },
      token: "bhsbhjs",
    };
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

export default API;
