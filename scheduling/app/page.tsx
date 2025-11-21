'use client';

import NavigationBar from "@/components/Navbar";
import MyClass from "@/components/MyClasses";
import Schedule from "@/components/AvailableSchedule";
import { ClassData } from "@/helpers";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { HTTP_METHOD } from "next/dist/server/web/http";

export default function Home() {
  const [enrolledList, setEnrolledList] = useState<ClassData[]>([]);
  const [availableList, setAvailableList] = useState<ClassData[]>([]);

  const fetchClasses = async (endpoint: string, setFunction: Dispatch<SetStateAction<ClassData[]>>, controller?: AbortController) => {
    fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
      signal: controller?.signal
    })
      .then(response => response.json())
      .then(data => {
        if (data.classes) {
          setFunction(data.classes);
        }
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchClasses("api/class", setEnrolledList, controller);
    fetchClasses("api/class/available", setAvailableList, controller);
    return () => { controller.abort(); };
  }, []);

  const classActionFactory = (method: HTTP_METHOD) => {
    return async (classId: string) => {
      fetch('/api/class', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ classId }),
      })
        .then(response => {
          if (response.ok) {
            fetchClasses("api/class", setEnrolledList);
            fetchClasses("api/class/available", setAvailableList);
          } else {
            return response.json().then(data => {
              alert(`Failed to ${method} class: ${data.message}`);
            });
          }
        })
        .catch(error => {
          console.error(`Error ${method}ing class:`, error);
        });
    };
  };

  return (
    <main>

      <div className="Background">
        <NavigationBar />
        <div className="ScheduleObject container">
          <div className="row">
            <Schedule classes={availableList} action={classActionFactory('POST')} />
            <MyClass classes={enrolledList} action={classActionFactory('DELETE')} />
          </div>
        </div>
      </div>
    </main>

  );
}
