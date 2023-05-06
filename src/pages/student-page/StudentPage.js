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
import { Tooltip, DatePicker, Input, Select, Radio, Form, Modal, Button } from "antd"
import { LoadingOutlined, UserOutlined, InfoCircleOutlined, SearchOutlined, InfoOutlined } from '@ant-design/icons';

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
        console.log(absenteeisms.absenteeisms) 
      })
      }
      if(form.hasOwnProperty("date-by-range")){
        fetch(`${API_BASE_URL}absenteeisms?studentId=${studentId}&dateByRange[0]=${new Date(form["date-by-range"][0].$d).getTime()}&dateByRange[1]=${new Date(form["date-by-range"][1].$d).getTime()}&subject=${absenteeisms.find((el) => el._id == form.subject).items[0].subjectId}`)
          .then(response => response.json())
         .then(absenteeisms => {
        console.log(absenteeisms.absenteeisms)  
      })
      }
    }

    const handleAbsenteeismsModalCancel = () => {
      setAbsenteeismsModalOpen(false);
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
                      {/* <div>
                        {radioValue === 1 ? <DatePicker  style={{"width": "50%"}}/> : <RangePicker onChange={(e) => {console.log(new Date(e[0].$d).getTime())}}/>}
                      </div> */}
                        {/* <Select options={}/> */}
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
          <Modal title="Пропуски по заданным параметрам" open={absenteeismsModalOpen} onCancel={handleAbsenteeismsModalCancel}>
            
          </Modal>
      </div>
    );
  }
  
  export default Groups;