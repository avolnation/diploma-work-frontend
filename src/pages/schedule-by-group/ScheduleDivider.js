import "../../App.css"
import "./ScheduleDivider.css"

import { ClockCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Tag, Icon, Divider, Tooltip, Spin } from "antd";
import Modal from "../modal/Modal";
import { setLoadingSubjects, setGroupForSubjects, fetchSubjectsFromApiSucceed, fetchSubjectsFromApiFailed } from '../../redux/reducers/subjectsByGroupSlice';

const ScheduleDivider = (props) =>{

    const API_URL = "http://localhost:3002"
    
    const subjectsFromRedux = useSelector(state => state.subjects);
    const dispatch = useDispatch();

    const [ reloadPairModes, setReloadPairModes ] = useState(false);
    const [ weekParity, setWeekParity ] = useState(2);
    const [ subgroup, setSubgroup ] = useState("0");
    const [ showModal, setShowModal ] = useState(false);
    
    const pairTime = ["9:00 - 10:25", "10:40 - 12:05", "12:25 - 13:50", "14:20 - 15:45", "15:55 - 17:20", "17:30 - 18:55"]

    
    
    const modalHandleOk = () => {
        setShowModal(false);
    };

    const modalHandleCancel = () => {
        setShowModal(false);
        // setWeekParity(null)
    };

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
            subjectsFromRedux.loading 
            ? 
            <Spin/> 
            :
            props.pairModeByDays.map((el, index) => {
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
                            <button className="button-next-pair-mode" id={+index + 1} onClick={(e) => {props.switchPairMode(e, index); setReloadPairModes(!reloadPairModes)}}><ReloadOutlined /></button>
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