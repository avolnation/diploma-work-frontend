import "../../App.css"
import "./Group.css"

const Group = () =>{
    return (
      <div className="App">
          <div id="group-info">
            <div id="group-info-students-block">
                <div className="group-info-student-block-item">Папапева</div>
                <div className="group-info-student-block-item">Гемабоди</div>
                <div className="group-info-student-block-item">Папапева 2</div>
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