export const authAwsCognito = `
// Import AWS SDK and JWT library
import { CognitoJwtVerifier } from "aws-jwt-verify";

// Initialize Cognito JWT Verifier with your User Pool ID and Client ID
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "id", // or "access" depending on the token type you're verifying
  clientId: process.env.COGNITO_CLIENT_ID,
});

// Function to authenticate user with AWS Cognito
const authenticateUser = async (event) => {
  try {
    // Extract the token from Authorization header
    const token = event.headers.Authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Authorization token missing');
    }

    // Verify the token with AWS Cognito
    const payload = await verifier.verify(token);
    
    // Return the verified user data
    return payload;
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw new Error('Unauthorized');
  }
};
      
// Authenticate with AWS Cognito
const user = await authenticateUser(event);
`
