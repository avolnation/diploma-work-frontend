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
import { Form, Input, Button, Divider, Alert, Space, Modal, message } from "antd";
// import { useSelector, useDispatch } from 'react-redux';

const Cabinet = (props) =>{
    // TODO : Login form and sign up form appearing on logged/not logged user

    const API_BASE_URL = process.env.REACT_APP_BASE_URL;

    const [ loginForm ] = Form.useForm();

    const [ registerForm ] = Form.useForm();

    const [ loadingCabinet, setLoadingCabinet ] = useState(true);

    const [ authorizationModalVisibility, setAuthorizationModalVisibility ] = useState(false);

    const loginHandler = () => {
        const loginQuery = new URLSearchParams(loginForm.getFieldsValue()).toString();
        fetch(`${API_BASE_URL}users/login?${loginQuery}`)
        .then(result => result.json())
        .then(result => {
            result.status == "success" 
            ? 
            message.success({content: result.message, duration: 2, style: {marginTop: '5vh',}}) 
            : 
            message.error({content: result.message, duration: 2, style: {marginTop: '5vh',}});

            if(result.status === 'success'){
                document.cookie = `token=${result.token}; path=/; max-age=3600`
                loginForm.resetFields()
                setTimeout(() => window.location.reload(), 1000)
            }
        })
    }

    const registerHandler = () => {
        fetch(`${API_BASE_URL}users/register`, {
            method: "POST", 
            headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify(registerForm.getFieldsValue())
        })
        .then(result => result.json())
        .then(result => {
            result.status == "success" 
            ? 
            message.success({content: result.message, duration: 2, style: {marginTop: '5vh',}}) 
            : 
            message.error({content: result.message, duration: 2, style: {marginTop: '5vh',}});
        })
    }

    return (
      <div className="main">
          <div className="login-block default-block">
            <div className="section-info-badge"> <LoginOutlined /> Авторизация </div>
            <Alert style={{"textAlign": "center"}} message="Внимание! Во избежание путаницы, регистрироваться самому не рекомендуется!" type="warning"/>
            <Form layout="vertical" form={loginForm} onFinish={() => loginHandler()}>
                    <Form.Item name="login" label="E-mail">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="password" label="Пароль">
                        <Input.Password/>
                    </Form.Item>
                    <Button htmlType="submit" className="login-button">Войти</Button>
            </Form>
            <Divider>Другие действия</Divider>
            <div className="other-actions">
                <Button className="new-user-button" onClick={() => setAuthorizationModalVisibility(true)}>Новый пользователь?</Button>
                <span className="forgot-password">Забыли пароль?</span>
            </div>
          </div>
          <Modal open={authorizationModalVisibility} onCancel={() => setAuthorizationModalVisibility(false)} footer={false}>
            <h2>Регистрация</h2>
            <Divider></Divider>
            <Form layout="vertical" form={registerForm} onFinish={() => registerHandler()}>
                <Form.Item name="name" label="Имя">
                    <Input required/>
                </Form.Item>
                <Form.Item name="surname" label="Фамилия">
                    <Input required/>
                </Form.Item>
                <Form.Item name="login" label="E-mail">
                    <Input required/>
                </Form.Item>
                <Form.Item name="password" label="Пароль">
                    <Input.Password required/>
                </Form.Item>
                <Button htmlType="submit" className="login-button">Регистрация</Button>
            </Form>
          </Modal>
      </div>
    );
  }
  
  export default Cabinet;