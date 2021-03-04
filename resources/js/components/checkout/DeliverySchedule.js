import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import Select from "react-select";

const DeliverySchedule = (props) => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [depDropIsSelected, setDepDropIsSelected] = useState(null)

    const handleDayChange = (day) => {
        if(depDropIsSelected) { // avoid submit btn = active
            props.getDeliveryInfo(false, false);
        }

        setSelectedDay(day.value);
        if (day.value === "Sabado") {
            setSchedule(saturdayHourSchedule);
        } else {
            setSchedule(weekdayHourSchedule);
        }
    };

    const handleScheduleChange = (schedule) => {
        setDepDropIsSelected(true);
        props.getDeliveryInfo(selectedDay, schedule.value);
    };

    const days = [
        { value: "Lunes", label: "Lunes" },
        { value: "Martes", label: "Martes" },
        { value: "Miercoles", label: "Miercoles" },
        { value: "Jueves", label: "Jueves" },
        { value: "Viernes", label: "Viernes" },
        { value: "Sabado", label: "Sabado" },
    ];

    const weekdayHourSchedule = [
        { value: "10am a 12pm", label: "10am a 12pm" },
        { value: "12pm a 2pm", label: "12pm a 2pm" },
        { value: "2pm a 4pm", label: "2pm a 4pm" },
        { value: "4pm a 6pm", label: "4pm a 6pm" },
    ];

    const saturdayHourSchedule = [{ value: "10am a 3pm", label: "10am a 3pm" }];

    return (
        <Form.Group>
            <Form.Label>¿Qué día deseas recibir tu pedido?</Form.Label>
            <div style={{ marginBottom: "1rem" }}>
                <Select
                    options={days}
                    onChange={handleDayChange}
                />
            </div>
            {schedule && selectedDay && (
                <div>
                    {console.log(schedule, ' has changed!!')}
                    <Form.Label>¿En qué horario?</Form.Label>
                    <Select
                        options={schedule}
                        onChange={handleScheduleChange}
                    />
                </div>
            )}
        </Form.Group>
    );
};

export default withRouter(DeliverySchedule);
