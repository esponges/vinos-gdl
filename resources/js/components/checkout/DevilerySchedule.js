import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import Select from "react-select";

const DeliverySchedule = (props) => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [schedule, setSchedule] = useState(null);

    const handleDayChange = (day) => {
        console.log(day.value);
        setSelectedDay(day.value);
        if (day.value === "Sabado") {
            setSchedule(saturdaySchedule);
        } else {
            setSchedule(weekdaySchedule);
        }
    };

    const handleScheduleChange = (schedule) => {
        console.log(schedule.value);
        setSelectedSchedule(schedule);
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

    const weekdaySchedule = [
        { value: "10am a 12pm", label: "10am a 12pm" },
        { value: "12pm a 2pm", label: "12pm a 2pm" },
        { value: "2pm a 4pm", label: "2pm a 4pm" },
        { value: "4pm a 6pm", label: "4pm a 6pm" },
    ];

    const saturdaySchedule = [{ value: "10am a 3pm", label: "10am a 3pm" }];

    return (
        <Form.Group>
            <Form.Label>¿Qué día deseas recibir tu pedido?</Form.Label>
            <div style={{ marginBottom: "1rem" }}>
                <Select
                    options={days}
                    defaultValue={selectedDay}
                    onChange={handleDayChange}
                />
            </div>
            {schedule && (
                <div>
                    <Form.Label>¿En qué horario?</Form.Label>
                    <Select
                        options={schedule}
                        defaultValue={selectedSchedule}
                        onChange={handleScheduleChange}
                    />
                </div>
            )}
        </Form.Group>
    );
};

export default withRouter(DeliverySchedule);
