import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

import { useEffect, useState, useForm } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setLoadingGroups, fetchGroupsFromApiSucceed, fetchGroupsFromApiFailed } from './redux/reducers/groupsSlice';


import Groups from './pages/groups/Groups';
import Group from './pages/group/Group';
import RecentActivities from './pages/recent-activities/RecentActivities';
import ScheduleByGroup from './pages/schedule-by-group/ScheduleByGroup';

const App = () => {

  const dispatch = useDispatch()

  const API_URL = "http://localhost:3002";

  useEffect(() => {
    apiFetch('get-all-groups');
  }, [])

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
        // case 'get-subjects-by-group-id':
        //     fetch(API_URL + "/subjects/get-subjects-by-group/" + props.match.params.groupId)
        //     .then(result => result.json())
        //     .then(result => {
        //         let subjectsToSet = result.subjects.map(el => {
        //             return {
        //                 value: el._id,
        //                 label: `${el.title} (${el.abbreviature})`
        //             }
        //         })
        //         dispatch(setGroupForSubjects(subjectsToSet))
        //     })
    }
}
  return (
    <BrowserRouter>
              <div id="header">
                <nav>
                  <ul>
                    <li>
                      <Link to="/groups">
                        Группы
                      </Link>
                    </li>
                    <li>
                      <Link to="/schedule-by-group">
                        Расписание групп
                      </Link>
                    </li>
                    <li>
                      <Link to="/cabinet">
                        Личный кабинет
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
        <Switch>
          <Route path="/schedule-by-group/:groupId" component={ScheduleByGroup}>
            {/* <ScheduleByGroup/> */}
          </Route>
          <Route path="/last-activities">
            <RecentActivities/>
          </Route>
          <Route path="/group/:groupId" render={(props) => <Group {...props}/>}/>
          <Route path="/groups">
            <Groups/>
          </Route>
          <Route path="/groups">
            <Groups/>
          </Route>
          <Route path="/">
            <div className="App"> 
            </div>
          </Route>
        </Switch>
    </BrowserRouter>
  );
}

export default App;