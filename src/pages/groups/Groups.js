import "../../App.css"
import "./Groups.css"

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

import { useEffect, useState, useForm } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { PlusCircleOutlined } from "@ant-design/icons";

const Groups = (props) =>{

  const groupsFromRedux = useSelector(state => state.groups.groups);

    return (
      <div className="App">
          <div className="groups-page">
            <div className="groups-page-left-block default-block">
              <div className="groups-page-section-badge"> Информация </div>
              <span className="page-description">
                Выберите группу из предложенных чтобы просмотреть студентов которые сейчас в университете а так же другую информацию.
              </span>
            </div>
            <div className="groups-page-right-block default-block">
              <div className="groups-page-section-badge"> Группы </div>
                <div className="groups-page-add-group"> Добавить группу</div>
                <div className="groups-page-groups">
                  {groupsFromRedux && groupsFromRedux.map((group) => {
                    return (
                    <div className="groups-info-right-block-item">
                      <span>
                        {group.label}
                      </span> 
                      <div>
                      <Link to={`/schedule-by-group/${group.value}`} className="groups-info-right-block-item-schedule">
                        Расписание
                        </Link> 
                        <Link to={`/group/${group.value}`} className="groups-info-right-block-item-group-page">
                          К группе
                        </Link>
                      </div>
                    </div>)
                  })}
                </div>
            </div>
          </div>
      </div>
    );
  }
  
  export default Groups;