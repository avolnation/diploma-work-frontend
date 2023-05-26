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
import { setLoadingUser, setToken, setAuthenticated, setData } from './redux/reducers/userSlice';

import Main from './pages/main/Main'
import Navbar from './pages/navbar/Navbar'
import Cabinet from './pages/cabinet/Cabinet';
import Groups from './pages/groups/Groups';
import Group from './pages/group/Group';
import StudentPage from './pages/student-page/StudentPage';
import RecentActivities from './pages/recent-activities/RecentActivities';
import ScheduleByGroup from './pages/schedule-by-group/ScheduleByGroup';

const App = () => {

  const profile = useSelector(state => state.user)

  const dispatch = useDispatch()

  const API_BASE_URL = process.env.REACT_APP_BASE_URL;


  useEffect(() => {
    if(document.cookie){
      const tokenCookie = getCookie('token')
      if(tokenCookie !== undefined){
        fetch(`${API_BASE_URL}users?token=${tokenCookie}&method=login-by-token`)
        .then(result => result.json())
        .then(result => {
          dispatch(setToken(result.token));
          dispatch(setData(result.userdata));
          dispatch(setLoadingUser(false));
          dispatch(setAuthenticated(true));
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
    dispatch(setLoadingUser(false));
  }, [])

  useEffect(() => {
    
    apiFetch('get-all-groups');
    
  }, [])

  const getCookie = (cookieName) => {
    const cookie = {}
    document.cookie.split(';').forEach(el=> {
    let [key, value] = el.split('=')
    cookie[key.trim()] = value;    
    })
  return cookie[cookieName]
  }

  const apiFetch = (req) => {
    switch(req){
        case 'get-all-groups': 
        fetch(`${API_BASE_URL}groups`)
        .then(result => result.json())
        .then(result => {
            let groupsToSet = result.groups.map(el => {
                return {
                    value: el._id,
                    label: el.title
                }
            })
            dispatch(fetchGroupsFromApiSucceed(groupsToSet));
            dispatch(setLoadingGroups(false));
        })
        .catch(err => {
            console.log(err);
            
        })
        break;
    }
}
  return (
      <BrowserRouter>
          <Navbar getCookie={getCookie}/>
          <Switch>
            <Route path="/schedule-by-group/:groupId" component={ScheduleByGroup}>
              {/* <ScheduleByGroup/> */}
            </Route>
            <Route path="/last-activities">
              <RecentActivities/>
            </Route>
            <Route path="/student/:studentId" render={(props) => <StudentPage {...props}/>}/>
            <Route path="/group/:groupId" render={(props) => <Group {...props}/>}/>
            <Route path="/profile" render={(props) => <Cabinet {...props} getCookie={getCookie}/>}/>
            <Route path="/groups">
              <Groups/>
            </Route>
            <Route path="/groups">
              <Groups/>
            </Route>
            <Route path="/" render={(props) => <Main {...props}/>}/>
          </Switch>
      </BrowserRouter>
  );
}

export default App;