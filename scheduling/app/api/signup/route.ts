import { getAdmin } from "@/lib/firebase/admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export async function POST(request: Request) {
  const app = getAdmin();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const decodedToken = await auth.verifyIdToken(token);

  if (!decodedToken.uid) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await firestore.collection('users').doc(decodedToken.uid).create({
      membershipStatus: 'standard',
      createdAt: new Date(),
    });

    return new Response('User profile created', { status: 201 });
  } catch (error) {
    console.error('Error creating user profile:', error);
    return Response.json({ message: 'Internal Server Error', status: 500, error });
  }
}