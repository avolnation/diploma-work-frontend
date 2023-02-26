import "../../App.css"
import "./ScheduleDivider.css"

import { ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { Tag, Icon, Divider } from "antd"
import Modal from "../modal/Modal";

const ScheduleDivider = (props) =>{

    const [pairModeByDays, setPairModeByDays] = useState([0, 0, 0, 0, 0, 0]);
    const [reloadPairModes, setReloadPairModes] = useState(false);
    const [weekParity, setWeekParity] = useState(2);
    const [subgroup, setSubgroup] = useState("0");
    const [showModal, setShowModal] = useState(false);
    const pairTime = ["9:00 - 10:25", "10:40 - 12:05", "12:25 - 13:50", "14:20 - 15:45", "15:55 - 17:20", "17:30 - 18:55"]

    useEffect(() => {
        setReloadPairModes(false);
    }, [])
    
    
    const modalHandleOk = () => {
        setShowModal(false);
    };
    const modalHandleCancel = () => {
        setShowModal(false);
        // setWeekParity(null)
    };

    const switchPairMode = (e, pairNumber) => {
        let pairModeByDaysTemp = pairModeByDays;
        console.log(pairModeByDays)
        let nextPairModeByDaysTemp = pairModeByDaysTemp[pairNumber] + 1;
        console.log(nextPairModeByDaysTemp)
        
        pairModeByDaysTemp[pairNumber]++

        if(nextPairModeByDaysTemp == 3){
            pairModeByDaysTemp[pairNumber] = 0;
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

    const pairModeView = (pairMode) => {
        if(pairMode == 0){
            return (
            <div style={{"minWidth": "70%", "height": "100px"}}>
                <div className="schedule-one-button" id="0 2" onClick={(e) => infoToModal(e)}>Каждую неделю</div>
            </div>)
        }
        if(pairMode == 1){
            return (<div style={{"minWidth": "70%"}}>
                <div className="schedule-two-buttons upper-button" id="0 1" onClick={(e) => infoToModal(e)}>Над чертой</div>
                <div className="schedule-two-buttons lower-button" id="0 0" onClick={(e) => infoToModal(e)}>Под чертой</div>
            </div>)
        }
        if(pairMode == 2){
            return (
            <div style={{"minWidth": "70%"}}>
                <div>
                    <div className="schedule-pair-buttons left-up-schedule-pair-button" id="1 1" onClick={(e) => infoToModal(e)}>Над чертой | Первая подгруппа</div>
                    <div className="schedule-pair-buttons right-up-schedule-pair-button" id="2 1" onClick={(e) => infoToModal(e)}>Над чертой | Вторая подгруппа</div>
                </div>
                <div>
                    <div className="schedule-pair-buttons left-down-schedule-pair-button" id="1 0" onClick={(e) => infoToModal(e)}>Под чертой | Первая подгруппа</div>
                    <div className="schedule-pair-buttons right-down-schedule-pair-button" id="2 0" onClick={(e) => infoToModal(e)}>Под чертой | Вторая подгруппа</div>
                </div>
            </div>)
        }
    }
    
    return (
        <div className="pair-all-info">
            {
                pairModeByDays.map((el, index) => {
                    return (
                        <>  
                            <div className="each-pair-section">
                            <Tag icon color="#4096ff">
                                {index + 1}
                            </Tag>
                            <Tag icon={<ClockCircleOutlined />} color="default">
                                {pairTime[index]}
                            </Tag>
                            <button className="button-next-pair-mode" id={+index + 1} onClick={(e) => {switchPairMode(e, index); setReloadPairModes(!reloadPairModes)}}><ReloadOutlined /></button>
                                {pairModeView(el)}
                                
                            </div>
                            <Divider />
                        </>
                    )
                })
            }
            <Modal subgroup={subgroup} weekParity={weekParity} show={showModal} modalHandleOk={modalHandleOk} modalHandleCancel={modalHandleCancel} daysOfTheWeek={props.daysOfTheWeek}/>
        </div>
    );
  }
  
  export default ScheduleDivider;