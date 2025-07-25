import React, { useId } from "react";

function Select({ options, label, className, ...props }, ref) {
  const id = useId();
  return (
    <div className="w-full">
        {label && <label htmlFor={id} className=""></label>}
        <select
        {...props}
        id = {id}
        ref={ref}
        className={`${className} px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border borer-gray-200 w-full`}
        >
            {options?.map((item) => (
                <option key={item} value={item}>
                    {item}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select);
