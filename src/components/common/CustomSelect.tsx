import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: SelectOption;
  onChange: (option: SelectOption) => void;
  label?: string;
  error?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  label,
  error,
}: CustomSelectProps) {
  return (
    <div className="mb-8 sm:mb-10 w-full">
      {label && (
        <label className="font-semibold text-green-800 text-lg mb-2 block">{label}</label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={`w-full rounded-full border-2 ${
              error ? "border-red-400" : "border-green-300"
            } bg-white text-lg px-5 py-3 pr-12 text-gray-900 focus:border-green-600 focus:outline-none transition-all shadow-sm font-poppins flex justify-between items-center`}
          >
            <span>{value.label}</span>
            <ChevronDownIcon className="w-5 h-5 text-green-700 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-2 w-full bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden animate-fadeIn">
            {options.map((option, idx) => (
              <Listbox.Option
                key={option.value}
                value={option}
                as={Fragment}
                disabled={option.value === ""}
              >
                {({ active, selected }) => (
                  <li
                    className={`px-5 py-3 cursor-pointer text-lg transition-all ${
                      option.value === ""
                        ? "text-gray-400 cursor-not-allowed"
                        : active
                        ? "bg-green-100 text-green-900"
                        : "text-gray-900"
                    } ${selected ? "font-bold bg-green-50" : ""}`}
                  >
                    {option.label}
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
    </div>
  );
}
