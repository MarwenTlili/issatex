"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FactoryIcon as Fabric,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building,
  User,
  MapPin,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  companyName: z.string().min(2, { message: "Company name is required" }),
  companySize: z.string().min(1, { message: "Please select company size" }),
  businessType: z.string().min(1, { message: "Please select business type" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State/Province is required" }),
  zipCode: z.string().min(3, { message: "Zip/Postal code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  phoneNumber: z.string().min(5, { message: "Phone number is required" }),
  primaryProduct: z
    .string()
    .min(1, { message: "Please select a primary product" }),
  marketFocus: z
    .string()
    .array()
    .min(1, { message: "Please select at least one market focus" }),
  additionalInfo: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketFocus: [],
      termsAccepted: false,
    },
  });

  const validateStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["firstName", "lastName", "email", "password"];
        break;
      case 2:
        fieldsToValidate = [
          "companyName",
          "companySize",
          "businessType",
          "primaryProduct",
        ];
        break;
      case 3:
        fieldsToValidate = [
          "address",
          "city",
          "state",
          "zipCode",
          "country",
          "phoneNumber",
        ];
        break;
      case 4:
        fieldsToValidate = ["marketFocus", "termsAccepted"];
        break;
    }

    const result = await trigger(fieldsToValidate as any);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted:", data);

      toast({
        title: "Registration successful!",
        description:
          "Your account has been created. You'll receive a confirmation email shortly.",
      });

      // Reset form or redirect
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          "There was a problem with your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIcon = (stepNumber: number, icon: React.ReactNode) => {
    return (
      <div
        className={`flex flex-col items-center ${
          step === stepNumber
            ? "text-amber-600"
            : step > stepNumber
            ? "text-green-600"
            : "text-gray-400"
        }`}
      >
        <div
          className={`rounded-full p-2 border-2 ${
            step === stepNumber
              ? "border-amber-600 bg-amber-50"
              : step > stepNumber
              ? "border-green-600 bg-green-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          {step > stepNumber ? <CheckCircle2 className="h-6 w-6" /> : icon}
        </div>
        <div className="text-xs mt-1 font-medium">
          {stepNumber === 1 && "Account"}
          {stepNumber === 2 && "Company"}
          {stepNumber === 3 && "Contact"}
          {stepNumber === 4 && "Finish"}
        </div>
      </div>
    );
  };

  return (
    <Card className="border shadow-xl overflow-hidden">
      <CardHeader className="bg-white border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fabric className="h-6 w-6 text-amber-600" />
            <h1 className="text-xl font-bold">Issatex - Registration</h1>
          </div>
          <div className="text-sm text-gray-500">
            Step {step} of {totalSteps}
          </div>
        </div>

        <div className="flex justify-between mt-6 px-6">
          {renderStepIcon(1, <User className="h-6 w-6" />)}

          <div
            className={`flex-1 h-0.5 self-center mx-2 ${
              step > 1 ? "bg-green-600" : "bg-gray-300"
            }`}
          />

          {renderStepIcon(2, <Building className="h-6 w-6" />)}

          <div
            className={`flex-1 h-0.5 self-center mx-2 ${
              step > 2 ? "bg-green-600" : "bg-gray-300"
            }`}
          />

          {renderStepIcon(3, <MapPin className="h-6 w-6" />)}

          <div
            className={`flex-1 h-0.5 self-center mx-2 ${
              step > 3 ? "bg-green-600" : "bg-gray-300"
            }`}
          />

          {renderStepIcon(4, <Send className="h-6 w-6" />)}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form id="registrationForm" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Account Information
              </h2>
              <p className="text-gray-600 text-sm">
                Create your account credentials
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Enter your first name"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Enter your last name"
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="your.email@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Create a secure password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Company Details
              </h2>
              <p className="text-gray-600 text-sm">
                Tell us about your textile business
              </p>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  {...register("companyName")}
                  placeholder="Your company name"
                  className={errors.companyName ? "border-red-500" : ""}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select
                  onValueChange={(value) => setValue("companySize", value)}
                  defaultValue=""
                >
                  <SelectTrigger
                    id="companySize"
                    className={errors.companySize ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501+">501+ employees</SelectItem>
                  </SelectContent>
                </Select>
                {errors.companySize && (
                  <p className="text-red-500 text-sm">
                    {errors.companySize.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  onValueChange={(value) => setValue("businessType", value)}
                  defaultValue=""
                >
                  <SelectTrigger
                    id="businessType"
                    className={errors.businessType ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="wholesaler">Wholesaler</SelectItem>
                    <SelectItem value="retailer">Retailer</SelectItem>
                    <SelectItem value="designer">Fashion Designer</SelectItem>
                    <SelectItem value="supplier">
                      Raw Material Supplier
                    </SelectItem>
                    <SelectItem value="importer">Importer/Exporter</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.businessType && (
                  <p className="text-red-500 text-sm">
                    {errors.businessType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryProduct">Primary Product Category</Label>
                <RadioGroup
                  onValueChange={(value) => setValue("primaryProduct", value)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2"
                >
                  {[
                    { value: "apparel", label: "Apparel & Clothing" },
                    { value: "fabrics", label: "Fabrics & Textiles" },
                    { value: "yarn", label: "Yarn & Thread" },
                    { value: "home", label: "Home Textiles" },
                    { value: "technical", label: "Technical Textiles" },
                    { value: "accessories", label: "Accessories" },
                  ].map((item) => (
                    <div
                      key={item.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={item.value} id={item.value} />
                      <Label htmlFor={item.value} className="font-normal">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.primaryProduct && (
                  <p className="text-red-500 text-sm">
                    {errors.primaryProduct.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Contact Information
              </h2>
              <p className="text-gray-600 text-sm">
                Provide your business contact details
              </p>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="123 Business Street"
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    placeholder="City"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    {...register("state")}
                    placeholder="State/Province"
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Postal/Zip Code</Label>
                  <Input
                    id="zipCode"
                    {...register("zipCode")}
                    placeholder="Postal/Zip Code"
                    className={errors.zipCode ? "border-red-500" : ""}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...register("country")}
                    placeholder="Country"
                    className={errors.country ? "border-red-500" : ""}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Final Details
              </h2>
              <p className="text-gray-600 text-sm">
                Complete your registration
              </p>

              <div className="space-y-2">
                <Label>Market Focus</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {[
                    "Domestic Market",
                    "International Export",
                    "Sustainable/Eco-friendly",
                    "Luxury/High-end",
                    "Fast Fashion",
                    "Industrial",
                  ].map((market) => (
                    <div key={market} className="flex items-center space-x-2">
                      <Checkbox
                        id={market.toLowerCase().replace(/\s+/g, "-")}
                        onCheckedChange={(checked) => {
                          const currentMarkets = watch("marketFocus") || [];
                          if (checked) {
                            setValue("marketFocus", [
                              ...currentMarkets,
                              market,
                            ]);
                          } else {
                            setValue(
                              "marketFocus",
                              currentMarkets.filter((m) => m !== market)
                            );
                          }
                        }}
                      />
                      <Label
                        htmlFor={market.toLowerCase().replace(/\s+/g, "-")}
                        className="text-sm font-normal"
                      >
                        {market}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.marketFocus && (
                  <p className="text-red-500 text-sm">
                    {errors.marketFocus.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  {...register("additionalInfo")}
                  placeholder="Share any additional information about your business needs..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="termsAccepted"
                    onCheckedChange={(checked) =>
                      setValue("termsAccepted", checked === true)
                    }
                    className={errors.termsAccepted ? "border-red-500" : ""}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="termsAccepted"
                      className="text-sm font-normal"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-amber-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-amber-600 hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                    {errors.termsAccepted && (
                      <p className="text-red-500 text-sm">
                        {errors.termsAccepted.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex sm:flex-row items-center justify-between p-6 bg-gray-50 border-t">
        <div className="flex items-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-nowrap text-amber-600 hover:text-amber-700 font-medium hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>

        <div className="flex sm:w-auto justify-between sm:justify-end gap-3">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {step < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              form="registrationForm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Complete Registration"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
