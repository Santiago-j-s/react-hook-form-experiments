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
  type UseFieldArrayRemove,
} from "react-hook-form";
import { Button, Input } from "./atoms";

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
    shouldUseNativeValidation: true,
  });

  return (
    <div className="flex w-full flex-col gap-4">
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
      className="grid grid-cols-[1fr_2fr] gap-4"
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

  return (
    <div className="min-h-[1em] text-xs text-red-500">
      {error ? error.message : null}
    </div>
  );
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
      <Input
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
        required: "Email is required",
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

function ArrayInputRow({
  index,
  remove,
}: {
  index: number;
  remove: UseFieldArrayRemove;
}) {
  const { register } = useFormContext<FormValues>();

  return (
    <li className="flex items-center gap-4">
      <Input type="text" {...register(`array.${index}.value1`)} />
      <Input type="text" {...register(`array.${index}.value2`)} />
      <Input type="text" {...register(`array.${index}.value3`)} />
      <Button type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </li>
  );
}

function ArrayInputs() {
  const { fields, append, remove } = useFieldArray<FormValues>({
    name: "array",
  });

  return (
    <fieldset className="flex flex-col items-start gap-4 rounded-sm border-2 border-gray-300 p-2">
      <legend>Array Inputs</legend>
      <ul className="grid gap-2">
        {fields.map((field, index) => (
          <ArrayInputRow key={field.id} index={index} remove={remove} />
        ))}
      </ul>
      <Button
        type="button"
        onClick={() => append({ value1: null, value2: null, value3: null })}
      >
        Append
      </Button>
    </fieldset>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-[100vw] items-center p-24">
      <FormWrapper>
        <Form>
          <fieldset className="rounded-sm border-2 border-gray-300 p-2">
            <legend>Inputs</legend>
            <NameInput />
            <EmailInput />
            <PasswordInput />
          </fieldset>
          <ArrayInputs />
        </Form>
        <Button form="form" type="submit">
          Submit
        </Button>
        <ShowValues />
      </FormWrapper>
    </main>
  );
}
