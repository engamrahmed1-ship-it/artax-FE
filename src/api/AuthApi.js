import { apiClient } from "./apiClient";


export const jwtAuth
=(username,password)=>apiClient.post('/authenticate',
{username,password}
);

