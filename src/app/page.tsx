"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const dropdownOptions = [
  {
    value: "publish",
    label: "Publicar",
    schema: z.object({
      name: z.string().min(3),
      email: z.string().email().min(3),
      password: z.string().min(3),
    }),
  },
  {
    value: "draft",
    label: "Guardar Borrador",
    schema: z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    }),
  },
] as const;

type DropdownOptions = (typeof dropdownOptions)[number]["value"];

type PublishSchema = z.infer<(typeof dropdownOptions)[0]["schema"]>;
type BorradorSchema = z.infer<(typeof dropdownOptions)[1]["schema"]>;

type FormData = PublishSchema | BorradorSchema;

export default function Home() {
  const [selectedOptionValue, setSelectedOptionValue] =
    useState<DropdownOptions>("draft");

  const selectedOption = dropdownOptions.find(
    (option) => option.value === selectedOptionValue,
  );

  if (!selectedOption) {
    throw new Error("Invalid option");
  }

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
    shouldUseNativeValidation: true,
    resolver: zodResolver(selectedOption.schema),
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    form.trigger();
  }, [form, selectedOptionValue]);

  const onSubmit = (data: FormData) => {
    switch (selectedOption.value) {
      case "publish":
        console.log("Publicar", data);
        break;
      case "draft":
        console.log("Guardar Borrador", data);
        break;
    }
  };

  return (
    <main className="flex min-h-screen max-w-[100vw] items-start px-24 py-10">
      <div className="flex w-full flex-col gap-4">
        <Select
          onValueChange={(value) => {
            setSelectedOptionValue(value as DropdownOptions);
          }}
          defaultValue={selectedOptionValue.toString()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="publish">Publicar</SelectItem>
            <SelectItem value="draft">Guardar borrador</SelectItem>
          </SelectContent>
        </Select>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.org" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    </main>
  );
}
