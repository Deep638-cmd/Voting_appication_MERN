import React from 'react';

export const ValidationRules = ({ type }) => {
  const passwordRules = [
    "At least 6 characters long",
    "Maximum 128 characters",
    "Must contain at least one uppercase letter",
    "Must contain at least one lowercase letter",
    "Must contain at least one number",
    "Must contain at least one special character (@$!%*?&)"
  ];

  const emailRules = [
    "Must be a valid email format (example@domain.com)",
    "Cannot be empty",
    "Will be trimmed of whitespace"
  ];

  const rules = type === 'password' ? passwordRules : emailRules;

  return (
    <div className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded-md">
      <p className="font-medium mb-1">Requirements:</p>
      <ul className="list-disc list-inside space-y-1">
        {rules.map((rule, index) => (
          <li key={index} className="text-xs">{rule}</li>
        ))}
      </ul>
    </div>
  );
};