// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'wtn947ddc8'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-fh8nyria.auth0.com',            // Auth0 domain
  clientId: 'ReUPQpzuiKN3waX3T1W6mzFAxIVV8303',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

// login url 
// https://dev-fh8nyria.auth0.com/authorize?response_type=token&client_id=ReUPQpzuiKN3waX3T1W6mzFAxIVV8303&redirect_uri=http://localhost:3000/callback&state=23324random
