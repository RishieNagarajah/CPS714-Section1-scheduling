import { getAdmin } from "@/lib/firebase/admin";
import { getUidFromRequest } from "@/lib/server/idToken";
import { getFirestore } from "firebase-admin/firestore";
import { documentId } from "firebase/firestore";

export async function GET(request: Request) {
  const app = getAdmin();
  const firestore = getFirestore(app);

  const uid = await getUidFromRequest(request);
  if (!uid) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const userEnrollments = await firestore
      .collection(`users/${uid}/enrollments`)
      .where('status', '==', 'active')
      .get();

    const classIds = userEnrollments.docs.map(doc => doc.data().classId);

    if (classIds.length === 0) {
      return Response.json({ classes: [] }, { status: 200 });
    }

    let classes;

    if (classIds.length > 30) {
      const batches = [];
      for (let i = 0; i < classIds.length; i += 30) {
        const batch = classIds.slice(i, i + 30);
        batches.push(
          firestore
            .collection('classes')
            .where(documentId(), 'in', batch)
            .get()
        );
      }

      classes = (await Promise.all(batches)).flatMap(snapshot => snapshot.docs);
    }

    classes = (await firestore
      .collection('classes')
      .where(documentId(), 'in', classIds)
      .get()).docs;

    const enrolledClasses = classes
      .map(doc => ({ id: doc.id, ...doc.data() }));

    return Response.json({ classes: enrolledClasses }, { status: 200 });
  } catch (error) {
    console.error('Error fetching enrolled classes:', error);
    return Response.json({ message: 'Internal Server Error', status: 500, error });
  }
}

export async function POST(request: Request) {
  const app = getAdmin();
  const firestore = getFirestore(app);

  const uid = await getUidFromRequest(request);
  if (!uid) {
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
      .collection(`users/${uid}/enrollments`)
      .where('classId', '==', classId)
      .where('status', '==', 'active')
      .get();

    if (!existingEnrollment.empty) {
      return Response.json(
        { message: 'Already enrolled in this class' },
        { status: 400 }
      );
    }

    const timestamp = new Date();

    await firestore.runTransaction(async (transaction) => {
      transaction.update(classRef, {
        currentSignups: currentSignups + 1,
      });

      const enrollmentRef = firestore.collection(`users/${uid}/enrollments`).doc(classId);
      transaction.set(enrollmentRef, {
        enrolledAt: timestamp,
        status: 'active'
      });
    });


    return Response.json(
      {
        message: "Successfully enrolled in class",
        classId: classId,
        enrolledAt: timestamp.toISOString(),
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
  const firestore = getFirestore(app);

  const uid = await getUidFromRequest(request);
  if (!uid) {
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
      .doc(`users/${uid}/enrollments/${classId}`)
      .get();

    if (!existingEnrollment.exists) {
      return Response.json(
        { message: "Enrollment not found" },
        { status: 400 }
      );
    }

    const classDoc = await firestore.doc(`classes/${existingEnrollment.id}`).get();

    if (classDoc.exists === false) {
      return Response.json(
        { message: "Class not found" },
        { status: 500 }
      );
    }

    await firestore.runTransaction(async (transaction) => {
      const classData = classDoc.data();
      const currentSignups = classData?.currentSignups || 1;

      transaction.update(classDoc.ref, {
        currentSignups: Math.max(currentSignups - 1, 0),
      });

      transaction.delete(existingEnrollment.ref);
    });

    return Response.json(
      { message: "Successfully unenrolled from class" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting enrollment from class:", error);
    return Response.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}