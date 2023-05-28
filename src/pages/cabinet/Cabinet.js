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

import { Form, Tabs, Input, Button, Progress, Skeleton, message, Select } from "antd";
const { Option } = Select;



const Cabinet = (props) => {

    const API_BASE_URL = process.env.REACT_APP_BASE_URL;

    const profile = useSelector(state => state.user)

    const [ allUsersLoading, setAllUsersLoading ] = useState(true);
    const [ allUsers, setAllUsers ] = useState([]);

    const [ searchUsers, setSearchUsers ] = useState("")

    const [ passwordComplexity, setPasswordComplexity] = useState(0);

    const [ userForm ] = Form.useForm()
    const [ newPasswordForm ] = Form.useForm()

    useEffect(() => {
      if(profile.data.role == "admin"){
        console.log("Fetched")
        fetchAdminPanelUsers()
      }
      userForm.setFieldsValue({"name": profile.data.name, "surname": profile.data.surname})
    }, [profile.authenticated])

    // Проверка пароля
    function checkPassword(e = '') {
      let s_letters = "qwertyuiopasdfghjklzxcvbnm"; // Буквы в нижнем регистре
      let b_letters = "QWERTYUIOPLKJHGFDSAZXCVBNM"; // Буквы в верхнем регистре
      let digits = "0123456789"; // Цифры
      let specials = "!@#$%^&*()_-+=\|/.,:;[]{}"; // Спецсимволы

      let is_s = false; // Есть ли в пароле буквы в нижнем регистре
      let is_b = false; // Есть ли в пароле буквы в верхнем регистре
      let is_d = false; // Есть ли в пароле цифры
      let is_sp = false; // Есть ли в пароле спецсимволы
              
      for (let i = 0; i < e.length; i++) {
          /* Проверяем каждый символ пароля на принадлежность к тому или иному типу */
          if (!is_s && s_letters.indexOf(e[i]) != -1) {
              is_s = true
          }
          else if (!is_b && b_letters.indexOf(e[i]) != -1) {
              is_b = true
          }
          else if (!is_d && digits.indexOf(e[i]) != -1) {
              is_d = true
          }
          else if (!is_sp && specials.indexOf(e[i]) != -1) {
              is_sp = true
          }
      }

      let rating = 0;
      if (is_s) rating++; // Если в пароле есть символы в нижнем регистре, то увеличиваем рейтинг сложности
      if (is_b) rating++; // Если в пароле есть символы в верхнем регистре, то увеличиваем рейтинг сложности
      if (is_d) rating++; // Если в пароле есть цифры, то увеличиваем рейтинг сложности
      if (is_sp) rating++; // Если в пароле есть спецсимволы, то увеличиваем рейтинг сложности
      /* Далее идёт анализ длины пароля и полученного рейтинга, и на основании этого готовится текстовое описание сложности пароля */

      var score = 0;
      if (e.length < 6 && rating < 3) {
          score = 10;
      }
      if (e.length === 0) {
          score = 0;
      }
      else if (e.length < 6 && rating >= 3) {
          score = 50;
      }
      else if (e.length >= 8 && rating < 3) {
          score = 50;
      }
      else if (e.length >= 8 && rating >= 3) {
          score = 100;
      }
      else if (e.length >= 6 && rating == 1) {
          score = 10;
      }
      else if (e.length >= 6 && rating > 1 && rating < 4) {
          score = 50;
      }
      else if (e.length >= 6 && rating == 4) {
          score = 100;
      };

      setPasswordComplexity(score);
      // return score;
  }

  const onNewPasswordChange = (e) => {
    checkPassword(e.target.value);
  }

  const roleName = (role) => {
    switch (role) {
      case "admin":
        return "Администратор"
        break;
      case "user":
        return "Пользователь"
        break;
      case "teacher":
        return "Преподаватель"
        break;
      default: 
        return ""
    }
  }

  const newPasswordChangeHandler = (form) => {
    fetch(`${API_BASE_URL}users`, 
          {method: "POST", 
           headers: {"Content-Type": "application/json"}, 
           body: JSON.stringify({...form, token: props.getCookie('token'), method: "new-password-from-profile"})})
    .then(response => response.json())
    .then(response => {
      if(response.status == "success"){
        message.success({content: response.message, duration: 2, style: {marginTop: '5vh',}});
        newPasswordForm.resetFields();
      }
      else {
        message.error({content: response.message, duration: 2, style: {marginTop: '5vh',}});
      }
    })
  }

  const initialsChangeHandler = (form) => {
    fetch(`${API_BASE_URL}users`, 
          {method: "POST", 
           headers: {"Content-Type": "application/json"}, 
           body: JSON.stringify({...form, token: props.getCookie('token'), method: "new-initials"})})
    .then(response => response.json())
    .then(response => {
      if(response.status == "success"){
        message.success({content: response.message, duration: 2, style: {marginTop: '5vh',}});
        props.fetchUserData(props.getCookie('token'));
      }
      else {
        message.error({content: response.message, duration: 2, style: {marginTop: '5vh',}});
      }
    })
  }

  const filterUsersHandler = () => {
    if(searchUsers.length > 0){
      let search_string = searchUsers.toLowerCase();
      return allUsers.filter((item) => {
        return item?.login.toLowerCase().indexOf(search_string) > -1 || item?.name.toLowerCase().indexOf(search_string) > -1 || item?.surname.toLowerCase().indexOf(search_string) > -1 || (item?.name + " " + item?.surname).toLowerCase().indexOf(search_string) > -1 || (item?.surname + " " + item?.name).toLowerCase().indexOf(search_string) > -1
      })
    }
    else {
      return allUsers
    }
  }

  const changeUserRole = (userRole, userLogin) => {
    fetch(`${API_BASE_URL}users?token=${props.getCookie("token")}&login=${userLogin}&role=${userRole}&method=change-role`)
    .then(response => response.json())
    .then(response => {
      if(response.status == "success"){
        message.success({content: response.message, duration: 2, style: {marginTop: '5vh',}});
        fetchAdminPanelUsers();
      }
      else {
        message.error({content: response.message, duration: 2, style: {marginTop: '5vh',}});
      }
    })
  }

  const fetchAdminPanelUsers = () => {
    setAllUsersLoading(true)
    fetch(`${API_BASE_URL}users?token=${props.getCookie("token")}&method=users`)
      .then(response => response.json())
      .then(response => {
        if(response.users.length >= 1){
          setAllUsers(response.users);
          setAllUsersLoading(false);
        }
      })
  }


    return (
      <div className="App">
          <div className="cabinet-page-main-block default-block">
            {profile.loading 
            ? <Skeleton />
            :
            profile.authenticated 
            ? 
            <>
            <div className="cabinet-page-left-block">
              <div className="custom-tabs">
              <Tabs
              tabPosition="left"
              items={
              [{label: "Профиль", 
                key: 1,
                children: (
                <>
                <Form form={userForm} className="cabinet-forms" layout="vertical" onFinish={(form) => initialsChangeHandler(form)}>
                  <Form.Item name="name" label="Имя">
                    <Input className="form-input" disabled={profile.loading}/>
                  </Form.Item>
                  <Form.Item name="surname" label="Фамилия">
                    <Input className="form-input" disabled={profile.loading}/>
                  </Form.Item>
                  <Button htmlType="submit" className="form-action-btn">Сохранить</Button>
                </Form>
                </>)
               },
               {label: "Безопасность", key: 2, 
                children: (
                <>
                <Form form={newPasswordForm} className="cabinet-forms" layout="vertical" onFinish={(form) => newPasswordChangeHandler(form)}>
                  <Form.Item name="old-password" label="Старый пароль">
                    <Input.Password className="form-input"/>
                  </Form.Item>
                  <Form.Item name="new-password" label="Новый пароль">
                    <Input.Password onChange={(e) => onNewPasswordChange(e)} className="form-input"/>
                  </Form.Item>
                  <Progress percent={passwordComplexity}/>
                  <Button htmlType="submit" className="form-action-btn">Сохранить</Button>
                </Form>
                </>)
               },
               {label: "Пользователи", key: 3, 
                children: (
                <>
                  <input style={{"margin-bottom": "16px"}} className="filter-field" type="text" placeholder="Введите E-mail, имя или фамилию пользователя..." onChange={(e) => setSearchUsers(e.target.value)} disabled={allUsersLoading}/>
                  <div className="cabinet-admin-users-panel">
                    { allUsersLoading 
                      ? 
                      [1,2,3,4,5,6].map(element => {
                        return (
                         <>
                         <div className="cabinet-users-admin-panel-skeleton">
                          <div className="cabinet-users-admin-panel-avatar-and-info">
                            <Skeleton.Button className="cabinet-users-admin-panel-skeleton-item cabinet-users-admin-panel-skeleton-item-avatar"></Skeleton.Button>
                            <Skeleton.Button className="cabinet-users-admin-panel-skeleton-item cabinet-users-admin-panel-skeleton-item-info"></Skeleton.Button>
                          </div>
                           <Skeleton.Button className="cabinet-users-admin-panel-skeleton-item cabinet-users-admin-panel-skeleton-item-button"></Skeleton.Button>
                         </div>
                         </>
                       )
                      })
                      : 
                      allUsers.length >= 1 ? filterUsersHandler().map(user => {
                      return (
                        <div key={user.login} className="cabinet-admin-users-panel-item">
                          <div className="cabinet-admin-users-panel-item-user-info">
                            <img src="./user.png" style={{"width": "30px"}}/>
                            <div className="cabinet-admin-users-panel-item-user-info-initials">
                              <span>{user.name + " " + user.surname}</span>
                              <span>{user.login}</span>
                            </div>
                          </div>
                          <div className="cabinet-admin-users-panel-item-user-role-manager">
                            <Select onSelect={(e) => changeUserRole(e, user.login)} style={{"width": "200px"}} value={user.role} disabled={user.login == profile.data.login}>
                              <Option value="user">Пользователь</Option>
                              <Option value="teacher">Преподаватель</Option>
                              <Option value="admin">Администратор</Option>
                            </Select>
                          </div>
                        </div>
                      )
                    }) 
                    : 
                    <>
                    </>}
                  </div>

                </>),
                disabled: profile.data.role != "admin"
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
                <span>{roleName(profile.data.role)}</span>
                <span>Email: {profile.data.login}</span>
              </div>
            </div>
            </>
            : 
            <>
            <div className="cabinet-not-authorized">
              <span>
                Вы не авторизованы
              </span>
              <Link className="cabinet-to-main-page" to="/">На главную</Link>
            </div>
            </>
            }    
          </div>
      </div>
    );
  }
  
  export default Cabinet;