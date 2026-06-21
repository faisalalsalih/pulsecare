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
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { GenderOptions,  IdentificationTypes } from "@/contants"
import { Label } from "../ui/label"
import { Doctors } from "@/contants"
import { SelectItem } from "@/components/ui/select"
import Image from "next/image"
import { FileUploader } from "../shared/FileUploader"
import { PatientFormDefaultValues } from "@/contants"
import { registerPatient } from "@/lib/actions/patient.actions"



export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton"
}


const RegisterForm = ({ user }: { user: User }) => {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    }
  })


  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {

    setIsLoading(true);


    let formData;


    if(values.identificationDocument && values.identificationDocument.length > 0){

      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })


      formData = new FormData();

      formData.append('blobFile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name);

    }

    try {

      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        IdentificationDocument: formData
      }


      const patient = await registerPatient(patientData);

      if(patient) router.push(`/patients/${user.$id}/new-appointment`);

    }
    catch (error) {
      console.log(error);
    }


    setIsLoading(false);


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
            iconAlt="user" />

          <div className="flex flex-col xl:flex-row gap-6">

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email Address"
              placeholder="Email address ..."
              iconSrc="/assets/icons/email.svg"
              iconAlt="email" />


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
              placeholder="DOB ..." />

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


          {/* Simple Inputs for Address and Occupation */}

          <div className="flex items-col gap-6 xl:flex-row">

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="address"
              label="Address ..."
              placeholder="14th Street, New York"
            />


            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="occupation"
              label="Occupation"
              placeholder="Software Engineer"
            />


          </div>

          {/* Simple Inputs for Emergency Contact and Phone Input*/}
          <div className="flex flex-col xl:flex-row gap-6">

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="emergencyContactName"
              label="Emergency Contact name"
              placeholder="Guardian's name"
            />


            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="(5555) 123-4567"
            />


          </div>



          <section className="space-y-6">

            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical Information</h2>
            </div>

          </section>

          {/* Select Input for Primary Physician */}

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          {/* Simple Inputs for Insurance Information */}

          <div className="flex flex-col xl:flex-row gap-6">

            <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Blue Cross Blue Shield" />

            <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="123456789" />


          </div>

          {/* Text Areas for Medical Information */}
          <div className="flex flex-col xl:flex-row gap-6">

            <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Pencillin, Pollen, Peanuts" />

            <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication"
            placeholder="Ibuprofen 200mg, Aspirin 100mg" />


          </div>


          {/* Text Areas for Medical History */}
          <div className="flex flex-col xl:flex-row gap-6">

            <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Diabetes, Heart Disease" />

            <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Broken Arm, OCD" />


          </div>


          <section className="space-y-6">

            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verification</h2>
            </div>

          </section>


          {/* Select Input for Identification Type */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select an Identification Type"
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>


          {/* Simple Input for Identification Number */}
          <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123-45-6789" />


          {/* Scanned Copy of Identification Document Having the FileUploader */ }
          <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="identificationDocument"
              label="Scanned copy of identification document"
              renderSkeleton={(field) => (
                <FormControl>

                  <FileUploader files={field.value} onChange={field.onChange}/>

                </FormControl>
              )}
          />



          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Consent and Privacy</h2>
            </div>
          </section>


          <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment" />


          <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information" />


          <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to the privacy policy" />



          <SubmitButton isLoading={isLoading}>
            Get Started
          </SubmitButton>


        </form>
      </Form>
    </>
  )
}

export default RegisterForm


