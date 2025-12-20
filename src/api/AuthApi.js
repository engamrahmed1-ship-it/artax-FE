import { apiClient } from "./apiClient";


export const jwtAuth
=(username,password)=>apiClient.post('/api/authenticate',
{username,password}
);

