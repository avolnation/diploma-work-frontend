import "../../App.css"
import "./ScheduleByGroup.css"

import { useEffect, useState } from "react";
import ScheduleDivider from "./ScheduleDivider";
import { Tabs } from "antd";

const Groups = () =>{

    // const [modal, setModal] = useState('');
    const daysOfTheWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    const [ selectedDayOfTheWeek, setSelectedDayOfTheWeek ] = useState('Понедельник')
    const [ activeTab, setActiveTab] = useState('Понедельник')

    useEffect(() => {
      console.log(activeTab)
    }, [])

    const onTabChange = (key) => {
      setActiveTab(key);
      switch(key){
        case 'Понедельник': 
        case 'Вторник': 
        case 'Среда': 
        case 'Четверг': 
        case 'Пятница': 
        case 'Суббота': 
      }
    } 

    return (
      <div className="App">
          <div id="header">
            <span className="header-item">Группы</span>
            <span className="header-item active">Расписание групп</span>
            <span className="header-item">Недавние действия</span>
            <span className="header-item">Мой профиль</span>
          </div>
          {/* <div style={{"display": "flex"}}> */}
            <div id="day-choose-block" style={{"display": "inline-block", "width": "30%", "height": "500px"}}>
              <Tabs
                size="large"
                tabPosition="left"
                activeKey={activeTab}
                onChange={onTabChange}
                defaultActiveKey="Понедельник"
                items={[{
                  key: 'Понедельник', 
                  label: 'Понедельник',
                  children: 
                  <>
                    <ScheduleDivider selectedDay={selectedDayOfTheWeek} daysOfTheWeek={daysOfTheWeek}/>
                  </>
                }
                ]}
              />

            </div>
          {/* </div> */}
          
      </div>
    );
  }
  
  export default Groups;