import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Control, Path } from 'react-hook-form'
import { FormFieldType } from '../forms/PatientForm'
import { Input } from '../ui/Input'
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from "libphonenumber-js/core";
import { UserFormValidation } from '@/lib/validation'
import { z } from 'zod'


type UserFormValues = z.infer<typeof UserFormValidation>;

interface CustomProps<T extends UserFormValues> {
  control: Control<T>,
  fieldType: FormFieldType,
  name: Path<T>,
  label?: string,
  placeholder?: string,
  iconSrc?: string,
  iconAlt?: string,
  disabled?: boolean,
  dateFormat?: string,
  showTimeSelect?: boolean,
  children?: React.ReactNode,
  renderSkeleton?: (field: any) => React.ReactNode
}



const RenderField  = <T extends UserFormValues>({ field, props } : { field: any; props: CustomProps<T>  }) => {

  const { fieldType, iconSrc, iconAlt, placeholder } = props;


  switch (fieldType){

    case FormFieldType.INPUT: 
    return (
      <div className="flex rounded-md border border-dark-500 bg-dark-400">
        {
          iconSrc && (
            <Image
            src={iconSrc}
            alt={iconAlt || "icon"}
            height={24}
            width={24}
            className="ml-2"
            />
          )
        }

        <FormControl>

          <Input
          placeholder={placeholder}
          {...field}
          className="shad-input border-0" />

        </FormControl>

      </div>
    )

    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>

          <PhoneInput defaultCountry="US"
          placeholder={placeholder}
          international
          withCountryCallingCode
          value={field.value as E164Number | undefined}
          onChange={field.onChange}
          className="input-phone"
          />

        </FormControl>
      )
      
    default:
          break;
  }
} 

const CustomFormField = <T extends UserFormValues>(props: CustomProps<T>) => {

  const { control, fieldType, name, label } = props;


  return (
    <>
      <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">

          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField field={field} props={props} />

          <FormMessage className="shad-error"/>


        </FormItem>
      )} />
      
    </>
  )
}

export default CustomFormField
