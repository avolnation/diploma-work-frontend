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
import { PlusCircleOutlined, InfoCircleOutlined, TeamOutlined } from "@ant-design/icons";
import { Skeleton, Button, Modal, Form, Input, message } from "antd";

const Groups = (props) =>{

  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  const groupsFromRedux = useSelector(state => state.groups.groups);
  const groupsLoading = useSelector(state => state.groups.loading);

  const profile = useSelector(state => state.user);

  const [ newGroupModalVisibility, setNewGroupModalVisibility ] = useState(false);

  const [ searchGroupsInput, setSearchGroupsInput ] = useState("");

  const [ groupForm ] = Form.useForm();

  const newGroupHandler = (form) => {
    fetch(`${API_BASE_URL}groups`, 
    {method: "POST", 
    body: JSON.stringify({title: form.title}), 
    headers: {"Content-Type": "application/json"}})
    .then(response => response.json())
    .then(response => {
      if(response.status == "success"){
        message.success({content: response.message, duration: 2, style: {marginTop: '5vh',}});
        setNewGroupModalVisibility(false);
        groupForm.resetFields();
    }
    else {
        message.error({content: response.message, duration: 2, style: {marginTop: '5vh',}});
    }
    })
  }

  const filterGroupsHandler = () => {
    if(searchGroupsInput.length > 0){
      let search_string = searchGroupsInput.toLowerCase();
      return groupsFromRedux.filter((item) => {
        return item?.label.toLowerCase().indexOf(search_string) > -1 
      })
    }
    else {
      return groupsFromRedux
    }
    
  }

    return (
      <div className="App">
          <div className="groups-page">
            <div className="groups-page-left-block default-block">
              <div className="section-badge"><InfoCircleOutlined /> <span>Информация</span></div>
              <img src="./groups-page.svg"/>
              <span className="page-description">
                Добро пожаловать на страницу выбора группы. Для просмотра расписания нажмите кнопку "Расписание", для перехода на страницу группы нажмите "Группа". Если нужно найти определённую группу, введите запрос в поле ввода.
              </span>
            </div>
            <div className="groups-page-right-block default-block">
              <div className="section-badge"><TeamOutlined />  <span>Группы</span> </div>
              {profile.data.role == 'admin' ? <Button className="groups-component create-btn" onClick={() => setNewGroupModalVisibility(true)} >Добавить группу</Button> : null}
              <input className="filter-field" type="text" placeholder="Введите название группы..." onChange={(e) => setSearchGroupsInput(e.target.value)} disabled={groupsLoading}/>
                <div className="groups-page-groups">
                  { groupsLoading ? [1,2,3,4,5,6].map(element => {
                   return (
                    <>
                    <div className="groups-info-right-block-item-skeleton">
                      <Skeleton.Button className="groups-info-right-block-skeleton-item groups-info-right-block-item-info"></Skeleton.Button>
                      <Skeleton.Button className="groups-info-right-block-skeleton-item groups-info-right-block-item-button"></Skeleton.Button>
                      <Skeleton.Button className="groups-info-right-block-skeleton-item groups-info-right-block-item-button"></Skeleton.Button>
                    </div>
                    </>
                  )
                }) : groupsFromRedux && filterGroupsHandler().map((group) => {
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
          <Modal centered open={newGroupModalVisibility} onCancel={() => setNewGroupModalVisibility(false)} footer={false}>
              <h2>Создание новой группы</h2>
              <Form layout="vertical" form={groupForm} onFinish={(form) => newGroupHandler(form)}>
                <Form.Item name="title" placeholder="МС-32" label="Название группы">
                  <Input className="form-input"/>
                </Form.Item>
                <Button className="action-btn" htmlType="submit">Создать</Button>
              </Form>
          </Modal>
      </div>
    );
  }
  
  export default Groups;