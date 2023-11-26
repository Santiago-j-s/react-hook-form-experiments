export function Button({ ...props }: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="w-fit rounded-sm border border-gray-500 px-2 py-1 hover:bg-gray-500 hover:text-white"
    />
  );
}

export function Input({ ...props }: React.ComponentProps<"input">) {
  return (
    <input
      {...props}
      className="
        rounded-sm border border-gray-500 px-2 py-1 invalid:outline-red-500 focus-visible:border-none focus-visible:outline-none focus-visible:outline-gray-500 focus-visible:ring-0 invalid:focus-visible:outline-red-500"
    />
  );
}
