import "../../App.css"
import "./ScheduleByGroup.css"

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ScheduleDivider from "./ScheduleDivider";
import { Tabs, Spin } from "antd";
import { setLoadingSubjects, setGroupForSubjects, fetchSubjectsFromApiSucceed, fetchSubjectsFromApiFailed } from '../../redux/reducers/subjectsByGroupSlice';

const ScheduleByGroup = (props) =>{

    // const [modal, setModal] = useState('');
    // const [groupId, setGroupId] = useState();

    const daysOfTheWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

    const [ loadingPairModeByDays, setLoadingPairModeByDays ] = useState(true);

    const [ selectedDayOfTheWeek, setSelectedDayOfTheWeek ] = useState('Понедельник');

    const [ activeTab, setActiveTab] = useState('Понедельник');

    const [ pairModeByDays, setPairModeByDays ] = useState([{"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}, 
                                                            {"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}, 
                                                            {"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}, 
                                                            {"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}, 
                                                            {"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}, 
                                                            {"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false},]);

    const dispatch = useDispatch();
    const subjectsFromRedux = useSelector(state => state.subjects);


    // TODO: Fetch расписания для выбранного дня (activeTab), сохранение в state
    useEffect(() => {
      console.log(activeTab);
      fetchScheduleByDayAndGroup(activeTab);
    }, [])

    const fetchScheduleByDayAndGroup = (day) => {
      const groupId = props.match.params.groupId;
      if(subjectsFromRedux.subjects[day].length == 0){
        fetch(`http://localhost:3002/schedule/get-schedule-by-day-and-group?day=${day}&group=${groupId}`)
        .then(result => result.json())
        .then(result => {
          dispatch(setLoadingSubjects())
          dispatch(fetchSubjectsFromApiSucceed({day: activeTab, subjects: result.schedule}))
                  let tempPairModeByDays = pairModeByDays;
                  let tempScheduleObject = {};
                  let tempPairMode = 0;
                  
                  subjectsFromRedux.subjects[activeTab].forEach((el, index) => {
                      tempScheduleObject = {};
                      el.items.forEach(el => {
                          tempScheduleObject[el.subgroup + " " + el.weekParity] = {
                              "classroom": el.classroom,
                              "subject": el.subject
                          }
                          if((el.subgroup == 1 || el.subgroup == 2) && (el.weekParity == 0 || el.weekParity == 1)){
                              tempPairMode = 2;
                          }
                          if((el.subgroup == 0) && (el.weekParity == 1 || el.weekParity == 2)){
                              tempPairMode = 1;
                          }
                          if(el.subgroup == 0 && el.weekParity == 2){
                              tempPairMode = 0;
                          }
                      }) 
                      tempPairModeByDays[index].additionalInfo = tempScheduleObject;
                      tempPairModeByDays[index].pairMode = tempPairMode;
                  });

                  setPairModeByDays(tempPairModeByDays)
        }) 
        .then((result) => {
          setLoadingPairModeByDays(false);
          console.log(subjectsFromRedux);
      })
      } 
    }

    const onTabChange = (key) => {
      setActiveTab(key);
      setLoadingPairModeByDays(true);
      fetchScheduleByDayAndGroup(key);
    }

    const switchPairMode = (e, pairNumber) => {
      let pairModeByDaysTemp = pairModeByDays;
      console.log(pairModeByDays)
      let nextPairModeByDaysTemp = pairModeByDaysTemp[pairNumber].pairMode + 1;
      console.log(nextPairModeByDaysTemp)
      
      pairModeByDaysTemp[pairNumber].pairMode++

      if(nextPairModeByDaysTemp == 3){
          pairModeByDaysTemp[pairNumber].pairMode = 0;
          setPairModeByDays(pairModeByDaysTemp);
      }
      else{
          setPairModeByDays(pairModeByDaysTemp);
      }
      
  }

    const apiFetch = (req) => {
      switch(req){
          case 'get-schedule-by-day-and-group': 
              // fetch(API_URL + "/schedule/get-schedule-by-day-and-group?day=Понедельник&group=63e4cdbc826646321ed69199")
              // .then(result => result.json())
              // .then(result => {
                  // setAllPairsByDay(subjectsFromRedux);
                  // //Добавляем в объект pairModeByDays в поле additionalInfo свойства с ID пар (например 1 0, т.е вида subgroup weekParity)
                  let tempPairModeByDays = pairModeByDays;
                  let tempScheduleObject = {};
                  let tempPairMode = 0;
                  
                  subjectsFromRedux.subjects[props.daysOfTheWeek].forEach((el, index) => {
                      tempScheduleObject = {};
                      el.items.forEach(el => {
                          tempScheduleObject[el.subgroup + " " + el.weekParity] = {
                              "classroom": el.classroom,
                              "subject": el.subject
                          }
                          if((el.subgroup == 1 || el.subgroup == 2) && (el.weekParity == 0 || el.weekParity == 1)){
                              tempPairMode = 2;
                          }
                          if((el.subgroup == 0) && (el.weekParity == 1 || el.weekParity == 2)){
                              tempPairMode = 1;
                          }
                          if(el.subgroup == 0 && el.weekParity == 2){
                              tempPairMode = 0;
                          }
                      }) 
                      tempPairModeByDays[index].additionalInfo = tempScheduleObject;
                      tempPairModeByDays[index].pairMode = tempPairMode;
                  });

                  setPairModeByDays(tempPairModeByDays)
                  // setLoadingPairModeByDays(false)
                  // return result
              // })
              // .then((result) => {
              //     console.log(pairModeByDays)
              // })
              // .catch(err => {
              //     console.log(err);
              // })
          break;
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
                    {loadingPairModeByDays ? <Spin/> : <ScheduleDivider selectedDay={selectedDayOfTheWeek} daysOfTheWeek={activeTab} pairModeByDays={pairModeByDays} switchPairMode={switchPairMode}/>}
                  </>
                }, 
                {key: "Вторник",
                 label: "Вторник",
                 children:
                <>
                    {loadingPairModeByDays ? <Spin/> : <ScheduleDivider selectedDay={selectedDayOfTheWeek} daysOfTheWeek={activeTab} pairModeByDays={pairModeByDays} switchPairMode={switchPairMode}/>}
                </>}
                ]}
              />
            </div>
      </div>
    );
  }
  
  export default ScheduleByGroup;