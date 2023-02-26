import "../../App.css"
import "./ScheduleByGroup.css"

import { useState } from "react";
import ScheduleDivider from "./ScheduleDivider";

const Groups = () =>{

    // const [modal, setModal] = useState('');
    const daysOfTheWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    const [ selectedDayOfTheWeek, setSelectedDayOfTheWeek ] = useState('Понедельник')

    return (
      <div className="App">
          <div id="header">
            <span className="header-item">Группы</span>
            <span className="header-item active">Расписание групп</span>
            <span className="header-item">Недавние действия</span>
            <span className="header-item">Мой профиль</span>
          </div>
          {/* <div style={{"display": "flex"}}> */}
            <div id="day-choose-block" style={{"display": "inline-block", "width": "30%"}}>
              {/* <span>Выбор дня недели</span> */}
              <div id="day-choose-block-items" style={{"display": "flex"}}>
                {daysOfTheWeek.map(el => {
                  return (<span class={ selectedDayOfTheWeek == el ? "active-day-of-the-week" : ""} style={{"display": "block"}} onClick={() => setSelectedDayOfTheWeek(el)}>
                    {el}
                  </span>)
                })}
              </div>
            </div>
            <div id="schedule-by-group" style={{"display": "inline-block", "width": "70%"}}>
              <ScheduleDivider selectedDay={selectedDayOfTheWeek}/>
            </div>
          {/* </div> */}
          
      </div>
    );
  }
  
  export default Groups;