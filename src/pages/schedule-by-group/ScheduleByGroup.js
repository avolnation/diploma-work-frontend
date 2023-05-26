import "../../App.css"
import "./ScheduleByGroup.css"

import { useEffect, useState, useForm } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ScheduleDivider from "./ScheduleDivider";
import { Button, Modal, Input, Form, Radio, Select, Tabs, Spin, Skeleton } from "antd";
import { setLoadingSubjects, setGroupForSubjects, fetchSubjectsFromApiSucceed, fetchSubjectsFromApiFailed, setPairModeByDaysV2, fetchSubjectsByGroupIdAndDay } from '../../redux/reducers/subjectsByGroupSlice';
import { setLoadingGroups, fetchGroupsFromApiSucceed, fetchGroupsFromApiFailed } from '../../redux/reducers/groupsSlice';

const ScheduleByGroup = (props) =>{

    const API_URL = 'http://localhost:3002'

    const [ loadingPairModeByDays, setLoadingPairModeByDays ] = useState(true);

    const [ activeTab, setActiveTab] = useState('Понедельник');

    const daysOfTheWeek =  [{value: 'Понедельник', title: 'Понедельник'}, 
                            {value: 'Вторник', title: 'Вторник'}, 
                            {value: 'Среда', title: 'Среда'}, 
                            {value: 'Четверг', title: 'Четверг'}, 
                            {value: 'Пятница', title: 'Пятница'}, 
                            {value: 'Суббота', title: 'Суббота'}]

    const [ pairModeByDays, setPairModeByDays ] = useState([{"pairMode": 0, "additionalInfo": {},}, 
                                                            {"pairMode": 0, "additionalInfo": {},}, 
                                                            {"pairMode": 0, "additionalInfo": {},}, 
                                                            {"pairMode": 0, "additionalInfo": {},}, 
                                                            {"pairMode": 0, "additionalInfo": {},}, 
                                                            {"pairMode": 0, "additionalInfo": {},},]);


    const dispatch = useDispatch();
    const subjectsFromRedux = useSelector(state => state.subjects);


    // TODO: Fetch расписания для выбранного дня (activeTab), сохранение в state
    useEffect(() => {
      // console.log(activeTab);
      fetchScheduleByDayAndGroup(activeTab);
      translatePairModeByDays();
    }, [])


    useEffect(() => {
        apiFetch('get-all-groups');
        apiFetch('get-subjects-by-group-id');
    }, [])

    useEffect(() => {

      if(!(subjectsFromRedux.subjects[activeTab].length >= 1)){
        fetchScheduleByDayAndGroup(activeTab);

        setLoadingPairModeByDays(true);
      }
    }, [activeTab])

    useEffect(() => {
      translatePairModeByDays();
      console.log('Changed')
    }, [subjectsFromRedux.subjects[activeTab]])

    const apiFetch = (req) => {
      switch(req){
          case 'get-all-groups': 
          fetch(API_URL + "/groups/get-all-groups")
          .then(result => result.json())
          .then(result => {
              let groupsToSet = result.groups.map(el => {
                  return {
                      value: el._id,
                      label: el.title
                  }
              })
              dispatch(fetchGroupsFromApiSucceed(groupsToSet));
          })
          .catch(err => {
              console.log(err);
              
          })
          break;
          case 'get-subjects-by-group-id':
              fetch(API_URL + "/subjects/get-subjects-by-group/" + props.match.params.groupId)
              .then(result => result.json())
              .then(result => {
                  let subjectsToSet = result.subjects.map(el => {
                      return {
                          value: el._id,
                          label: `${el.title} (${el.abbreviature})`
                      }
                  })
                  dispatch(setGroupForSubjects(subjectsToSet))
              })
      }
  }

  const translatePairModeByDays = () => {

    setLoadingPairModeByDays(true)

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

      dispatch(setLoadingSubjects(true))

      setPairModeByDays([...tempPairModeByDays])

      setLoadingPairModeByDays(false);

      dispatch(setLoadingSubjects(false))
  }

    const fetchScheduleByDayAndGroup = (day) => {
          const groupId = props.match.params.groupId;
          dispatch(setLoadingSubjects());
          dispatch(fetchSubjectsByGroupIdAndDay({groupId, day}));             
    }

    const onTabChange = (key) => {
      setActiveTab(key);
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

    return (
      <>
        <div className="App">
          <div id="day-choose-block" style={{"display": "inline-block", "width": "30%", "height": "500px", "marginTop": "16px"}}>
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
                  {loadingPairModeByDays ? <Skeleton active/> : <ScheduleDivider selectedDay={activeTab} pairModeByDays={pairModeByDays} switchPairMode={switchPairMode} groupId={props.match.params.groupId} daysOfTheWeek={daysOfTheWeek}/>}
                </>
              }, 
              {key: "Вторник",
                label: "Вторник",
                children:
              <>
                  {loadingPairModeByDays ? <Skeleton active/> : <ScheduleDivider selectedDay={activeTab} pairModeByDays={pairModeByDays} switchPairMode={switchPairMode} groupId={props.match.params.groupId}/>}
              </>}
              ]}
            />
          </div>
        </div>
      </>
      
    );
  }
  
  export default ScheduleByGroup;