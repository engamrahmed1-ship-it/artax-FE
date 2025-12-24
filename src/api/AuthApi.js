import { apiClient } from "./apiClient";

const AUTH_API = process.env.REACT_APP_AUTH_ENDPOINT;

export const jwtAuth
=(username,password)=>apiClient.post(AUTH_API,
{username,password}
);


