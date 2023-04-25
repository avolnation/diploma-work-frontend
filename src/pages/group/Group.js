import "../../App.css"
import "./Group.css"

import { useEffect, useState, useForm } from "react";

import { CheckOutlined } from '@ant-design/icons';




const Group = (props) => {

    const [ students, setStudents ] = useState([])

    useEffect(() => {
      fetch("http://localhost:3002/students?group=" + props.match.params.groupId)
      .then(data => data.json())
      .then(students => {
        setStudents(students.students)
      })
    }, [])

    return (
      <div className="App">
          <div id="group-info">
            <div id="group-info-students-block">
                <div id="group-info-students-block-add-attendance" >
                    <CheckOutlined/> 
                    <span>Подтвердить посещение студента</span>
                </div>
                <div id="group-info-students-block-students">
                  {students && students.map(student => {
                    return (
                      <div key={student._id} className="group-info-student-block-item">
                        <div>
                        <span id="online-batch"></span>
                        <span className="group-info-student-block-item-student-credentials">{student.name + " " + student.surname}</span>

                        </div>
                      </div>
                    )
                  })}
                </div>
            </div>
            <div id="group-info-now-and-recent-updates-block">
                <div>Пара сейчас:</div>
                <div>Недавние действия в группе:</div>
            </div>
          </div>
      </div>
    );
  }
  
  export default Group;