import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrength = ({ password = '', onValidationChange }) => {
    const requirements = [
        { id: 'length', label: '8+ Characters', test: (p) => p.length >= 8 },
        { id: 'upper', label: 'Uppercase', test: (p) => /[A-Z]/.test(p) },
        { id: 'lower', label: 'Lowercase', test: (p) => /[a-z]/.test(p) },
        { id: 'special', label: 'Number/Symbol', test: (p) => /[\d!@#$%^&*(),.?":{}|<>]/.test(p) },
    ];

    const results = requirements.map(req => ({
        ...req,
        isMet: req.test(password)
    }));

    const strength = results.filter(r => r.isMet).length;
    const isValid = strength === requirements.length;

    React.useEffect(() => {
        if (onValidationChange) {
            onValidationChange(isValid);
        }
    }, [isValid, onValidationChange]);

    if (!password) return null;

    const strengthColor = [
        'text-gray-400',
        'text-red-500',
        'text-orange-500',
        'text-yellow-600',
        'text-green-600',
    ][strength];

    const strengthText = [
        '',
        'Weak',
        'Fair',
        'Good',
        'Strong',
    ][strength];

    return (
        <div className="mt-2 space-y-2 px-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 font-medium">Strength:</span>
                    <span className={`text-[11px] font-bold ${strengthColor}`}>
                        {strengthText}
                    </span>
                </div>
                {isValid && (
                    <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Secure
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {results.map((res) => (
                    <div
                        key={res.id}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] transition-all duration-300 ${res.isMet
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-gray-50 border-gray-200 text-gray-400'
                            }`}
                    >
                        {res.isMet ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                        {res.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordStrength;
