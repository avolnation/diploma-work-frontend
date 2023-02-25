import { Button, Modal, Input, Form, Radio } from 'antd';
import { useEffect, useState } from 'react';
const ModalWindow = (props) => {

    const [checkedWeek, setCheckedWeek] = useState("");
    const [checkedSubgroup, setCheckedSubgroup] = useState("");
    const [loading, setLoading] = useState(true);

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
      <Modal title="Basic Modal" open={props.show} onOk={props.modalHandleOk} onCancel={props.modalHandleCancel}>
            {loading ? 
            <span>Loading...</span> : 
            <>
            <Form>
                <Form.Item>
                    <Input placeholder='День недели(тут будет Select)'></Input>
                </Form.Item>
                <Form.Item>
                    <Radio.Group value={checkedWeek}>
                        <Radio.Button value={"2"}>Каждую неделю</Radio.Button>
                        <Radio.Button value={"1"}>Над чертой</Radio.Button>
                        <Radio.Button value={"0"}>Под чертой</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <Input placeholder='Группа(тут тоже Select)'></Input>
                </Form.Item>
                <Form.Item>
                    <Input placeholder='И тут Select'></Input>
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