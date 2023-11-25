"use client";

import type { HTMLInputTypeAttribute, ReactNode } from "react";

import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useFormState,
  useWatch,
  type RegisterOptions,
} from "react-hook-form";

interface FormValues {
  name: string;
  email: string;
  password: string;
  array: {
    value1: number | null;
    value2: number | null;
    value3: number | null;
  }[];
}

function FormWrapper({ children }: { children: ReactNode }) {
  const methods = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  return (
    <div className="flex flex-col gap-4 max-w-lg w-full">
      <FormProvider {...methods}>{children}</FormProvider>
    </div>
  );
}

function Form({ children }: { children: ReactNode }) {
  const { handleSubmit } = useFormContext<FormValues>();

  const onSubmit = (data: FormValues) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <form
      className="flex flex-col gap-4"
      id="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {children}
    </form>
  );
}

function ShowValue<FieldName extends "name" | "email" | "password">({
  name,
}: {
  name: FieldName;
}) {
  const value = useWatch<FormValues, FieldName>({ name });

  return <p>{value}</p>;
}

function ShowValues() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl">Values</h2>
      <ShowValue name="name" />
      <ShowValue name="email" />
      <ShowValue name="password" />
    </div>
  );
}

function Error({ name }: { name: "name" | "email" | "password" }) {
  const { errors } = useFormState<FormValues>({ name });

  const error = errors[name];

  return <div className="text-red-500">{error ? error.message : null}</div>;
}

function TextInput({
  name,
  children,
  options,
  type = "text",
}: {
  type?: HTMLInputTypeAttribute;
  children: React.ReactNode;
  name: "name" | "email" | "password";
  options: RegisterOptions<FormValues, "name" | "email" | "password">;
}) {
  const { register } = useFormContext<FormValues>();

  return (
    <label htmlFor={name} className="grid grid-cols-2">
      {children}
      <input
        id={`input-${name}`}
        {...register(name, options)}
        type={type}
        name={name}
      />
      <Error name={name} />
    </label>
  );
}

function NameInput() {
  return (
    <TextInput
      name="name"
      options={{
        required: "Name is required",
        minLength: {
          value: 3,
          message: "Name must have at least three characters",
        },
      }}
    >
      Name
    </TextInput>
  );
}

function EmailInput() {
  return (
    <TextInput
      name="email"
      options={{
        required: true,
        validate: {
          isEmail: (value) => value.includes("@") || "Not a valid email",
        },
      }}
    >
      Email
    </TextInput>
  );
}

function PasswordInput() {
  return (
    <TextInput
      name="password"
      options={{
        required: "Password is required",
        minLength: {
          value: 3,
          message: "Password must have at least three characters",
        },
      }}
    >
      Password
    </TextInput>
  );
}

function ArrayInputs() {
  const { register } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray<FormValues>({
    name: "array",
  });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl">Array</h2>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4">
          <input type="text" {...register(`array.${index}.value1`)} />
          <input type="text" {...register(`array.${index}.value2`)} />
          <input type="text" {...register(`array.${index}.value3`)} />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ value1: null, value2: null, value3: null })}
      >
        Append
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-24 items-center">
      <FormWrapper>
        <Form>
          <NameInput />
          <EmailInput />
          <PasswordInput />
        </Form>
        <button
          form="form"
          type="submit"
          className="w-fit px-2 py-1 rounded-sm border border-gray-500 hover:bg-gray-500 hover:text-white"
        >
          Submit
        </button>
        <ShowValues />
      </FormWrapper>
    </main>
  );
}
