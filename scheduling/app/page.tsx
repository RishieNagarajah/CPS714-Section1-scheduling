import Image from "next/image";
import Schedule from "./AvailableSchedule";
import "./page.css"
import Button from '@mui/material/Button';
import MyClass from "./MyClasses";



export default function Home() {
  return (
    <main>

    <div className="Background">
      
        <div className="Overall">
            <h1 className="Title">
                FitHub Scheduling
            </h1>

            
        </div >

      <div className="ScheduleObject">
      <Schedule/>
      <MyClass/>
      </div>
         </div>
    </main>

  );
}
