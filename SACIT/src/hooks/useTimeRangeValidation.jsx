import { useState } from 'react';

const useTimeRangeValidation = () => {
    const [error, setError] = useState('');

    const validateTime = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        const startLimit = 9 * 60;
        const endLimit = 15 * 60;

        if (timeInMinutes < startLimit || timeInMinutes > endLimit) {
            setError('El horario debe estar entre las 9:00 y las 15:00.');
            return false;
        }

        setError('');
        return true;
    };

    return {
        error,
        validateTime,
    };
};

export default useTimeRangeValidation;
