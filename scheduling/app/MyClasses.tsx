import "./MyClasses.css"
import Button from '@mui/material/Button';


const classes= [
    { date: "Thursday Oct 2nd, 2–4pm", className: "Yoga Class", instructor: "Sai Yogesh", Description:" This is a fun class so tell everyone to sign up if they can or if they have the capcity too do so",Signups:5, Limit:20 },
    { date: "Friday Oct 10th, 5–6pm", className: "Intro to Kickboxing", instructor: "Alex Pereira", Description:" This is a fun class so tell everyone to sign up if they can or if they have the capcity too do so",Signups:5, Limit:20 },
    { date: "Wednesday Oct 11th, 5–6pm", className: "Zumba", instructor: "Alejandra Garcia" , Description:" This is a fun class so tell everyone to sign up if they can or if they have the capcity too do so",Signups:5, Limit:20},
    { date: "Monday Oct 20th, 4–7pm", className: "Basketball Tournament", instructor: "LeBron James" , Description:" This is a fun class so tell everyone to sign up if they can or if they have the capcity too do so",Signups:5, Limit:20},
    { date: "Friday Nov 1st, 2–4pm", className: "Mental Health & Fitness", instructor: "James David" , Description:" This is a fun class so tell everyone to sign up if they can or if they have the capcity too do so",Signups:5, Limit:20},
]

export default function MyClass() {
    return(

    <div className="MyClass">
        <table>
          <thead>
            <tr>
              <th>
              My Classes
              </th>
              </tr>
          </thead>
          <tbody>
          {classes.map((c) => (
            <tr key={c.className}>
              <td>
                <h2>{c.className}</h2>
                <p>{c.date}</p>
                <p>Instructor: {c.instructor}</p>
                <p id="description">Description: {c.Description}</p>
                <p></p>
                <p>Signups: {c.Signups}/{c.Limit}</p>
                {/* <button type="button">Join Class</button> */}
                <div className="JoinButton ">
                <Button variant="contained"   sx={{
                  backgroundColor: "#ff0000ff",
                  color: "white",
                    "&:hover": {
                      backgroundColor: "#79090cff",
                    },
                  }}>Cancel Class
                </Button>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
    </div>
    
        )
}