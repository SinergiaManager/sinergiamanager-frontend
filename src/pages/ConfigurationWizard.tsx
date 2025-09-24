import React, { useMemo, useState } from 'react';
import { ConfigurationFormData } from '../../ts/types';
import { steps } from '../../ts/configurationSteps';
import logo from '../assets/react.svg';
import Alert from '../components/Alert';
import { ConfigurationService } from '../../ts/services/configurationService';
import { useNavigate } from 'react-router-dom';

const ConfigurationWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ConfigurationFormData>({
    support_email: "",
    smtp_host: "",
    smtp_port: 0,
    smtp_user: "",
    smtp_pass: "",
  });

  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ConfigurationFormData, string>>>({});
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>("success");

  // Mappa le label dei campi alla chiave corretta in formData
  const fieldKey = useMemo(() => {
    return (label: string): keyof ConfigurationFormData => {
      const key = label.toLowerCase().replace(/\s+/g, "");
      switch (key) {
        case 'smtpserver': return 'smtp_host';
        case 'port': return 'smtp_port';
        case 'supportemail': return 'support_email';
        case 'emailaddress': return 'smtp_user';
        case 'password': return 'smtp_pass';
        default:
          return (key as unknown) as keyof ConfigurationFormData; // fallback, ma non dovrebbe capitare
      }
    };
  }, []);

  const validateField = (k: keyof ConfigurationFormData, value: string | number): string | null => {
    if (k === 'smtp_port') {
      const numValue = typeof value === 'string' ? Number(value) : value;
      if (!numValue || isNaN(numValue)) return 'Port must be a number';
      if (numValue < 1 || numValue > 65535) return 'Port must be between 1 and 65535';
      return null;
    }
    
    const stringValue = typeof value === 'number' ? value.toString() : value;
    if (!stringValue || stringValue.trim() === '') return 'Field is required';
    
    if (k === 'support_email' || k === 'smtp_user') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(stringValue)) return 'Invalid email address';
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const key = fieldKey(label);
    const value = key === 'smtp_port' ? Number(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [key]: value }));
    const err = validateField(key, value);
    setErrors(prev => ({ ...prev, [key]: err || undefined }));
  };

  const nextStep = () => {
    // Valida tutti i campi dello step corrente
    const stepFields = steps[currentStep].fields;
    const newErrors: Partial<Record<keyof ConfigurationFormData, string>> = {};
    let valid = true;
    for (const f of stepFields) {
      const k = fieldKey(f.label);
      const value = formData[k];
      const err = f.required ? validateField(k, value) : null;
      if (err) {
        valid = false;
        newErrors[k] = err;
      }
    }
    if (!valid) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }
    setIsTransitioning(true); 
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
      setIsTransitioning(false); 
    }, 300);
  };

  const previousStep = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(currentStep - 1); 
      setIsTransitioning(false); 
    }, 300); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Valida tutti i campi
    const newErrors: Partial<Record<keyof ConfigurationFormData, string>> = {};
    let valid = true;
    (Object.keys(formData) as Array<keyof ConfigurationFormData>).forEach((k) => {
      const err = validateField(k, formData[k]);
      if (err) {
        valid = false;
        newErrors[k] = err;
      }
    });
    if (!valid) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      setAlertType('warning');
      setAlertMsg('Please fix the errors before submitting');
      return;
    }

    try {
      setIsSubmitting(true);
      await ConfigurationService.saveConfiguration(formData);
      setAlertType('success');
      setAlertMsg('Configuration saved successfully');
      
      // Naviga alla dashboard dopo un piccolo delay per mostrare il messaggio di successo
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch {
      setAlertType('error');
      setAlertMsg('Failed to save configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center grow bg-gray-100 h-screen dark:bg-gray-800 dark:text-gray-200 p-4">
  <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md p-4 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-12 mr-5" />
            <span className="text-xl font-bold text-gray-700 dark:text-gray-200">Sinergia Manager</span>
          </div>
        </div>
      </div>
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-6 dark:bg-gray-900 transition-transform duration-500 ease-in-out transform">

        <h2 className={`text-3xl font-semibold mb-6 text-center transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'} dark:text-gray-100`}>
          {steps[currentStep].title}
        </h2>

        <p className={`text-gray-600 mb-6 text-center transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'} dark:text-gray-300`}>
          {steps[currentStep].description}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={`space-y-4 transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {steps[currentStep].fields.map((field, index) => (
              <div key={index}>
                <label className="block text-sm mb-2 dark:text-gray-300">{field.label}</label>
                <input
                  type={field.type}
                  value={fieldKey(field.label) === 'smtp_port' ? (formData.smtp_port || '') : (formData[fieldKey(field.label)] || "")}
                  onChange={(e) => handleChange(e, field.label)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                  placeholder={field.placeholder}
                  required={field.required}
                  {...(field.type === "password" ? { autoComplete: "current-password" } : field.type === "email" ? { autoComplete: "username" } : { autoComplete: 'off' })}
                />
                {/* Error inline */}
                {errors[fieldKey(field.label)] && (
                  <p className="mt-1 text-sm text-red-600">{errors[fieldKey(field.label)]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={previousStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-all duration-300 ${currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Go Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300"
              >
                Next
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className={`px-4 py-2 rounded-md text-white transition-all duration-300 ${isSubmitting ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800'}`}>
                Finish
              </button>
            )}
          </div>
        </form>
        {alertMsg && (
          <Alert message={alertMsg} type={alertType} onClose={() => setAlertMsg("")} />
        )}
      </div>
    </div>
  );
};

export default ConfigurationWizard;
