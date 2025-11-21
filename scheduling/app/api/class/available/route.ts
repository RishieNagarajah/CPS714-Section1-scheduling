import { getAdmin } from "@/lib/firebase/admin";
import { getFirestore } from "firebase-admin/firestore";

export async function GET() {
  const app = getAdmin();
  const firestore = getFirestore(app);

  const classes = await firestore
    .collection('classes')
    .where('startTimestamp', '>=', new Date())
    .get();

  if (classes.empty) {
    return Response.json({ classes: [] }, { status: 200 });
  }

  const availableClasses = classes.docs
    .map(doc => ({ id: doc.id, ...doc.data() }));

  return Response.json({ classes: availableClasses }, { status: 200 });
}