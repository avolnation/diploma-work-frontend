import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

import Groups from './pages/groups/Groups';
import Group from './pages/group/Group';
import RecentActivities from './pages/recent-activities/RecentActivities';
import ScheduleByGroup from './pages/schedule-by-group/ScheduleByGroup';

const App = () => {
  return (
    <BrowserRouter>
        <Switch>
          <Route path="/schedule-by-group">
            <ScheduleByGroup/>
          </Route>
          <Route path="/last-activities">
            <RecentActivities/>
          </Route>
          <Route path="/group">
            <Group/>
          </Route>
          <Route path="/groups">
            <Groups/>
          </Route>
          <Route path="/">
            <div className="App">
              <div id="header">
                <span class="header-item">Группы</span>
                <span class="header-item">Расписание групп</span>
                <span class="header-item">Недавние действия</span>
                <span class="header-item">Мой профиль</span>
              </div>
            </div>
          </Route>
        </Switch>
    </BrowserRouter>
  );
}

export default App;