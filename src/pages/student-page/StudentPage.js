import "../../App.css"
import "./StudentPage.css"

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";

import { useEffect, useState, useForm } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip, DatePicker, Input, Select, Radio, Form, Modal, Button, Skeleton, Dropdown, Popconfirm } from "antd"
import { LoadingOutlined, UserOutlined, InfoCircleOutlined, SearchOutlined, InfoOutlined, CheckOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';

import moment from "moment/moment";

import "moment/locale/ru"



const Groups = (props) =>{

    const { RangePicker } = DatePicker;

    const API_BASE_URL = process.env.REACT_APP_BASE_URL;

    const studentId = props.match.params.studentId;

    const [ student, setStudent] = useState({})
    const [ loadingStudent, setLoadingStudent ] = useState(true)

    const [ loadingAbsenteeisms, setLoadingAbsenteeisms ] = useState(true);
    const [ absenteeismsForSelect, setAbsenteeismsForSelect ] = useState([])
    // const [ absenteeismType, setAbsenteeismType ] = useState([{title: "Все", label: "Все"}, {title: "Лекция", label: "Лекция"}, {title: ""}])
    const [ absenteeisms, setAbsenteeisms ] = useState([]);

    const [ absenteeismsByFilter, setAbsenteeismsByFilter ] = useState([]);
    const [ loadingAbsenteeismsByFilter, setLoadingAbsenteeismsByFilter ] = useState(true);

    const [ radioValue, setRadioValue ] = useState(1);

    const [ absenteeismsModalOpen, setAbsenteeismsModalOpen ] = useState(false)

    const [ absenteeismsForm ] = Form.useForm();

    useEffect(() => {
        fetch(`${API_BASE_URL}students?_id=${studentId}`)
        .then(response => response.json())
        .then(response => {
          setStudent(response.students[0])
          setLoadingStudent(false)
          
        })
        
        fetch(`${API_BASE_URL}absenteeisms?student=${studentId}`)
        .then(response => response.json())
        .then(response => {

          setAbsenteeismsForSelect(response.absenteeisms.map(element => {
            return { label: element._id,
                    value: element._id }
          }))
          setAbsenteeisms(response.absenteeisms);
          setLoadingAbsenteeisms(false);
        })
    }, [])

    const onFilterFormSubmit = (form) => {
      if(form.hasOwnProperty("date-by-day")){
        fetch(`${API_BASE_URL}absenteeisms?studentId=${studentId}&dateByDay=${new Date(form["date-by-day"].$d).getTime()}&subject=${absenteeisms.find((el) => el._id == form.subject).items[0].subjectId}`)
        .then(response => response.json())
         .then(absenteeisms => {
           setAbsenteeismsByFilter(absenteeisms.absenteeisms);
           setAbsenteeismsModalOpen(true);
           setLoadingAbsenteeismsByFilter(false);
      })
      }
      if(form.hasOwnProperty("date-by-range")){
        fetch(`${API_BASE_URL}absenteeisms?studentId=${studentId}&dateByRange[0]=${new Date(form["date-by-range"][0].$d).getTime()}&dateByRange[1]=${new Date(form["date-by-range"][1].$d).getTime()}&subject=${absenteeisms.find((el) => el._id == form.subject).items[0].subjectId}`)
          .then(response => response.json())
         .then(absenteeisms => {
           setAbsenteeismsByFilter(absenteeisms.absenteeisms);
           setAbsenteeismsModalOpen(true);
           setLoadingAbsenteeismsByFilter(false);
      })
      }
    }

    const handleAbsenteeismsModalCancel = () => {
      setAbsenteeismsModalOpen(false);
    }
    
    const handleFilteredAbsenteeisms = (type, absenteeism) => {

      let absenteeismsByFilterCopy = absenteeismsByFilter;

      setLoadingAbsenteeismsByFilter(true);
      setAbsenteeismsByFilter([]);

      switch(type) {
        case "negative":
          fetch(`${API_BASE_URL}absenteeisms`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({absenteeismId: absenteeism._id, type: 0})})
          .then(result => result.json())
          .then(result => {
            absenteeismsByFilterCopy[absenteeismsByFilterCopy.findIndex(el => el._id === result.result._id)] = result.result;

            setAbsenteeismsByFilter(absenteeismsByFilterCopy);
            setLoadingAbsenteeismsByFilter(false);
          })
          break;
        case "positive": 
          fetch(`${API_BASE_URL}absenteeisms`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({absenteeismId: absenteeism._id, type: 1})})
          .then(result => result.json())
          .then(result => {
            absenteeismsByFilterCopy[absenteeismsByFilterCopy.findIndex(el => el._id === result.result._id)] = result.result;

            setAbsenteeismsByFilter(absenteeismsByFilterCopy);
            setLoadingAbsenteeismsByFilter(false);
          })
          break;
        case "delete": 
          fetch(`${API_BASE_URL}absenteeisms?absenteeismId=${absenteeism._id}`, {method: "DELETE"})
          .then(result => result.json())
          .then(result => {
            absenteeismsByFilterCopy = absenteeismsByFilterCopy.filter(item => item._id !== result.result._id)

            setAbsenteeismsByFilter(absenteeismsByFilterCopy);
            setLoadingAbsenteeismsByFilter(false);

          })
          break;
      }
    }

    return (
      <div className="App">
          <div className="student-info">
            <div className="student-info-filter-and-info-block">
              <div className="student-info-about-student-section default-block">
                  <div className="student-info-section-badge"> <UserOutlined /> Общая информация о студенте</div>
                  <div className="student-info-section-info">
                    { loadingStudent ?
                    <LoadingOutlined/> : 
                    <>
                      <span className="student-info-section-text">
                        <span className="title">ФИО: </span> 
                        <span className="text">{student.surname + " " + student.name + " " + student.patronymic}</span>
                      </span>
                      <span className="student-info-section-text">
                        <span className="title">Дата рождения: </span> 
                        <span className="text">{moment(new Date(+student.dateOfBirth)).format("LL")}</span>
                      </span>
                      <span className="student-info-section-text">
                        <span className="title">Номер карты: </span>
                        <span className="text">{student.cardId}</span>
                      </span>
                      <span className="student-info-section-text">
                        <span className="title">Группа: </span>
                        <span className="text">{student.group.title}</span>
                      </span>
                    </>} 
                  </div>
              </div>
              <div className="student-info-filter-absenteeisms default-block">
                <div className="student-info-section-badge"> <SearchOutlined /> Поиск пропусков по фильтрам</div>
                      <Radio.Group onChange={(e) => setRadioValue(e.target.value)} value={radioValue} style={{"marginTop": "8px", "marginBottom": "8px"}}>
                        <Radio value={1}>
                          По дню
                        </Radio>
                        <Radio value={2}>
                          По промежутку
                        </Radio>
                      </Radio.Group>
                      <Form name="filter-form" form={absenteeismsForm} onFinish={onFilterFormSubmit}>
                      { radioValue === 1 ?
                        <Form.Item name="date-by-day">
                            <DatePicker style={{"width": "50%"}}/>
                        </Form.Item>  
                      : null}
                      { radioValue === 2 ? 
                        <Form.Item name="date-by-range">
                          <RangePicker onChange={(e) => {console.log(new Date(e[0].$d).getTime())}}/>
                        </Form.Item> 
                      : null}
                        <Form.Item name="subject">
                          <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        } options={absenteeismsForSelect} placeholder="Выберите предмет" style={{"width": "80%", "marginTop": "8px"}}/>
                        </Form.Item>
                        <Button htmlType="submit" style={{"marginTop": "8px"}}><SearchOutlined/>Поиск</Button>
                      </Form>
              </div>
            </div>
            <div className="student-info-absenteeism-section default-block">
                <div className="student-info-section-badge"> <InfoCircleOutlined /> Информация о пропусках студента по предметам</div>
            <div>
                  {loadingAbsenteeisms ? <LoadingOutlined/> : absenteeisms.map(absenteeism => {
                    return <div key={absenteeism._id} className="student-info-absenteeism-section-item">
                      <span>{absenteeism._id}</span>
                      <span><span><Tooltip title="Уважительные">{absenteeism.posHoursSum}</Tooltip></span><Tooltip title="Неуважительные"> | <span>{absenteeism.negHoursSum}</span></Tooltip> </span>
                    </div>
                  })}
                </div>
            </div>
          </div>
          <Modal title="Пропуски по заданным параметрам" open={absenteeismsModalOpen} onCancel={handleAbsenteeismsModalCancel} footer={false} width={1000}>
            <div className="modal-body">
            {loadingAbsenteeismsByFilter ? <Skeleton /> : absenteeismsByFilter.map(absenteeism => {
              return (
                <Dropdown 
                  menu={{
                  items: [{ 
                    key: 1, 
                    label: (
                    <a>
                      Отметить как уважительный
                    </a>
                    ),
                    icon: <CheckOutlined />,
                    disabled: absenteeism.type == 1,
                    onClick: () => {handleFilteredAbsenteeisms("positive", absenteeism)}},
                    {key: 2, 
                    label: (
                      <a>
                      Отметить как неуважительный
                    </a>
                    ),
                    icon : <CloseOutlined />,
                    disabled: absenteeism.type == 0, 
                    onClick: () => {handleFilteredAbsenteeisms("negative", absenteeism)}},
                    {key: 3, label: (
                      <Popconfirm title="Удалить пропуск" description="Вы уверены что хотите удалить данный пропуск?" okText="Да" cancelText="Нет" onConfirm={() => handleFilteredAbsenteeisms("delete", absenteeism)}>
                        <a>
                          Удалить пропуск
                        </a>
                      </Popconfirm>
                    ),
                    icon: <DeleteOutlined/>, 
                    danger: true}],}} 
                    trigger={['contextMenu']}>
                  <div className="absenteeism-item">
                    <span className={"absenteeism-hours-number " + (absenteeism.type == 0 ? "negative-hours-batch" : "positive-hours-batch")}>
                      {absenteeism.hoursNumber}
                    </span>
                    <span className="absenteeism-subject-title">
                      {absenteeism.subject.title}
                    </span>
                    <span className="absenteeism-item-date">
                      {moment(new Date(+absenteeism.date)).format("L")}
                    </span>
                </div>
                </Dropdown>)
            })}
            </div>
          </Modal>
      </div>
    );
  }
  
  export default Groups;