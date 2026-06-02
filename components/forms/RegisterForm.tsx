"use client"


import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl
} from "@/components/ui/form"
import CustomFormField from "../shared/CustomFormField"
import SubmitButton from "../shared/SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { GenderOptions } from "@/contants"
import { Label } from "../ui/label"




export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton"
}


const RegisterForm = ({ user } : { user: User }) => {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    }
  })


  async function onSubmit({ name, email, phone } : z.infer<typeof UserFormValidation>){

    setIsLoading(true);


    try {

      const userData = { name, email, phone };

      const user = await createUser(userData);

      if(user) router.push(`/patients/${user.$id}/register`)
      
      
    }
    catch(error) {
      console.log(error);
    }



  }



  return (
    <>
    <Form {...form}>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">

        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>


        <section className="space-y-6">
          
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>

        </section>

        <CustomFormField
        control={form.control}
        fieldType={FormFieldType.INPUT}
        name="name"
        label="Full name"
        placeholder="Full name..."
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"/>

        <div className="flex flex-col xl:flex-row gap-6">

        <CustomFormField
        control={form.control}
        fieldType={FormFieldType.INPUT}
        name="email"
        label="Email Address"
        placeholder="Email address ..."
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"/>


        <CustomFormField
        control={form.control}
        fieldType={FormFieldType.PHONE_INPUT}
        name="phone"
        label="Phone Number"
        placeholder="(5555) 123-4567"
        />


        </div>


      <div className="flex flex-col gap-6 xl:flex-row">


        {/* DatePicker for Date of Birth */}
        <CustomFormField
        control={form.control}
        fieldType={FormFieldType.DATE_PICKER}
        name="birthDate"
        label="Date of Birth"
        placeholder="DOB ..."/>

        {/* Radio Group  */}
        <CustomFormField
        control={form.control}
        fieldType={FormFieldType.SKELETON}
        name="gender"
        label="Gender"
        renderSkeleton={(field) => (
          <FormControl>

            <RadioGroup className="flex h-11 gap-6 xl:justify-between"
            onValueChange={field.onChange} defaultValue={field.value}>
              {
                GenderOptions.map((option) => (
                  <div key={option} className="radio-group">

                    <RadioGroupItem value={option} id={option} />

                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                      
                    
                  </div>
                ))
              }
            </RadioGroup>

          </FormControl>
        )}
        />

      </div>


        <SubmitButton isLoading={isLoading}>
          Get Started
        </SubmitButton>


      </form>
    </Form>
    </>
  )
}

export default RegisterForm

