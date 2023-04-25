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

const Groups = (props) =>{

  const groupsFromRedux = useSelector(state => state.groups.groups);

    return (
      <div className="App">
          <div id="groups-info">
            <span id="groups-info-left-block">Выберите группу из предложенных чтобы просмотреть студентов которые сейчас в университете а так же другую информацию.</span>
            <span id="groups-info-right-block">
                <span className="groups-info-right-block-item">[+]</span>
                <>
                  {groupsFromRedux && groupsFromRedux.map((group) => {
                    return (<Link to={`/group/${group.value}`} className="groups-info-right-block-item">{group.label}</Link>)
                  })}
                </>
            </span>
          </div>
      </div>
    );
  }
  
  export default Groups;