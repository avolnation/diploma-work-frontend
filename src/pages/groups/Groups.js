import "../../App.css"
import "./Groups.css"

const Groups = () =>{
    return (
      <div className="App">
          <div id="header">
            <span className="header-item active">Группы</span>
            <span className="header-item">Расписание групп</span>
            <span className="header-item">Недавние действия</span>
            <span className="header-item">Мой профиль</span>
          </div>
          <div id="groups-info">
            <div>

            </div>
            <span id="groups-info-left-block">Выберите группу из предложенных чтобы просмотреть студентов которые сейчас в университете а так же другую информацию.</span>
            <span id="groups-info-right-block">
                <span className="groups-info-right-block-item">[+]</span>
                <span className="groups-info-right-block-item">МС-42</span>
                <span className="groups-info-right-block-item">МС-32</span>
            </span>
          </div>
      </div>
    );
  }
  
  export default Groups;