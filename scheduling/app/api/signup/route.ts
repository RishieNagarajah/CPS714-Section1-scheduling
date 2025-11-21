import { getAdmin } from "@/lib/firebase/admin";
import { getUidFromRequest } from "@/lib/server/idToken";
import { getFirestore } from "firebase-admin/firestore";

export async function POST(request: Request) {
  const app = getAdmin();
  const firestore = getFirestore(app);

  const uid = await getUidFromRequest(request);
  if (!uid) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await firestore.collection('users').doc(uid).create({
      membershipStatus: 'standard',
      createdAt: new Date(),
    });

    return new Response('User profile created', { status: 201 });
  } catch (error) {
    console.error('Error creating user profile:', error);
    return Response.json({ message: 'Internal Server Error', status: 500, error });
  }
}