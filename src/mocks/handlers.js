import { http, HttpResponse } from 'msw';

// This is a fake JWT. You can create one at jwt.io to match your needs.
// This token has roles: ['user', 'admin']
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWRtaW4gVXNlciIsImVtYWlsIjoiYWRtaW5AdGVzdC5jb20iLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidXNlciIsImFkbWluIl19fQ.fake-signature';

// This token has only the 'user' role
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSmFuZSBEb2UiLCJlbWFpbCI6InVzZXJAdGVzdC5jb20iLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidXNlciJdfX0.fake-signature';


export const handlers = [
  // Handle the authentication request
  http.post('http://localhost:8080/api/authenticate', async ({ request } ) => {
    const { username } = await request.json();

    // Simulate different users based on username
    if (username === 'admin') {
      return HttpResponse.json({ token: adminToken });
    }
    
    if (username === 'user') {
      return HttpResponse.json({ token: userToken });
    }

    // Simulate failed login
    return new HttpResponse(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }),
];
