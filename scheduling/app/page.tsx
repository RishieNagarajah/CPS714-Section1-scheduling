import NavigationBar from "@/components/Navbar";
import MyClass from "@/components/MyClasses";
import Schedule from "@/components/AvailableSchedule";

export default function Home() {
  return (
    <main>

      <div className="Background">
        <NavigationBar />
        <div className="ScheduleObject container">
          <div className="row">
            <Schedule />
            <MyClass />
          </div>
        </div>
      </div>
    </main>

  );
}
