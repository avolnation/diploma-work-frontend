import "../../App.css"
import "./Group.css"

import { useEffect, useState, useForm } from "react";
import { Skeleton, Tooltip, Dropdown, message } from "antd";
import { CheckOutlined, ClockCircleOutlined, FrownOutlined, InfoOutlined, TeamOutlined, LoadingOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const Group = (props) => {

    const API_BASE_URL = process.env.REACT_APP_BASE_URL;
    const groupId = props.match.params.groupId;
    const timeNow = 1682943900000;
    // const timeNow = 1680518460000;
    // const timeNow = new Date().getTime();

    const [ students, setStudents ] = useState([])
    const [ pairInfo, setPairInfo ] = useState({})
    const [ pairNow, setPairNow ] = useState([])
    // const [ attendances, setAttendances ] = useState([])
    const [ loadingPairInfo, setLoadingPairInfo ] = useState(true)
    const [ loadingStudents, setLoadingStudents ] = useState(true)
    const [ searchStudentInput, setSearchStudentInput] = useState("")

    useEffect(() => {
      console.log(students)
    }, [students])

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

        fetchStudentsWithAttendance(pairData);
        
        fetch(`${API_BASE_URL}schedule?pairNumber=${pairData.pairNumber}&dayOfTheWeek=${pairData.dayOfTheWeek}&group=${groupId}`)
        .then(response => response.json())
        .then(pairs => {
          setPairNow(pairs.pairs)
          setLoadingPairInfo(false)
          recentUpdatesHandler(pairs.pairs, pairData.weekParity, pairData.pairEnds, pairData.pairStarts)
        })
      })
    })
  }, [])

  // TODO : Refresh attendances every X seconds (???)
  useEffect(() => {
    
  }, []) 

    const fetchStudentsWithAttendance = (pairInfo) => {
      
      setLoadingStudents(true);

      fetch(`${API_BASE_URL}students?group=${groupId}`)
      .then(response => response.json())
      .then(students => {
        fetch(`${API_BASE_URL}attend?lte=${pairInfo.pairEnds}&gte=${pairInfo.pairStarts}`)
          .then(response => response.json())
          .then(attendances => {

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

          setStudents(mappedStudents);

          setLoadingStudents(false);

    }) 
  })
  }

    const recentUpdatesHandler = (pairs, weekParity, lte, gte) => {
      const subgroups = [];

      const filteredPairs = pairs.filter(pair => pair.weekParity == weekParity)

      console.log(filteredPairs);

      filteredPairs.forEach(pair => {
        if(!(subgroups.includes(pair.subgroup))){
          subgroups.push(pair.subgroup);
        }
      })

      let paramsString = filteredPairs.map((pair, index) => {
        return `subject[${index}]=${pair.subject._id}&`
      }).join("")

      paramsString = paramsString.slice(0, -1)

      fetch(`${API_BASE_URL}attend?${paramsString}&lte=${lte}&gte=${gte}`)
      .then(response => response.json())
      .then(response => {
        console.log(response)
      })

      // console.log(subgroups)


    }

    const attendanceHandler = (student, attendanceId, action) => {
      switch(action){
        case "register":
          // TODO: register attendance (fetch) (flag fromClient !!!)
          let pair = pairNow.filter(pair => pair.subgroup == 0 || student.subgroup)
          if(pair){
            let data = {
              date: timeNow,
              student: student._id,
              subject: pair[0].subject._id,
              fromClient: true
            }
            fetch(`${API_BASE_URL}attend/`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)})
            // TODO: Notification (success, error)
            .then(response =>  response.json())
            .then(response => {

              response.status == "success" ? message.success({content: response.message, duration: 2, style: {marginTop: '5vh',}}) : message.error({content: response.message, duration: 2, style: {marginTop: '5vh',}});

              fetchStudentsWithAttendance(pairInfo);

            })

          }  
        break; 
        case "unregister":   
          fetch(`${API_BASE_URL}attend?_id=${attendanceId}&student=${student}`, {method: "DELETE"})
          .then(response => response.json())
          .then(response => {
            
              response.status == "success" ? message.success({content: response.message, duration: 2, style: {marginTop: '5vh',}}) : message.error({content: response.message, duration: 2, style: {marginTop: '5vh',}});

              fetchStudentsWithAttendance(pairInfo);
          })
        break;
      }
    }

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
              <span className="pair-line pair-info-pair-title"><span className="title">Предмет:</span><span className="text">{filteredPairs[0].subject.title}</span></span>
              <span className="pair-line pair-info-pair-lecturer"><span className="title">Преподаватель:</span><span className="text">{filteredPairs[0].subject.lecturer}</span></span>
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
                <span className="pair-line pair-info-pair-subgroup"><span className="title">Подгруппа:</span><span className="text">{`${filteredPairs[0].subgroup} п-па.`}</span></span>
                <span className="pair-line pair-info-pair-title"><span className="title">Предмет:</span><span className="text">{filteredPairs[0].subject.title}</span></span>
                <span className="pair-line pair-info-pair-lecturer"><span className="title">Преподаватель:</span><span className="text">{filteredPairs[0].subject.lecturer}</span></span>
                <span className="pair-line pair-info-pair-classroom"><span className="title">Аудитория:</span><span className="text">{`${filteredPairs[0].classroom}`}</span></span>
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
                <span className="pair-line pair-info-pair-subgroup"><span className="title">Подгруппа:</span><span className="text">{`${filteredPairs[0].subgroup} п-па.`}</span></span>
                  <span className="pair-line pair-info-pair-title"><span className="title">Предмет:</span><span className="text">{filteredPairs[0].subject.title}</span></span>
                  <span className="pair-line pair-info-pair-lecturer"><span className="title">Преподаватель:</span><span className="text">{filteredPairs[0].subject.lecturer}</span></span>
                  <span className="pair-line pair-info-pair-classroom"><span className="title">Аудитория:</span><span className="text">{`${filteredPairs[0].classroom}`}</span></span>
                </div>
              </>
            )
          }
          else {
            return (
              <>
                  <div className="group-info-pair-now-block-pair-info">
                    <span className="pair-line pair-info-pair-subgroup"><span className="title">Подгруппа:</span><span className="text">{`${filteredPairs[0].subgroup} п-па.`}</span></span>
                    <span className="pair-line pair-info-pair-title"><span className="title">Предмет:</span><span className="text">{filteredPairs[0].subject.title}</span></span>
                    <span className="pair-line pair-info-pair-lecturer"><span className="title">Преподаватель:</span><span className="text">{filteredPairs[0].subject.lecturer}</span></span>
                    <span className="pair-line pair-info-pair-classroom"><span className="title">Аудитория:</span><span className="text">{`${filteredPairs[0].classroom}`}</span></span>
                  </div>
                  <hr/>
                  <div className="group-info-pair-now-block-pair-info">
                    <span className="pair-line pair-info-pair-subgroup"><span className="title">Подгруппа:</span><span className="text">{`${filteredPairs[1].subgroup} п-па.`}</span></span>
                    <span className="pair-line pair-info-pair-title"><span className="title">Предмет:</span><span className="text">{filteredPairs[1].subject.title}</span></span>
                    <span className="pair-line pair-info-pair-lecturer"><span className="title">Преподаватель:</span><span className="text">{filteredPairs[1].subject.lecturer}</span></span>
                    <span className="pair-line pair-info-pair-classroom"><span className="title">Аудитория:</span><span className="text">{`${filteredPairs[1].classroom}`}</span></span>
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
              : <Skeleton />}
              </div>
            </div>
            <div id="group-info-students-all-block" className="default-block">
              <div className="group-info-students-block-add-attendance">
                      <TeamOutlined />
                      <span>Посещение занятия студентами</span>
              </div>
              <input type="text" placeholder="Введите имя или фамилию студента..." onChange={(e) => setSearchStudentInput(e.target.value)}/>
              <div id="group-info-students-block-students">
                {loadingStudents ? [1,2,3,4,5,6].map(element => {
                   return (
                    <Skeleton.Button className="group-info-student-block-item"/>
                  )
                }) : 
                  students && filterStudentsHandler().map(student => {
                  return (
                      <Dropdown menu={{items: [{ key: 1, 
                        label: (
                        <Link to={`/student/${student._id}`}>
                          Страница студента
                        </Link>
                        ),
                        icon: <InfoOutlined />},
                        {key: 2, 
                         label: (
                         <a>
                           Присутствует
                         </a>
                        ),
                         icon : <CheckOutlined />,
                         disabled: student.hasOwnProperty("attendance"), 
                         onClick: () => {attendanceHandler(student, "", "register")}},
                       {key: 3, 
                        label: (
                         <a> 
                           Отсутствует 
                         </a>
                        ),
                         icon: <CloseOutlined />, 
                         disabled: !(student.hasOwnProperty("attendance")), 
                         onClick: () => {attendanceHandler(student._id, student.attendance._id, "unregister")}}],}} trigger={['contextMenu']}>  
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
                  <div>

                  </div>
                </div>
                <div className="group-info-recent-updates">

                </div>
            </div>
          </div>
      </div>
    );
  }
  
  export default Group;