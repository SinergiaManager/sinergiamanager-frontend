interface User {
    id: string;
    email: string;
    role: string;
    token: string;
}

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
}

export type { User, AlertProps };