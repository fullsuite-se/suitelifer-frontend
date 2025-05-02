import React, { useEffect, useState } from "react";

const VerifyPasswordStrength = ({
  password,
  confirmPassword,
  onChangeValidation,
}) => {
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const passwordStrength = (pwd) => {
    const hasMatched = password === confirmPassword;
    const hasRequiredLength = pwd.length >= 10;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(pwd);

    return {
      hasMatched,
      hasRequiredLength,
      hasUppercase,
      hasLowercase,
      hasDigit,
      hasSpecialChar,
    };
  };

  useEffect(() => {
    const validation = Object.values(passwordStrength(password));
    const isStrong = !validation.includes(false);

    if (onChangeValidation) {
      onChangeValidation(isStrong);
    }
    setIsPasswordValid(isStrong);
  }, [password, confirmPassword]);

  return (
    <>
      {password && confirmPassword && !isPasswordValid ? (
        <ul className="text-sm">
          {passwordStrength(password).hasMatched ? (
            <li className="text-primary">
              Password and Confirm Password match. 👍
            </li>
          ) : (
            <li className="text-red-400">
              Password and Confirm Password must match.
            </li>
          )}
          {passwordStrength(password).hasRequiredLength ? (
            <li className="text-primary">
              Password must be at least 10 characters long. 👍
            </li>
          ) : (
            <li className="text-red-400">
              Password must be at least 10 characters long.
            </li>
          )}
          {passwordStrength(password).hasUppercase ? (
            <li className="text-primary">
              Password must include at least one uppercase letter. 👍
            </li>
          ) : (
            <li className="text-red-400">
              Password must include at least one uppercase letter.
            </li>
          )}
          {passwordStrength(password).hasLowercase ? (
            <li className="text-primary">
              Password must include at least one lowercase letter. 👍
            </li>
          ) : (
            <li className="text-red-400">
              Password must include at least one lowercase letter.
            </li>
          )}
          {passwordStrength(password).hasDigit ? (
            <li className="text-primary">
              Password must include at least one number. 👍
            </li>
          ) : (
            <li className="text-red-400">
              Password must include at least one number.
            </li>
          )}
          {passwordStrength(password).hasSpecialChar ? (
            <li className="text-primary">
              Password must include at least one special character (e.g.
              !@#$%^&*). 👍
            </li>
          ) : (
            <li className="text-red-400">
              Password must include at least one special character (e.g.
              !@#$%^&*).
            </li>
          )}
        </ul>
      ) : (
        <>
          {password && confirmPassword && (
            <p className="text-primary text-sm">
              Great job! Your password is so strong, the InfoSec Team just did a
              happy dance. 💃🕺
            </p>
          )}
        </>
      )}
    </>
  );
};

export default VerifyPasswordStrength;
