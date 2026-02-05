import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrength = ({ password = '' }) => {
    const requirements = [
        { label: 'At least 8 characters', test: (p) => p.length >= 8 },
        { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
        { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
        { label: 'Contains number or special character', test: (p) => /[\d!@#$%^&*(),.?":{}|<>]/.test(p) },
    ];

    const strength = useMemo(() => {
        if (!password) return 0;
        return requirements.reduce((acc, req) => (req.test(password) ? acc + 1 : acc), 0);
    }, [password]);

    const strengthColor = [
        'bg-gray-200',
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-green-500',
    ][strength];

    const strengthText = [
        '',
        'Weak',
        'Fair',
        'Good',
        'Strong',
    ][strength];

    return (
        <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between gap-2">
                <div className="flex-1 h-1.5 flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`h-full flex-1 rounded-full transition-colors duration-300 ${step <= strength ? strengthColor : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${strength <= 1 ? 'text-red-500' :
                        strength === 2 ? 'text-orange-500' :
                            strength === 3 ? 'text-yellow-600' :
                                'text-green-600'
                    }`}>
                    {strengthText}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
                {requirements.map((req, index) => {
                    const isMet = req.test(password);
                    return (
                        <div key={index} className="flex items-center gap-2">
                            <div className={`flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center ${isMet ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {isMet ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                            </div>
                            <span className={`text-[11px] ${isMet ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                                {req.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PasswordStrength;
