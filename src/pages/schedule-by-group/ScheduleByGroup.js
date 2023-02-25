import "../../App.css"

import { useState } from "react";
import ScheduleDivider from "./ScheduleDivider";

const Groups = () =>{

    const [modal, setModal] = useState('');

    
    return (
      <div className="App">
          <div id="header">
            <span className="header-item">Группы</span>
            <span className="header-item active">Расписание групп</span>
            <span className="header-item">Недавние действия</span>
            <span className="header-item">Мой профиль</span>
          </div>
          <div id="schedule-by-group">
            <ScheduleDivider/>
          </div>
      </div>
    );
  }
  
  export default Groups;