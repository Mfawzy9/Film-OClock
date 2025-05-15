"use client";
import { FaEye } from "@react-icons/all-files/fa/FaEye";
import { FaEyeSlash } from "@react-icons/all-files/fa/FaEyeSlash";
import { FaInfoCircle } from "@react-icons/all-files/fa/FaInfoCircle";
import { useState } from "react";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  onFocus,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        autoComplete="off"
        placeholder={label}
        className="peer px-1 h-10 w-full border-b-2 border-gray-300 text-white bg-transparent
          placeholder-transparent focus:outline-none focus:border-blue-500"
      />
      <label
        htmlFor={id}
        className="absolute start-0 -top-3.5 text-gray-500 text-sm transition-all
          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-500
          peer-focus:text-sm"
      >
        {label}
      </label>

      {showPassword ? (
        <FaEye
          className="absolute end-3 top-3 cursor-pointer text-lg hover:text-blue-400"
          onClick={() => setShowPassword(false)}
        />
      ) : (
        <FaEyeSlash
          className="absolute end-3 top-3 cursor-pointer text-lg hover:text-blue-400"
          onClick={() => setShowPassword(true)}
        />
      )}

      {error && touched && (
        <p
          className="mt-3 rounded p-1.5 xs:p-3 flex items-center gap-2 border-2 text-sm
            border-red-800"
        >
          <FaInfoCircle className="animate-pulse w-5 h-5 text-red-500" />
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;
