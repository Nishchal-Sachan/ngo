"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { occupationOptions } from "@/data/mock";
import { postVolunteer } from "@/services/api";
import {
  volunteerFormSchema,
  type VolunteerFormValues,
} from "./volunteerSchema";

const inputClassName =
  "px-4 py-3 rounded-md border border-slate-200 bg-white text-ink placeholder:text-muted w-full focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none transition-all duration-200";
const inputErrorClassName =
  "px-4 py-3 rounded-md border border-red-300 bg-red-50/50 text-ink placeholder:text-muted w-full focus:ring-2 focus:ring-red-200 focus:border-red-400 focus:outline-none transition-all duration-200";

export function VolunteerForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 8000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      occupation: undefined,
      occupationOther: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      fatherName: "",
      qualification: "",
    },
  });

  const onSubmit = async (data: VolunteerFormValues) => {
    const payload = {
      ...data,
      occupationOther: data.occupationOther || undefined,
    };
    const res = await postVolunteer(payload);

    if (res.success) {
      reset();
      setSuccessMessage(res.message ?? "Thank you for registering as a volunteer!");
      return;
    }

    setError("root.serverError", {
      type: "server",
      message: res.error,
    });
  };

  if (successMessage) {
    return (
      <div className="py-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">You&apos;re In!</h3>
        <p className="text-muted mb-6 max-w-sm leading-relaxed">
          {successMessage}
        </p>
        <p className="text-sm text-muted">
          We&apos;ll reach out soon. Thank you for joining our mission!
        </p>
      </div>
    );
  }

  return (
    <form
      className="w-full flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Volunteer registration form"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Name <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={errors.name ? inputErrorClassName : inputClassName}
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-slate-700">
          Phone <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="10-digit mobile number"
          autoComplete="tel"
          aria-required="true"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={errors.phone ? inputErrorClassName : inputClassName}
          {...register("phone")}
        />
        {errors.phone && (
          <p id="phone-error" className="text-sm text-red-600" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={errors.email ? inputErrorClassName : inputClassName}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="occupation" className="text-sm font-medium text-slate-700">
          Occupation <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <select
          id="occupation"
          aria-required="true"
          aria-invalid={!!errors.occupation}
          aria-describedby={errors.occupation ? "occupation-error" : undefined}
          className={errors.occupation ? inputErrorClassName : inputClassName}
          {...register("occupation")}
        >
          <option value="" className="text-slate-800">
            Select your occupation
          </option>
          {occupationOptions.map((opt) => (
            <option key={opt} value={opt.toLowerCase()}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="If other, specify here"
          autoComplete="off"
          className={inputClassName}
          {...register("occupationOther")}
        />
        {errors.occupation && (
          <p id="occupation-error" className="text-sm text-red-600" role="alert">
            {errors.occupation.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address" className="text-sm font-medium text-slate-700">
          Address <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="address"
          type="text"
          placeholder="Street address"
          autoComplete="street-address"
          aria-required="true"
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? "address-error" : undefined}
          className={errors.address ? inputErrorClassName : inputClassName}
          {...register("address")}
        />
        {errors.address && (
          <p id="address-error" className="text-sm text-red-600" role="alert">
            {errors.address.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-sm font-medium text-slate-700">
            City <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="city"
            type="text"
            placeholder="City"
            autoComplete="address-level2"
            aria-required="true"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "city-error" : undefined}
            className={errors.city ? inputErrorClassName : inputClassName}
            {...register("city")}
          />
          {errors.city && (
            <p id="city-error" className="text-sm text-red-600" role="alert">
              {errors.city.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="state" className="text-sm font-medium text-slate-700">
            State <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="state"
            type="text"
            placeholder="State"
            autoComplete="address-level1"
            aria-required="true"
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? "state-error" : undefined}
            className={errors.state ? inputErrorClassName : inputClassName}
            {...register("state")}
          />
          {errors.state && (
            <p id="state-error" className="text-sm text-red-600" role="alert">
              {errors.state.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pincode" className="text-sm font-medium text-slate-700">
            Pincode <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="pincode"
            type="text"
            placeholder="6 digits"
            autoComplete="postal-code"
            aria-required="true"
            aria-invalid={!!errors.pincode}
            aria-describedby={errors.pincode ? "pincode-error" : undefined}
            className={errors.pincode ? inputErrorClassName : inputClassName}
            {...register("pincode")}
          />
          {errors.pincode && (
            <p id="pincode-error" className="text-sm text-red-600" role="alert">
              {errors.pincode.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="fatherName" className="text-sm font-medium text-slate-700">
          Father&apos;s Name <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="fatherName"
          type="text"
          placeholder="Father's name"
          autoComplete="off"
          aria-required="true"
          aria-invalid={!!errors.fatherName}
          aria-describedby={errors.fatherName ? "fatherName-error" : undefined}
          className={errors.fatherName ? inputErrorClassName : inputClassName}
          {...register("fatherName")}
        />
        {errors.fatherName && (
          <p id="fatherName-error" className="text-sm text-red-600" role="alert">
            {errors.fatherName.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="qualification" className="text-sm font-medium text-slate-700">
          Highest Qualification <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="qualification"
          type="text"
          placeholder="e.g. B.A., B.Sc., M.Com."
          autoComplete="off"
          aria-required="true"
          aria-invalid={!!errors.qualification}
          aria-describedby={errors.qualification ? "qualification-error" : undefined}
          className={errors.qualification ? inputErrorClassName : inputClassName}
          {...register("qualification")}
        />
        {errors.qualification && (
          <p id="qualification-error" className="text-sm text-red-600" role="alert">
            {errors.qualification.message}
          </p>
        )}
      </div>

      {errors.root?.serverError && (
        <div
          className="text-sm font-medium text-red-600 p-4 bg-red-50 rounded-xl border border-red-200"
          role="alert"
          aria-live="polite"
        >
          {errors.root.serverError.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 px-8 py-3.5 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-busy={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Join as Volunteer"}
      </button>
    </form>
  );
}
