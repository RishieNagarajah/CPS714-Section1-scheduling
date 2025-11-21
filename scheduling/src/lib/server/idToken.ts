import { getAuth } from "firebase-admin/auth";
import { getAdmin } from "../firebase/admin";

export async function getUidFromRequest(request: Request) {
  const app = getAdmin();
  const auth = getAuth(app);

  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return '';
  }
  const decodedToken = await auth.verifyIdToken(token);
  if (!decodedToken.uid) {
    return '';
  }
  return decodedToken.uid;
}