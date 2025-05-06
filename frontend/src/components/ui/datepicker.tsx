
import React from "react";
import DatePickerLib from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



interface Props {
    date?: Date;
    onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<Props> = ({ date, onDateChange }) => {
    return (
        <div className="w-full">
            <DatePickerLib
                selected={date}
                onChange={(date: Date | null) => {
                    if (date) onDateChange(date);
                }}
                className="w-full p-2 border border-gray-300 rounded"
                placeholderText="Select date"
                dateFormat="dd/MM/yyyy"
            />
        </div>
    );
};
