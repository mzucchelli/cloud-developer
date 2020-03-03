import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')
const jwksUrl = process.env.JWKSURL

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', { authorizationToken: event.authorizationToken })
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', { jwtToken })

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/


  // this works currently, but need to implement it to be compatible with the stand
  // see link above for best practice, and strongly consider finding a good way to
  // use the existing library, which is asynchronous but doesn't support await/promises

  let cert_resp = await Axios.get(jwksUrl);
  let certif = cert_resp.data.keys[0].x5c[0];
  certif = certif.replace(/.{64}/g, "$&\r\n")
  if(!certif.match(`\r\n$`)) {
      certif += "\r\n";
  }
  certif = "-----BEGIN CERTIFICATE-----\r\n"+certif+"-----END CERTIFICATE-----";
  let decoded : JwtPayload = verify(token, certif, { algorithms: ['RS256'] }) as JwtPayload;
  return decoded;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
