import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import Select from "react-select";

const DeliverySchedule = (props) => {
    const [days, setDays] = useState([
        { value: "1", label: "Próximo Lunes" },
        { value: "2", label: "Próximo Martes" },
        { value: "3", label: "Próximo Miércoles" },
        { value: "4", label: "Próximo Jueves" },
        { value: "5", label: "Próximo Viernes" },
        { value: "6", label: "Próximo Sábado" },
    ]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [selectedHours, setSelectedHours] = useState(null)
    const [depDropIsSelected, setDepDropIsSelected] = useState(null);
    const date = new Date();

    const handleDayChange = (day) => {

        setSelectedDay(day);
        setSelectedHours(null);
        console.log('setting hours to null!!');
        console.log('setting day to ', day.value);
        if(depDropIsSelected) { // avoid submit btn = active
            props.getDeliveryInfo(false, false);
        }

        if (day.value === "6") {
            setSchedule(saturdayHourSchedule);
        } else {
            setSchedule(weekdayHourSchedule);
        }
    };

    const handleScheduleChange = (schedule) => {
        setDepDropIsSelected(true);
        setSelectedHours(schedule);

        props.getDeliveryInfo(selectedDay.label, schedule.value);
    };

    const weekdayHourSchedule = [
        { value: "10am a 12pm", label: "10am a 12pm" },
        { value: "12pm a 2pm", label: "12pm a 2pm" },
        { value: "2pm a 4pm", label: "2pm a 4pm" },
        { value: "4pm a 6pm", label: "4pm a 6pm" },
    ];

    const saturdayHourSchedule = [{ value: "10am a 3pm", label: "10am a 3pm" }];

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            const removeToday = days.filter((day) => day.value != date.getDay());
            setDays(removeToday);
        }

        return () => isMounted = false;
    }, []);

    return (
        <Form.Group>
            <Form.Label>¿Qué día deseas recibir tu pedido?</Form.Label>
            <div style={{ marginBottom: "1rem" }}>
                <Select
                    options={days}
                    onChange={handleDayChange}
                    value={selectedDay}
                />
            </div>
            {schedule && selectedDay && (
                <div>
                    <Form.Label>¿En qué horario?</Form.Label>
                    <Select
                        options={schedule}
                        onChange={handleScheduleChange}
                        value={selectedHours}
                    />
                </div>
            )}
        </Form.Group>
    );
};

export default withRouter(DeliverySchedule);
