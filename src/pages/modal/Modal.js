import { Button, Modal, Input, Form, Radio, Select } from 'antd';
import { useEffect, useState } from 'react';
const ModalWindow = (props) => {

    const API_URL = 'http://localhost:3002'

    const [groupId, setGroupId] = useState("63e4cdbc826646321ed69199");

    const [checkedWeek, setCheckedWeek] = useState("");
    const [checkedSubgroup, setCheckedSubgroup] = useState("");
    const [loading, setLoading] = useState(true);

    const [ groups, setGroups ] = useState([])
    const [ subjects, setSubjects ] = useState([])

    const daysOfTheWeek =  [{value: 'Понедельник', title: 'Понедельник'}, {value: 'Вторник', title: 'Вторник'}, {value: 'Среда', title: 'Среда'}, 
    {value: 'Четверг', title: 'Четверг'}, {value: 'Пятница', title: 'Пятница'}, {value: 'Суббота', title: 'Суббота'}]
    

    const apiFetch = (req) => {
        switch(req){
            case 'get-all-groups': 
            fetch(API_URL + "/groups/get-all-groups")
            .then(result => result.json())
            .then(result => {
                // console.log(result)result.groups
                let groupsToSet = result.groups.map(el => {
                    return {
                        value: el._id,
                        label: el.title
                    }
                })
                setGroups(groupsToSet);
            })
            .catch(err => {
                console.log(err);
                
            })
            break;
            case 'get-subjects-by-group-id':
                fetch(API_URL + "/subjects/get-subjects-by-group/" + groupId)
                .then(result => result.json())
                .then(result => {
                    let subjectsToSet = result.subjects.map(el => {
                        return {
                            value: el._id,
                            label: `${el.title} (${el.abbreviature})`
                        }
                    })
                    setSubjects(subjectsToSet);
                })
        }
    }

    useEffect(() => {
        apiFetch('get-all-groups');
        apiFetch('get-subjects-by-group-id');
    }, [])

    useEffect(() => {
        // console.log(props.subgroup + props.weekParity)
        setCheckedSubgroup(props.subgroup)
        setLoading(false);
    }, [props.subgroup])

    useEffect(() => {
        // console.log(props.weekParity + typeof props.weekParity)
        setCheckedWeek(props.weekParity);
        setLoading(false);
    }, [props.weekParity])



    
  return (
    <>
      <Modal title="Новая пара" open={props.show} onOk={props.modalHandleOk} onCancel={props.modalHandleCancel}>
            {loading ? 
            <span>Loading...</span> : 
            <>
            <Form>
                <Form.Item>
                    <Select defaultValue={props.selectedDay} options={daysOfTheWeek} disabled/>
                </Form.Item>
                <Form.Item>
                    <Radio.Group value={checkedWeek}>
                        <Radio.Button value={"2"}>Каждую неделю</Radio.Button>
                        <Radio.Button value={"1"}>Над чертой</Radio.Button>
                        <Radio.Button value={"0"}>Под чертой</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <Select options={groups}/>
                </Form.Item>
                <Form.Item>
                    <Select options={subjects}/>
                </Form.Item>
                <Form.Item>
                    <Radio.Group value={checkedSubgroup}>
                        <Radio.Button value={"0"}>Общая</Radio.Button>
                        <Radio.Button value={"1"}>Первая</Radio.Button>
                        <Radio.Button value={"2"}>Вторая</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
            </>
}
            
      </Modal>
    </>
  );
};
export default ModalWindow;