import { getAdmin } from "@/lib/firebase/admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";



export async function GET(request: Request) {

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
    const userEnrollments = await firestore
      .collection('enrollments')
      .where('userId', '==', decodedToken.uid)
      .where('status', '==', 'active')
      .get();

    const classIds = userEnrollments.docs.map(doc => doc.data().classId);

    if (classIds.length === 0) {
      return Response.json({ classes: [] }, { status: 200 });
    }
    const classesPromises = classIds.map(classId =>
      firestore.collection('classes').doc(classId).get()
    );
    const classesConfirmations = await Promise.all(classesPromises);

    const enrolledClasses = classesConfirmations
      .filter(doc => doc.exists)
      .map(doc => ({ id: doc.id, ...doc.data() }));

    return Response.json({ classes: enrolledClasses }, { status: 200 });

  } catch (error) {
    console.error('Error fetching enrolled classes:', error);
    return Response.json({ message: 'Internal Server Error', status: 500, error });
  }

}



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
    const body = await request.json();
    const { classId } = body;

    if (!classId) {
      return Response.json(
        { message: 'Class ID is required' },
        { status: 400 }
      );
    }


    const classRef = firestore.collection('classes').doc(classId);
    const classDoc = await classRef.get();


    if (!classDoc.exists) {
      return Response.json({ message: 'Class not found' }, { status: 404 });
    }


    const classData = classDoc.data();
    const totalSeats = classData?.totalSeats || 0;
    const currentSignups = classData?.currentSignups || 0;
    const availableSeats = totalSeats - currentSignups;

    if (availableSeats <= 0) {
      return Response.json(
        { message: "No seats available" },
        { status: 400 }
      );
    }


    const existingEnrollment = await firestore
      .collection('enrollments')
      .where('userId', '==', decodedToken.uid)
      .where('classId', '==', classId)
      .where('status', '==', 'active')
      .get();

    if (!existingEnrollment.empty) {
      return Response.json(
        { message: 'Already enrolled in this class' },
        { status: 400 }
      );
    }


    await firestore.runTransaction(async (transaction) => {
      transaction.update(classRef, {
        currentSignups: currentSignups + 1,
      });


      const enrollmentRef = firestore.collection('enrollments').doc();
      transaction.set(enrollmentRef, {
        userId: decodedToken.uid,
        classId: classId,
        enrolledAt: new Date().toISOString(),
        status: 'active'
      });
    });


    return Response.json(
      {
        message: "Successfully enrolled in class",
        classId: classId,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error enrolling in class:', error);
    return Response.json({ message: 'Internal Server Error', status: 500, error });
  }
}


export async function DELETE(request: Request) {
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
    const body = await request.json();
    const { classId } = body;

    if (!classId) {
      return Response.json(
        { message: 'Class ID is required' },
        { status: 400 }
      );
    }
    const existingEnrollment = await firestore
      .collection("enrollments")
      .where("userId", "==", decodedToken.uid)
      .where("classId", "==", classId)
      .where("status", "==", "active")
      .get();

    if (existingEnrollment.empty) {
      return Response.json(
        { message: "Enrollment not found" },
        { status: 404 }
      );
    }
    const enrollmentDoc = existingEnrollment.docs[0];
    const classRef = firestore.collection("classes").doc(classId);

    await firestore.runTransaction(async (transaction) => {
      const classDoc = await transaction.get(classRef);

      if (!classDoc.exists) {
        throw new Error("Class not found");
      }

      const classData = classDoc.data();
      const currentSignups = classData?.currentSignups || 1;

      transaction.update(classRef, {
        currentSignups: Math.max(currentSignups - 1, 0),
      });

      transaction.delete(enrollmentDoc.ref);
    });

    return Response.json(
      {
        message: "Successfully unenrolled from class",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting enrollment from class:", error);
    return Response.json(
      { message: "Internal Server Error", status: 500, error }
    );
  }
}