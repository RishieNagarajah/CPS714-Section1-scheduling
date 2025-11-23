import { getAuth } from "firebase-admin/auth";
import { getAdmin } from "../firebase/admin";

export async function getUidFromRequest(request: Request) {
  const app = getAdmin();
  const auth = getAuth(app);

  const parts = request.headers.get("Authorization")?.split(" ");
  if (!parts || parts[0] !== "Bearer") {
    return '';
  }

  const token = parts[1];
  if (!token) {
    return '';
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    if (!decodedToken.uid) {
      return '';
    }
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return '';
  }
}