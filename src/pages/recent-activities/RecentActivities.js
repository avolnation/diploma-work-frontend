import "../../App.css"
import "./RecentActivities.css"
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import moment from "moment/moment";

import { useEffect, useState } from "react";

const RecentActivities = () => {

    const localhost_url = "http://localhost:3002/";

    const [lastActivities, setLastActivities] = useState([]);

    const getLastActivities = () => {
        fetch( localhost_url + "attend/last-attendances")
        .then(result => result.json())
        .then(result => {
            setLastActivities(result.attendances)
        })
    }

    useEffect(() => {
        getLastActivities()
    }, [])


    return (
      <div className="App">
          <div id="header">
            <span className="header-item">Группы</span>
            <span className="header-item">Расписание групп</span>
            <span className="header-item active">Недавние действия</span>
            <span className="header-item">Мой профиль</span>
          </div>
          <div id="recent-activities-block">
            {lastActivities.length == 0 
            ? <span>Нет последних посещений. Возможно, нет связи с сервером</span> 
            : lastActivities.map(el => {
                return <div className="recent-activities-block-items">{el.recordType == "in" ? <LoginOutlined style={{"fontSize": "50px"}}/> : <LogoutOutlined style={{"fontSize": "50px"}}/>}<span>{el.student.surname + " " + el.student.name + ", " + el.student.group.title + (el.recordType == "in" ? " вошёл, " : " вышел, ") + moment(+el.date, "x").calendar()}</span></div>
            }) }
          </div>
      </div>
    );
  }
  
  export default RecentActivities;