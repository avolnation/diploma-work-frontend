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
import { useSelector, useDispatch } from 'react-redux';

import moment from "moment/moment";

import "moment/locale/ru"
import { Form, Tabs, Input, Button } from "antd";



const Cabinet = (props) => {

    const profile = useSelector(state => state.user)

    return (
      <div className="App">
          <div className="cabinet-page-main-block default-block">
            <div className="cabinet-page-left-block">
              <div className="custom-tabs">
              <Tabs
              tabPosition="left"
              items={
              [{label: "Профиль", 
                key: 1,
                children: (
                <>
                <Form layout="vertical">
                  <Form.Item label="Имя">
                    <Input/>
                  </Form.Item>
                  <Form.Item label="Фамилия">
                    <Input/>
                  </Form.Item>
                  <Button>Сохранить</Button>
                </Form>
                </>)
               },
               {label: "Безопасность", key: 2, 
                children: (
                <>
                <Form layout="vertical">
                  <Form.Item label="Старый пароль">
                    <Input/>
                  </Form.Item>
                  <Form.Item label="Новый пароль">
                    <Input/>
                  </Form.Item>
                  <Button>Сохранить</Button>
                </Form>
                </>)
               },
               {label: "Управление пользователями", key: 3, 
                children: (
                <>
                </>)
               }
              ]}
              ></Tabs>
              </div>
            </div>
            <div className="cabinet-page-right-block">
              <img style={{"width": "100px"}} src="./user.png"></img>
              <div className="cabinet-page-profile-info">
                <span>{profile.data.name}</span>
                <span>{profile.data.surname}</span>
                <span>Email: {profile.data.login}</span>
              </div>
            </div>
          </div>
      </div>
    );
  }
  
  export default Cabinet;