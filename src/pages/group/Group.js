import "../../App.css"
import "./Group.css"

import { useEffect, useState, useForm } from "react";
import { Tooltip, Dropdown } from "antd";
import { CheckOutlined, ClockCircleOutlined, FrownOutlined, InfoOutlined, TeamOutlined, LoadingOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { EmojiProvider, Emoji } from "react-apple-emojis"
import emojiData from "react-apple-emojis/src/data.json"

const Group = (props) => {

    const API_BASE_URL = process.env.REACT_APP_BASE_URL;
    const groupId = props.match.params.groupId;
    // const timeNow = 1682943900000;
    const timeNow = 1680518460000;

    const items = [{ key: 1, 
                     label: (
                     <a>
                       Страница студента
                     </a>),
                     icon: <InfoOutlined />},
                     {key: 2, 
                      label: (
                      <a>
                        Присутствует
                      </a>
                     ),
                      icon : <CheckOutlined />},
                    {key: 3, label: (
                      <a> 
                        Отсутствует 
                      </a>
                    ),
                      icon: <CloseOutlined />}]
    
    const [ students, setStudents ] = useState([])
    const [ pairInfo, setPairInfo ] = useState({})
    const [ pairNow, setPairNow ] = useState([])
    // const [ attendances, setAttendances ] = useState([])
    const [ loadingPairInfo, setLoadingPairInfo ] = useState(true)
    const [ loadingStudents, setLoadingStudents ] = useState(true)
    const [ searchStudentInput, setSearchStudentInput] = useState("")

    // useEffect(() => {

    // }, [])

    useEffect(() => {
      fetch(`${API_BASE_URL}functions/pair-info-from-timestamp?timestamp=${timeNow}`)
      .then(response => response.json())
      .then(response => {
        setPairInfo(response.info)
        return response.info
      })
      .then((pairData) => {

        fetch(`${API_BASE_URL}students?group=${groupId}`)
        .then(data => data.json())
        .then(students => {
          // setStudents(students.students)
          fetch(`${API_BASE_URL}attend?lte=${pairData.pairEnds}&gte=${pairData.pairStarts}`)
          .then(response => response.json())
          .then(attendances => {
            // setAttendances(response.attendances)
            // console.log(attendances.attendances)
            let mappedStudents = students.students;

            mappedStudents = mappedStudents.map((student, index) => {
              let attendanceMatch = attendances.attendances.find(element => student._id == element.student);
              if(attendanceMatch){
                return {...student, attendance: attendanceMatch}
              }
              else {
                return {...student}
              }
            })

            setStudents(mappedStudents)

            setLoadingStudents(false)
          })
        })
        
        fetch(`${API_BASE_URL}schedule?pairNumber=${pairData.pairNumber}&dayOfTheWeek=${pairData.dayOfTheWeek}`)
        .then(response => response.json())
        .then(pairData => {
          setPairNow(pairData.pairs)
          setLoadingPairInfo(false)
        })
      })
    }, [])


    // useEffect(() => {
    //   console.log(searchStudentInput)
    // }, [searchStudentInput])


    const pairNowHandler = () => {
      // массив расписания за день
      
    }

    const pairRepresentation = () => {

      let filteredPairs = pairNow.filter(item => {
        return item.weekParity == 0 && item.subgroup == 0 
      })

      console.log(filteredPairs);

      if(filteredPairs.length != 0 ){
        // Один div с парой
        return (
          <>
            <div className="group-info-pair-now-block-pair-info">
              <span className="pair-line pair-info-pair-subgroup"><span className="title">Подгруппа:</span><span className="text">{`${filteredPairs[0].subgroup} п-па.`}</span></span>
              <span className="pair-line pair-info-pair-title"><span className="title">Предмет:</span><span className="text">{filteredPairs[0].subject.title}</span></span>
              <span className="pair-line pair-info-pair-lecturer"><span className="title">Лектор:</span><span className="text">{filteredPairs[0].subject.lecturer}</span></span>
              <span className="pair-line pair-info-pair-classroom"><span className="title">Аудитория:</span><span className="text">{`${filteredPairs[0].classroom}`}</span></span>
            </div>
          </>
        )
      }
      else {
        filteredPairs = pairNow.filter(item => {
          return (item.subgroup == 0) && (item.weekParity == pairInfo.weekParity)
        })
        if(filteredPairs.length != 0 ){
          return (
            <>
              <div className="group-info-pair-now-block-pair-info">
                <span className="pair-info-pair-subgroup">{`${filteredPairs[0].subgroup} п-па.`}</span>
                <span className="pair-info-pair-title">{filteredPairs[0].subject.title}</span>
                <span className="pair-info-pair-lecturer">{filteredPairs[0].subject.lecturer}</span>
                <span className="pair-info-pair-classroom">{`ауд. ${filteredPairs[0].classroom}`}</span>
              </div>
            </>
          )            
        }
        else {
          filteredPairs = pairNow.filter(item => {
            return ((item.subgroup == 1) || (item.subgroup == 2)) && (item.weekParity == pairInfo.weekParity)
          })
          if(filteredPairs.length == 1){
            return (
              <>
                <div className="group-info-pair-now-block-pair-info">
                  <span className="pair-info-pair-subgroup">{`${filteredPairs[0].subgroup} п-па.`}</span>
                  <span className="pair-info-pair-title">{filteredPairs[0].subject.title}</span>
                  <span className="pair-info-pair-lecturer">{filteredPairs[0].subject.lecturer}</span>
                  <span className="pair-info-pair-classroom">{`ауд. ${filteredPairs[0].classroom}`}</span>
                </div>
              </>
            )
          }
          else {
            return (
              <>
                  <div className="group-info-pair-now-block-pair-info">
                    {/* <span className="pair-info-pair-subgroup">{`${filteredPairs[0].subgroup} п-па.`}</span> */}
                    <span className="pair-info-pair-title">{filteredPairs[0].subject.title}</span>
                    <span>{filteredPairs[0].subject.lecturer}</span>
                    <span>{`ауд. ${filteredPairs[0].classroom}`}</span>
                  </div>
                  <hr/>
                  <div className="group-info-pair-now-block-pair-info">
                    {/* <span className="pair-info-pair-subgroup">{`${filteredPairs[1].subgroup} п-па.`}</span> */}
                    <span className="pair-info-pair-title">{filteredPairs[1].subject.title}</span>
                    <span>{filteredPairs[1].subject.lecturer}</span>
                    <span>{`ауд. ${filteredPairs[1].classroom}`}</span>
                  </div>
              </>
            )
          }
        }

      }

    }

    const filterStudentsHandler = () => {
      if(searchStudentInput.length > 0){
        let search_string = searchStudentInput.toLowerCase()
        return students.filter((item) => {
          return item['name'].toLowerCase().indexOf(search_string) > -1 || item['surname'].toLowerCase().indexOf(search_string) > -1
        })
      }
      else {
        return students
      }
      
    }

    return (
      <div className="App">
          <div id="group-info">
            <div id="group-info-students-block">
            <div id="group-info-pair-now-block" className="default-block"> 
            <div className="group-info-students-block-add-attendance">
              <ClockCircleOutlined/> 
              <span>
                Текущая пара
              </span>

            </div>
            <div className="group-info-pair-now">
              {!loadingPairInfo 
              ? 
              pairNow.length > 0 
              ? pairRepresentation() 
              :
              <>
                <div style={{"margin": "0 auto 1% auto", "width": "fit-content"}}>Занятия сейчас нет</div>
                <img className="image-placeholder" src="https://em-content.zobj.net/thumbs/120/apple/354/partying-face_1f973.png"/>  
              </>
              : <LoadingOutlined style={{"display": "block", "fontSize": "75px", "margin": "0 auto"}}/>}
              </div>
            </div>
            <div id="group-info-students-all-block" className="default-block">
              <div className="group-info-students-block-add-attendance">
                      <TeamOutlined />
                      <span>Посещение занятия студентами</span>
              </div>
              <input type="text" placeholder="Введите имя или фамилию студента..." onChange={(e) => setSearchStudentInput(e.target.value)}/>
              <div id="group-info-students-block-students">
                {loadingStudents ? <LoadingOutlined style={{"display": "block", "fontSize": "75px", "margin": "0 auto"}}/> : 
                  students && filterStudentsHandler().map(student => {
                  return (
                      <Dropdown menu={{items: [{ key: 1, 
                        label: (
                        <a>
                          Страница студента
                        </a>),
                        icon: <InfoOutlined />},
                        {key: 2, 
                         label: (
                         <a>
                           Присутствует
                         </a>
                        ),
                         icon : <CheckOutlined />,
                         disabled: student.hasOwnProperty("attendance"), 
                         onClick: () => {console.log("Hi!")}},
                       {key: 3, label: (
                         <a> 
                           Отсутствует 
                         </a>
                       ),
                         icon: <CloseOutlined />, 
                         disabled: !(student.hasOwnProperty("attendance"))}],}} trigger={['contextMenu']}>  
                        <div key={student._id} id={student._id} className={"group-info-student-block-item " + (student.hasOwnProperty("attendance") ? "online-batch-online" : "online-batch-offline")}>
                            <div className="group-info-student-block-item-student-subgroup-batch">{student.subgroup}</div>
                            <span className="group-info-student-block-item-student-credentials">{student.name + " " + student.surname}</span>
                        </div>
                      </Dropdown>
                  )
                })}
              </div>
            </div>

            </div>
            <div id="group-info-now-and-recent-updates-block" className="default-block">
                <div className="group-info-students-block-add-attendance">
                  <span>
                    <InfoCircleOutlined />
                    <span>Недавние действия</span>
                  </span>

                </div>
            </div>
          </div>
      </div>
    );
  }
  
  export default Group;