import { Button } from 'antd';
import './Main.css'
import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    useRouteMatch,
} from "react-router-dom";

import { DesktopOutlined , DatabaseOutlined , TagsOutlined , UserOutlined, TeamOutlined } from "@ant-design/icons";
import { HiChevronRight } from "react-icons/hi"

const Main = (props) => {
    return (
        <div className="App"> 
            <div className="main-page-project-name">
                Система контроля посещаемости учебных занятий на основе RFID-меток студенческих билетов
            </div>
            <div className="main-page categories">
                <div className="main-page-about-column-about">
                    <span className="main-page-about-column-welcome-title">Добро пожаловать.</span>
                    <span className="main-page-about-column-description">
                            Вы находитесь на главной странице проекта. Для навигации по проекту можно воспользоваться
                        навигационной панелью или кнопками, расположенными правее. Целью данного проекта была разработка системы 
                        контроля посещаемости студентов на основе RFID-меток.
                    </span>
                </div>
                <div className="main-page nav-rows">
                    <div className="main-page-groups-nav-row">
                        <div className="main-page-groups-nav-info">
                            <div className="main-page-groups-nav-icon">
                                <TeamOutlined style={{"fontSize": "24px", "color": "#FFF"}}/>
                            </div>
                            <div>
                                <span className="main-page groups-nav title">Список групп </span>
                                <span className="main-page groups-nav description"> а также их расписание </span>
                            </div>
                        </div>
                        <Link className="main-page-link" to="/groups">К группам <HiChevronRight/></Link>
                    </div>
                    <div className="main-page-groups-nav-row">
                        <div className="main-page-groups-nav-info">
                            <div className="main-page-groups-nav-icon">
                                <UserOutlined style={{"fontSize": "24px", "color": "#FFF"}}/>
                            </div>
                            <div>
                                <span className="main-page-groups-nav-title">Профиль пользователя </span>
                                <span className="main-page-groups-nav-description"> а также безопасность </span>
                            </div>
                        </div>
                        <Link className="main-page-link" to="/profile">В профиль <HiChevronRight/></Link>
                    </div>
                </div>
            </div>
            <div className="main-page-system-made-of">
                <div className="main-page-system-made-of-description">
                    Система состоит из трёх частей:
                </div>
                <div className="main-page-system-parts">
                <div className="main-page-system-parts-system-part">
                    <div className="main-page-system-part wrapper">
                        <div className="main-page-groups-nav-icon">
                            <DesktopOutlined style={{"fontSize": "24px", "color": "#FFF"}}/>
                        </div>
                        <div className="main-page groups-nav part-description">
                            <span>Клиентская часть</span>
                            <span>отображение данных</span>
                        </div>
                    </div>
                </div>
                <div className="main-page-system-parts-system-part">
                    <div className="main-page-system-part wrapper">
                        <div className="main-page-groups-nav-icon">
                            <DatabaseOutlined style={{"fontSize": "24px", "color": "#FFF"}}/>
                        </div>
                        <div className="main-page groups-nav part-description">
                                <span>Серверная часть</span>
                                <span>обработка данных</span>    
                        </div>
                    </div>
                </div>
                <div className="main-page-system-parts-system-part">
                    <div className="main-page-system-part wrapper">
                        <div className="main-page-groups-nav-icon">
                            <TagsOutlined style={{"fontSize": "24px", "color": "#FFF"}}/>
                        </div>
                        <div className="main-page groups-nav part-description">
                                <span>Аппаратная часть</span>
                                <span>внесение данных</span>    
                        </div>
                    </div>
                </div>
            </div>
            </div>

        </div>
    )
}

export default Main;