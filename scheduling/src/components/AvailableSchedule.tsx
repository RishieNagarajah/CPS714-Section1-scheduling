'use client';

import { ClassData, formatSchedule } from '@/helpers';
import Button from '@mui/material/Button';


export default function Schedule(props: {
  classes: ClassData[],
  action: (classId: string) => Promise<void>,
}) {

  return (<div className="ClassList col-8">
    <div className='container'>
      <div className='row'>
        <h2 className='col'>
          List of Available Classes
        </h2>
      </div>
      <div className='row'>
        <div className='col container'>
          {props.classes.length === 0
            ?
            <p className='text-center text-secondary'>No available classes at the moment.</p>
            :
            props.classes.map((c) => (
              <div className='row py-2 my-2 align-items-center border border-dark-subtle rounded-2' key={c.title}>
                <div className='col container align-items-start text-secondary'>
                  <h4 className='m-0 text-dark'>{c.title}</h4>
                  <p className='m-0'>{formatSchedule(c.startTimestamp, c.endTimestamp)}</p>
                  <p className='m-0'>Instructor: {c.instructor}</p>
                </div>
                <div className='col-3 d-flex flex-column align-items-end'>
                  <Button className='p-0 px-2' variant="outlined" color='success' onClick={() => props.action(c.id)}>
                    Join Class
                  </Button>
                  <p className='m-0'>Signups: {c.currentSignups}/{c.totalSeats}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
  )
}