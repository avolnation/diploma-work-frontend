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
import { LoginOutlined  } from "@ant-design/icons";
import { Form, Input, Button, Divider, Alert, Space } from "antd";
// import { useSelector, useDispatch } from 'react-redux';

const Cabinet = (props) =>{
    // TODO : Login form and sign up form appearing on logged/not logged user

    const [ loginForm ] = Form.useForm();

    const loginHandler = () => {

    }

    return (
      <div className="main">
          <div className="login-block default-block">
            <div className="section-info-badge"> <LoginOutlined /> Авторизация </div>
            <Alert style={{"textAlign": "center"}} message="Внимание! Во избежание путаницы, регистрироваться самому не рекомендуется!" type="warning"/>
            <Form layout="vertical" form={loginForm}>
                    <Form.Item name="login" label="E-mail">
                        <Input placeholder="Логин"/>
                    </Form.Item>
                    <Form.Item name="password" label="Пароль">
                        <Input.Password placeholder="Пароль"/>
                    </Form.Item>
                    <Button className="login-button">Войти</Button>
            </Form>
            <Divider>Другие действия</Divider>
            <div className="other-actions">
                <Button className="new-user-button">Новый пользователь?</Button>
                <span className="forgot-password">Забыли пароль?</span>
            </div>

          </div>
      </div>
    );
  }
  
  export default Cabinet;