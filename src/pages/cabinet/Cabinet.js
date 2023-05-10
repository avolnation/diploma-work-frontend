import "../../App.css"
import "./Cabinet.css"

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

import { useEffect, useState, useForm } from "react";
// import { useSelector, useDispatch } from 'react-redux';

const Cabinet = (props) =>{

    return (
      <div className="App">
          <div className="cabinet-main-article">
            // TODO : Login form and sign up form appearing on logged/not logged user
          </div>
      </div>
    );
  }
  
  export default Cabinet;