import { forwardRef } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className="w-fit rounded-sm border border-gray-500 px-2 py-1 hover:bg-gray-500 hover:text-white"
    />
  );
});

Button.displayName = "Button";

export const Input = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={`rounded-sm border border-gray-500 px-2 py-1 invalid:outline-red-500 focus-visible:border-none focus-visible:outline-none focus-visible:outline-gray-500 focus-visible:ring-0 invalid:focus-visible:outline-red-500 ${props.className}`}
    />
  );
});

Input.displayName = "Input";
