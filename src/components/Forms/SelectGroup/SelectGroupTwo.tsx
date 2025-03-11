import React, { useState, ChangeEvent } from 'react';

interface SelectGroupTwoProps {
  label?: string; // Label hiển thị cho Select
  name?: string; // Tên của trường
  value?: string; // Giá trị hiện tại của trường
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void; // Hàm xử lý thay đổi
  options: { value: string, label: string }[]; // Danh sách các tùy chọn
}

const SelectGroupTwo: React.FC<SelectGroupTwoProps> = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  // Hàm xử lý khi thay đổi lựa chọn
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
    setIsOptionSelected(e.target.value !== ''); // Nếu có giá trị được chọn thì đánh dấu là chọn
  };

  return (
    <div>
      <label className="mb-3 block text-black dark:text-white">
        {label}
      </label>

      <div className="relative z-20 bg-white dark:bg-form-input">
        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                fill="#637381"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                fill="#637381"
              ></path>
            </g>
          </svg>
        </span>

        <select
          name={name}
          value={value}
          onChange={handleChange}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''
            }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-body dark:text-bodydark">
              {option.label}
            </option>
          ))}
        </select>

        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill="#637381"
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectGroupTwo;
