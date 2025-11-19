import Button from '@mui/material/Button';


const classes = [
  { date: "Thursday Oct 2nd, 2–4pm", className: "Yoga Class", instructor: "Sai Yogesh", Description: " This is a fun class so tell everyone to sign up if they can or if they have the capcity too do so", Signups: 5, Limit: 20 },
  { date: "Friday Oct 10th, 5–6pm", className: "Intro to Kickboxing", instructor: "Alex Pereira", Description: " This is a fun class so tell everyone to sign up if they can or if they have the capcity too do so", Signups: 5, Limit: 20 },
  { date: "Wednesday Oct 11th, 5–6pm", className: "Zumba", instructor: "Alejandra Garcia", Description: " This is a fun class so tell everyone to sign up if they can or if they have the capcity too do so", Signups: 5, Limit: 20 },
  { date: "Monday Oct 20th, 4–7pm", className: "Basketball Tournament", instructor: "LeBron James", Description: " This is a fun class so tell everyone to sign up if they can or if they have the capcity too do so", Signups: 5, Limit: 20 },
  { date: "Friday Nov 1st, 2–4pm", className: "Mental Health & Fitness", instructor: "James David", Description: " This is a fun class so tell everyone to sign up if they can or if they have the capcity too do so", Signups: 5, Limit: 20 },
]

export default function Schedule() {
  return (<div className="ClassList col-8">
      <div className='container'>
        <div className='row'>
          <h2 className='col'>
            List of Available Classes
          </h2>
        </div>
        <div className='row'>
          <div className='col container'>
            {classes.map((c) => (
              <div className='row py-2 my-2 align-items-center border border-dark-subtle rounded-2' key={c.className}>
                <div className='col container align-items-start text-secondary'>
                  <h4 className='m-0 text-dark'>{c.className}</h4>
                  <p className='m-0'>{c.date}</p>
                  <p className='m-0'>Instructor: {c.instructor}</p>
                </div>
                <div className='col-3 d-flex flex-column align-items-end'>
                  <Button className='p-0 px-2' variant="outlined" color='success'>
                    Join Class
                  </Button>
                  <p className='m-0'>Signups: {c.Signups}/{c.Limit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    // <div className="ClassList col-8">
    //   <table>
    //     <thead>
    //       <tr>
    //         <th>
    //           List of Available Classes
    //         </th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {classes.map((c) => (
    //         <tr key={c.className}>
    //           <td>
    //             <h2>{c.className}</h2>
    //             <p>{c.date}</p>
    //             <p>Instructor: {c.instructor}</p>
    //             <p id="description">Description: {c.Description}</p>
    //             <p></p>
    //             <p>Signups: {c.Signups}/{c.Limit}</p>
    //             {/* <button type="button">Join Class</button> */}
    //             <div className="JoinButton ">
    //               <Button variant="contained" sx={{
    //                 backgroundColor: "#00d736ff",
    //                 color: "white",
    //                 "&:hover": {
    //                   backgroundColor: "#33ff36ff",
    //                 },
    //               }}>Join Class
    //               </Button>
    //             </div>
    //             {/* <button>Cancel Class</button> */}
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
  )
}