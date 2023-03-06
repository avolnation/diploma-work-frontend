import "../../App.css"
import "./ScheduleDivider.css"

import { ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { Tag, Icon, Divider, Tooltip } from "antd"
import Modal from "../modal/Modal";

const ScheduleDivider = (props) =>{

    const API_URL = "http://localhost:3002"

    const [ allPairsByDay, setAllPairsByDay ] = useState([]);

    const [ pairModeByDays, setPairModeByDays ] = useState([{"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}, 
                                                            {"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}, 
                                                            {"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}, 
                                                            {"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}, 
                                                            {"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}, 
                                                            {"pairMode": 0, "additionalInfo": {}, "lockedRefreshButton": false}]);

    const [ reloadPairModes, setReloadPairModes ] = useState(false);
    // const [ loadingPairsFromApi, setLoadingPairsFromApi ] = useState(true);
    const [ weekParity, setWeekParity ] = useState(2);
    const [ subgroup, setSubgroup ] = useState("0");
    const [ showModal, setShowModal ] = useState(false);
    
    const pairTime = ["9:00 - 10:25", "10:40 - 12:05", "12:25 - 13:50", "14:20 - 15:45", "15:55 - 17:20", "17:30 - 18:55"]

    useEffect(() => {
        apiFetch('get-schedule-by-day-and-group');
    }, [])

    useEffect(() => {
        // setReloadPairModes(false);
    }, [])
    
    
    const modalHandleOk = () => {
        setShowModal(false);
    };

    const modalHandleCancel = () => {
        setShowModal(false);
        // setWeekParity(null)
    };

    const apiFetch = (req) => {
        switch(req){
            case 'get-schedule-by-day-and-group': 
                fetch(API_URL + "/schedule/get-schedule-by-day-and-group?day=Понедельник&group=63e4cdbc826646321ed69199")
                .then(result => result.json())
                .then(result => {
                    setAllPairsByDay(result.schedule);

                    //Добавляем в объект pairModeByDays в поле additionalInfo свойства с ID пар (например 1 0, т.е вида subgroup weekParity)
                    let tempPairModeByDays = pairModeByDays;
                    let tempScheduleObject = {};
                    let tempPairMode = 0;
                    
                    result.schedule.forEach((el, index) => {
                        tempScheduleObject = {};
                        el.items.forEach(el => {
                            tempScheduleObject[el.subgroup + " " + el.weekParity] = {
                                "classroom": el.classroom,
                                "subject": el.subject
                            }
                            if((el.subgroup == 1 || el.subgroup == 2) && (el.weekParity == 0 || el.weekParity == 1)){
                                tempPairMode = 2;
                            }
                            if((el.subgroup == 0) && (el.weekParity == 1 || el.weekParity == 2)){
                                tempPairMode = 1;
                            }
                            if(el.subgroup == 0 && el.weekParity == 2){
                                tempPairMode = 0;
                            }
                        }) 
                        tempPairModeByDays[index].additionalInfo = tempScheduleObject;
                        tempPairModeByDays[index].pairMode = tempPairMode;
                    });

                    setPairModeByDays(tempPairModeByDays)
                    return result
                })
                .then((result) => {
                    console.log(pairModeByDays)
                })
                .catch(err => {
                    console.log(err);
                })
            break;
        }
    }

    const switchPairMode = (e, pairNumber) => {
        let pairModeByDaysTemp = pairModeByDays;
        console.log(pairModeByDays)
        let nextPairModeByDaysTemp = pairModeByDaysTemp[pairNumber].pairMode + 1;
        console.log(nextPairModeByDaysTemp)
        
        pairModeByDaysTemp[pairNumber].pairMode++

        if(nextPairModeByDaysTemp == 3){
            pairModeByDaysTemp[pairNumber].pairMode = 0;
            setPairModeByDays(pairModeByDaysTemp);
        }
        else{
            setPairModeByDays(pairModeByDaysTemp);
        }
        
    }

    const infoToModal = (event) => {
        const weekParityAndSubgroup = event.target.id.split(" ");
        setSubgroup(weekParityAndSubgroup[0]);
        setWeekParity(weekParityAndSubgroup[1]);
        setShowModal(true)
    }

    const pairModeView = (el) => {
        if(el.pairMode == 0){
            return (
                <>
                { el.additionalInfo["0 2"] ? 
                    
                        <div style={{"minWidth": "70%", "height": "100px"}}>
                            <div className="schedule-one-button" id="0 2" onClick={(e) => infoToModal(e)}>{el.additionalInfo["0 2"].subject[0].abbreviature }</div>
                        </div>
                    :
                    <div style={{"minWidth": "70%", "height": "100px"}}>
                        <div className="schedule-one-button" id="0 2" onClick={(e) => infoToModal(e)}>Каждую неделю</div>
                    </div>
                }
                </>
            
            )
        }
        if(el.pairMode == 1){
            return (<div style={{"minWidth": "70%"}}>
                {
                    el.additionalInfo["0 1"] 
                    ?
                    <div className="schedule-two-buttons upper-button" id="0 1" onClick={(e) => infoToModal(e)}>{el.additionalInfo["0 1"].subject[0].abbreviature   }</div> 
                    :
                    <div className="schedule-two-buttons upper-button" id="0 1" onClick={(e) => infoToModal(e)}>Над чертой</div>
                }
                {
                    el.additionalInfo["0 0"] 
                    ?
                    <div className="schedule-two-buttons lower-button" id="0 0" onClick={(e) => infoToModal(e)}>{el.additionalInfo["0 0"].subject[0].abbreviature   }</div> 
                    :
                    <div className="schedule-two-buttons lower-button" id="0 0" onClick={(e) => infoToModal(e)}>Под чертой</div>
                }
                 
            </div>)
        }
        if(el.pairMode == 2){
            return (
            <div style={{"minWidth": "70%"}}>
                <div>
                    {
                        el.additionalInfo["1 1"] 
                        ?
                        <div className="schedule-pair-buttons left-up-schedule-pair-button" id="1 1" onClick={(e) => infoToModal(e)}>{el.additionalInfo["1 1"].subject[0].abbreviature  }</div> 
                        :
                        <div className="schedule-pair-buttons left-up-schedule-pair-button" id="1 1" onClick={(e) => infoToModal(e)}>Над чертой | Первая подгруппа</div>
                    }
                    {
                        el.additionalInfo["2 1"] 
                        ?
                        <div className="schedule-pair-buttons right-up-schedule-pair-button" id="2 1" onClick={(e) => infoToModal(e)}>{el.additionalInfo["2 1"].subject[0].abbreviature }</div> 
                        :
                        <div className="schedule-pair-buttons right-up-schedule-pair-button" id="2 1" onClick={(e) => infoToModal(e)}>Над чертой | Вторая подгруппа</div>
                    }
                    </div>
                    <div>
                    {
                        el.additionalInfo["1 0"] 
                        ?
                        <div className="schedule-pair-buttons left-down-schedule-pair-button" id="1 0" onClick={(e) => infoToModal(e)}>{el.additionalInfo["1 0"].subject[0].abbreviature    }</div> 
                        :
                        <div className="schedule-pair-buttons left-down-schedule-pair-button" id="1 0" onClick={(e) => infoToModal(e)}>Под чертой | Первая подгруппа</div>
                    }
                    {
                        el.additionalInfo["2 0"] 
                        ?
                        <div className="schedule-pair-buttons right-down-schedule-pair-button" id="2 0" onClick={(e) => infoToModal(e)}>{el.additionalInfo["2 0"].subject[0].abbreviature   }</div> 
                        :
                        <div className="schedule-pair-buttons right-down-schedule-pair-button" id="2 0" onClick={(e) => infoToModal(e)}>Под чертой | Вторая подгруппа</div>
                    }
                    </div>
            </div>)
        }
    }
    
    const renderPairsModeByDays = () => {
        return (
            pairModeByDays.map((el, index) => {
                return (
                    <>  
                        <div className="each-pair-section">
                        <Tooltip title="Номер пары">
                            <Tag icon color="#4096ff" style={{"marginLeft": "10px"}}>
                                {index + 1}
                            </Tag>
                        </Tooltip>
                        <Tooltip title="Время пары">
                            <Tag icon={<ClockCircleOutlined />} color="default">
                                {pairTime[index]}
                            </Tag>
                        </Tooltip>
                        {
                            <button className="button-next-pair-mode" id={+index + 1} onClick={(e) => {switchPairMode(e, index); setReloadPairModes(!reloadPairModes)}}><ReloadOutlined /></button>
                        }
                        
                            {pairModeView(el)} 
                        </div>
                        <Divider />
                    </>
                )
            })
        )
    }

    return (
        <div className="pair-all-info">
            {/* { loadingPairsFromApi ? <span> Loading...</span> : */}
            {
                renderPairsModeByDays()
            }
            <Modal subgroup={subgroup} weekParity={weekParity} show={showModal} modalHandleOk={modalHandleOk} modalHandleCancel={modalHandleCancel} selectedDay={props.selectedDay}/>
        </div>
    );
  }
  
  export default ScheduleDivider;