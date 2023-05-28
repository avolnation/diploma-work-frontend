import "../../App.css"
import "./ScheduleDivider.css"

import { ClockCircleOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState, useForm } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Popconfirm, Menu, Space, Tag, Icon, Divider, Tooltip, Spin, Button, Modal, Input, Form, Radio, Select, Tabs, Skeleton, Dropdown } from "antd";
import { setLoadingGroups, fetchGroupsFromApiSucceed, fetchGroupsFromApiFailed } from '../../redux/reducers/groupsSlice';

const ScheduleDivider = (props) => {

    const API_BASE_URL = process.env.REACT_APP_BASE_URL;
    const REPLACE_FLAG = true;

    const pairMenu = [
        {
            key: 1, 
            label: (
                    <span>
                        Редактировать
                    </span> 
            ),
            icon: <EditOutlined/> },
        {
            key: 2, 
            label: (
                <Popconfirm placement="topRight" onConfirm title={`Вы действительно хотите удалить «»?`} okText="Да" cancelText="Нет">
                    Удалить
                </Popconfirm> 
            ),
            icon: <DeleteOutlined/>,
            danger: true}
    ];
    
    const subjectsFromRedux = useSelector(state => state.subjects);
    const groupsFromRedux = useSelector(state => state.groups)
    const dispatch = useDispatch()

    const [ loading, setLoading ] = useState(true);
    const [ newScheduleForm ] = Form.useForm();

    const [ reloadPairModes, setReloadPairModes ] = useState(false);
    const [ showModal, setShowModal ] = useState(false);
    const [ showExistingPairModal, setShowExistingPairModal ] = useState(false);
    const [ pairNumber, setPairNumber ] = useState("1");

    const [ pairWarningMessage, setPairWarningMessage ] = useState('');

    const [ editPairForm ] = Form.useForm()
    const [ showEditPairModal, setShowEditPairModal] = useState(false)
    const [ loadingEditPairModal, setLoadingEditPairModal ] = useState(true)
    
    const pairTime = ["9:00 - 10:25", "10:40 - 12:05", "12:25 - 13:50", "14:20 - 15:45", "15:55 - 17:20", "17:30 - 18:55"]    

    const onContextMenuUse = (weekParity, subgroup, index) => {
        
        setLoadingEditPairModal(false)

        // setLoadingEditPairModal(true)
        editPairForm.setFieldsValue({dayOfTheWeek: props.selectedDay, weekParity: weekParity, subgroup: subgroup, group: props.groupId, pairNumber: index + 1});
        // setShowEditPairModal(true)
        // props.selectedDay 
        // TODO: find pair by weekParity, subgroup and day, then fetch, open modal and update if it needed
        // fetch("http://localhost:3002/schedule/")
    }

    const onDropdownUse = (obj) => {
        console.log(obj.key)
        if(obj.key == 1){
            setShowEditPairModal(true)
        }
    }

    // Функция для закрытия модального окна и очистки полей в форме
    const modalHandleCancel = () => {
        setShowModal(false);
        newScheduleForm.resetFields()
    };

    const editPairModalCancel = () => {
        setShowEditPairModal(false)
        editPairForm.resetFields()
    }

    const existingPairModalCancel = () => {
        setShowExistingPairModal(false);
    }

    // Функция передачи информации в модальное окно
    const infoToNewPairModal = async (event, idx) => {
        setPairNumber(idx + 1);
        const weekParityAndSubgroup = event.target.id.split(" ");
        newScheduleForm.setFieldsValue({"dayOfTheWeek": props.selectedDay, "weekParity": weekParityAndSubgroup[1], "subgroup": weekParityAndSubgroup[0], group: props.groupId});
        setLoading(false);
        setShowModal(true);
    }

    // 
    const newPairHandler = (flag) => {

        const formData = new FormData();
    
        console.log(newScheduleForm.getFieldsValue())
      
        formData.append('dayOfTheWeek', props.selectedDay);
        formData.append('weekParity', +newScheduleForm.getFieldValue("weekParity"));
        formData.append('group', newScheduleForm.getFieldValue("group"));
        formData.append('subject', newScheduleForm.getFieldValue("subject"));
        formData.append('subgroup', +newScheduleForm.getFieldValue("subgroup"));
        formData.append('pairNumber', pairNumber);

        // console.log(e);
        if(flag){
            formData.append('replace_flag', true)
        }
    
        const data = JSON.stringify(Object.fromEntries(formData))
      
        fetch(`${API_BASE_URL}schedule/`, 
        {method: 'POST', 
        body: data, headers: {'Content-Type':'application/json'}})
        .then(res => {
            return res.json()
        })
        .then(res => {
            if(res.status == 'warning'){
                setShowExistingPairModal(true);
                setPairWarningMessage(res.message);
            }
            else {
                newScheduleForm.resetFields();
                modalHandleCancel();
            }
        })
        // .then(() => {
        //     newScheduleForm.resetFields();
        //     // props.modalHandleCancel();
        // })
      }


    // TODO: Fetch(POST запрос) (отправка на сервер новой информации о паре)
    const editPairHandler = () => {

        const formData = new FormData();

        formData.append('dayOfTheWeek', props.selectedDay);
        formData.append('weekParity', +editPairForm.getFieldValue("weekParity"));
        formData.append('group', editPairForm.getFieldValue("group"));
        formData.append('subject', editPairForm.getFieldValue("subject"));
        formData.append('subgroup', +editPairForm.getFieldValue("subgroup"));
        formData.append('pairNumber', +editPairForm.getFieldValue("pairNumber"));

        const data = JSON.stringify(Object.fromEntries(formData))
        fetch(`${API_BASE_URL}schedule/edit-schedule`, {
            method: 'POST',
            body: data, headers: {'Content-Type':'application/json'}
            })
        .then(res => res.json())
        .then(res => {
            console.log(res);
        })
    }

    const pairModeView = (el, index) => {
        if(el.pairMode == 0){
            return (
                <>
                { el.additionalInfo["0 2"] ? 
                    <Dropdown menu={{items: pairMenu, onClick: (e) => onDropdownUse(e)}} trigger={['contextMenu']} onContextMenu={() => onContextMenuUse(2,0, index)}>
                            <div style={{"minWidth": "70%", "height": "100px"}}>
                                <div className="schedule-one-button" id="0 2" >
                                    <span className="schedule-subject-abbreviature">
                                        {el.additionalInfo["0 2"].subject[0].abbreviature}
                                    </span>
                                    <span className="schedule-subject-lecturer">
                                    {el.additionalInfo["0 2"].subject[0].lecturer}
                                    </span>
                                    <span className="schedule-subject-classroom">
                                    {el.additionalInfo["0 2"].classroom}
                                    </span>
                                </div>
                            </div>
                    </Dropdown>
                    :
                    <div style={{"minWidth": "70%", "height": "100px"}}>
                        <div className="schedule-one-button" id="0 2" onClick={(e) => infoToNewPairModal(e, index)}>Каждую неделю</div>
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
                    <Dropdown menu={{items: pairMenu, onContextMenu: (e) => onDropdownUse(e)}} trigger={['contextMenu']} onContextMenu={() => onContextMenuUse(el.additionalInfo["0 1"].subject[0]["_id"])}>
                        <div className="schedule-two-buttons upper-button" id="0 1" >
                            <span className="schedule-subject-abbreviature">
                                {el.additionalInfo["0 1"].subject[0].abbreviature}
                            </span>
                            <span className="schedule-subject-lecturer">
                                {el.additionalInfo["0 1"].subject[0].lecturer}
                            </span>
                            <span className="schedule-subject-classroom">
                                {el.additionalInfo["0 1"].classroom}
                            </span> 
                        </div> 
                    </Dropdown>
                    :
                    <div className="schedule-two-buttons upper-button" id="0 1" onClick={(e) => infoToNewPairModal(e, index)}>Над чертой</div>
                }
                {
                    el.additionalInfo["0 0"] 
                    ?
                    <Dropdown menu={{items: pairMenu, onContextMenu: (e) => onDropdownUse(e)}} trigger={['contextMenu']} onContextMenu={() => onContextMenuUse(el.additionalInfo["0 0"].subject[0]["_id"])}>
                        <div className="schedule-two-buttons lower-button" id="0 0" >
                            <span className="schedule-subject-abbreviature">
                                {el.additionalInfo["0 0"].subject[0].abbreviature}
                            </span>
                            <span className="schedule-subject-lecturer">
                                {el.additionalInfo["0 0"].subject[0].lecturer}
                            </span>
                            <span className="schedule-subject-classroom">
                                {el.additionalInfo["0 0"].classroom}
                            </span>     
                        </div> 
                    </Dropdown>
                    :
                    <div className="schedule-two-buttons lower-button" id="0 0" onClick={(e) => infoToNewPairModal(e, index)}>Под чертой</div>
                }
                 
            </div>)
        }
        if(el.pairMode == 2){
            return (
            <div style={{"minWidth": "70%"}}>
                <div className="schedule-items-row">
                    {
                        el.additionalInfo["1 1"] 
                        ?
                        <Dropdown menu={{items: pairMenu, onContextMenu: (e) => onDropdownUse(e)}} trigger={['contextMenu']} onContextMenu={() => onContextMenuUse(el.additionalInfo["1 1"].subject[0]["_id"])}>
                            <div className="schedule-pair-buttons left-up-schedule-pair-button" id="1 1" >
                                <span className="schedule-subject-abbreviature">
                                    {el.additionalInfo["1 1"].subject[0].abbreviature}
                                </span>
                                <span className="schedule-subject-lecturer">
                                    {el.additionalInfo["1 1"].subject[0].lecturer}
                                </span>
                                <span className="schedule-subject-classroom">
                                    {el.additionalInfo["1 1"].classroom}
                                </span>    
                            </div> 
                        </Dropdown>
                        :
                        <div className="schedule-pair-buttons left-up-schedule-pair-button" id="1 1" onClick={(e) => infoToNewPairModal(e, index)}>Над чертой | Первая подгруппа</div>
                    }
                    {
                        el.additionalInfo["2 1"] 
                        ?
                        <Dropdown menu={{items: pairMenu, onContextMenu: (e) => onDropdownUse(e)}} trigger={['contextMenu']} onContextMenu={() => onContextMenuUse(el.additionalInfo["2 1"].subject[0]["_id"])}>
                            <div className="schedule-pair-buttons right-up-schedule-pair-button" id="2 1" >
                                <span className="schedule-subject-abbreviature">
                                        {el.additionalInfo["2 1"].subject[0].abbreviature}
                                </span>
                                <span className="schedule-subject-lecturer">
                                    {el.additionalInfo["2 1"].subject[0].lecturer}
                                </span>
                                <span className="schedule-subject-classroom">
                                    {el.additionalInfo["2 1"].classroom}
                                </span>
                            </div> 
                        </Dropdown>
                        :
                        <div className="schedule-pair-buttons right-up-schedule-pair-button" id="2 1" onClick={(e) => infoToNewPairModal(e, index)}>Над чертой | Вторая подгруппа</div>
                    }
                    </div>
                    <div className="schedule-items-row">
                    {
                        el.additionalInfo["1 0"]
                        ?
                        <Dropdown menu={{items: pairMenu, onContextMenu: (e) => onDropdownUse(e)}} trigger={['contextMenu']} onContextMenu={() => onContextMenuUse(el.additionalInfo["1 0"].subject[0]["_id"])}>
                            <div className="schedule-pair-buttons left-down-schedule-pair-button" id="1 0">
                            <span className="schedule-subject-abbreviature">
                                    {el.additionalInfo["1 0"].subject[0].abbreviature}
                                </span>
                                <span className="schedule-subject-lecturer">
                                    {el.additionalInfo["1 0"].subject[0].lecturer}
                                </span>
                                <span className="schedule-subject-classroom">
                                    {el.additionalInfo["1 0"].classroom}
                                </span>    
                            </div> 
                        </Dropdown>
                        :
                        <div className="schedule-pair-buttons left-down-schedule-pair-button" id="1 0" onClick={(e) => infoToNewPairModal(e, index)}>Под чертой | Первая подгруппа</div>
                    }
                    {
                        el.additionalInfo["2 0"] 
                        ?
                        <Dropdown menu={{items: pairMenu, onContextMenu: (e) => onDropdownUse(e)}} trigger={['contextMenu']} onContextMenu={() => onContextMenuUse(el.additionalInfo["2 0"].subject[0]["_id"])}>
                            <div className="schedule-pair-buttons right-down-schedule-pair-button" id="2 0" >
                                <span className="schedule-subject-abbreviature">
                                    {el.additionalInfo["2 0"].subject[0].abbreviature}
                                </span>
                                <span className="schedule-subject-lecturer">
                                    {el.additionalInfo["2 0"].subject[0].lecturer}
                                </span>
                                <span className="schedule-subject-classroom">
                                    {el.additionalInfo["2 0"].classroom}
                                </span>
                            </div> 
                        </Dropdown>
                        :
                        <div className="schedule-pair-buttons right-down-schedule-pair-button" id="2 0" onClick={(e) => infoToNewPairModal(e, index)}>Под чертой | Вторая подгруппа</div>
                    }
                    </div>
            </div>)
        }
    }
    
    return (
        <>
            <div className="pair-all-info">
            {/* { loadingPairsFromApi ? <span> Loading...</span> : */}
            {
                subjectsFromRedux.loading ? 
                <Skeleton/>
                :
                props.pairModeByDays.map((el, index) => {
                    return (
                        <>  
                            <div className="each-pair-section">
                            <Tooltip title="Номер пары">
                                <Tag icon color="#b05500" style={{"marginLeft": "10px"}}>
                                    {index + 1}
                                </Tag>
                            </Tooltip>
                            <Tooltip title="Время пары">
                                <Tag icon={<ClockCircleOutlined />} color="default">
                                    {pairTime[index]}
                                </Tag>
                            </Tooltip>
                            {
                                Object.keys(el.additionalInfo).length >= 1 ? 
                                <Tooltip title="Внимание! При выборе следующего режима и добавлении пары, существующие удалятся">
                                    <button className="button-next-pair-mode" id={+index + 1} onClick={(e) => {props.switchPairMode(e, index); setReloadPairModes(!reloadPairModes)}}><ReloadOutlined /></button>
                                </Tooltip> 
                                :
                                <button className="button-next-pair-mode" id={+index + 1} onClick={(e) => {props.switchPairMode(e, index); setReloadPairModes(!reloadPairModes)}}><ReloadOutlined /></button>
                            }
                                {pairModeView(el, index)} 
                            </div>
                            <Divider />
                        </>
                    )
                })
            }
            </div>
            <Modal title="Новая пара" open={showModal} onCancel={modalHandleCancel} footer={false}>
                {loading ? 
                <Skeleton/> : 
                <>
                <Form style={{"marginTop": "5%"}} form={newScheduleForm} onFinish={() => newPairHandler()}>
                    <Form.Item name="dayOfTheWeek">
                        <Select options={props.daysOfTheWeek} disabled/>
                    </Form.Item>
                    <Form.Item name="weekParity">
                        <Radio.Group>
                            <Radio.Button value={"2"}>Каждую неделю</Radio.Button>
                            <Radio.Button value={"1"}>Над чертой</Radio.Button>
                            <Radio.Button value={"0"}>Под чертой</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="group" rules={[{required: true, message: "Пожалуйста, выберите группу!"}]}>
                        <Select options={groupsFromRedux?.groups}/>
                    </Form.Item>
                    <Form.Item name="subject" rules={[{required: true, message: "Пожалуйста, выберите предмет!"}]}>
                        <Select options={subjectsFromRedux?.allSubjects}/>
                    </Form.Item>
                    <Form.Item name="subgroup" labelCol={{span: 4}}>
                        <Radio.Group>
                            <Radio.Button value={"0"}>Общая</Radio.Button>
                            <Radio.Button value={"1"}>Первая</Radio.Button>
                            <Radio.Button value={"2"}>Вторая</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button id="submit" type="primary" htmlType="submit">Сохранить</Button>
                    </Form.Item>
                </Form>
                </>
                }  
            </Modal>
            <Modal title="Внимание!" open={showExistingPairModal} footer={false} onCancel={existingPairModalCancel}>
                <p>{pairWarningMessage && pairWarningMessage}</p>
                <Space>
                    <Button type="primary" onClick={() => newPairHandler(REPLACE_FLAG)} danger>Заменить</Button>
                    <Button onClick={() => existingPairModalCancel()}>Оставить существующую</Button>
                </Space>
            </Modal>
            <Modal title="Редактирование" open={showEditPairModal} footer={false} onCancel={editPairModalCancel}>
            {loadingEditPairModal ? 
                <Skeleton/> : 
                <Form style={{"marginTop": "5%"}} form={editPairForm} onFinish={() => editPairHandler()}>
                    <Form.Item name="dayOfTheWeek">
                        <Select options={props.daysOfTheWeek} disabled/>
                    </Form.Item>
                    <Form.Item name="weekParity">
                        <Radio.Group>
                            <Radio.Button value={2}>Каждую неделю</Radio.Button>
                            <Radio.Button value={1}>Над чертой</Radio.Button>
                            <Radio.Button value={0}>Под чертой</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="group" rules={[{required: true, message: "Пожалуйста, выберите группу!"}]}>
                        <Select options={groupsFromRedux?.groups}/>
                    </Form.Item>
                    <Form.Item name="subject" rules={[{required: true, message: "Пожалуйста, выберите предмет!"}]}>
                        <Select options={subjectsFromRedux?.allSubjects}/>
                    </Form.Item>
                    <Form.Item name="subgroup" labelCol={{span: 4}}>
                        <Radio.Group>
                            <Radio.Button value={0}>Общая</Radio.Button>
                            <Radio.Button value={1}>Первая</Radio.Button>
                            <Radio.Button value={2}>Вторая</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button id="submit" type="primary" htmlType="submit">Обновить</Button>
                    </Form.Item>
                </Form>
            }
            </Modal>
        </>
    );
  }
  
  export default ScheduleDivider;