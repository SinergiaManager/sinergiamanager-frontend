interface User {
    id: string;
    email: string;
    role: string;
    token: string;
}

interface ConfigurationFormData {
    smtpServer: string;
    port: string;
    supportEmail: string;
    notificationEmail: string;
    notificationEmailPassword: string;
};

export type { User, ConfigurationFormData };