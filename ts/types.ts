interface User {
    id: string;
    email: string;
    role: string;
    token: string;
}

interface ConfigurationFormData {
    support_email: string;
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_pass: string;
}

interface ConfigurationStatus {
    hasConfiguration: boolean;
}

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
}

const Days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export type { User, AlertProps, ConfigurationFormData, ConfigurationStatus };

export { Days, Months };
