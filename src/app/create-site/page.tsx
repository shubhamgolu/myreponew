"use client";

import { useState } from "react";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import { Select } from "@/components/FormElements/select"; 
import { AppEditor } from "@/components/editor/editor";
// import { CameraIcon } from "@/components/Icons/camera-icon";

/**
 * Full Form Wizard with validation and submit.
 *
 * Expects an API POST endpoint at /api/create-site that accepts JSON:
 * { title, description, defaultNumber, leadGeneration }
 *
 * If you don't have the API, the example will still work and just log the payload.
 */

export default function CreateSiteWizard() {
  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [defaultNumber, setDefaultNumber] = useState("");
  const [leadGeneration, setLeadGeneration] = useState(false);
  const [domainname, setdomainname] = useState("");
  const [domaintype, setdomaintype] = useState(1);

  const [paypelid, setpaypelid] = useState("");

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [data, setData] = useState({
    name: "Danish Heilium",
    profilePhoto: "/images/user/user-03.png",
    coverPhoto: "/images/cover/cover-01.png",
  });

const handleChange = (e: any) => {
    if (e.target.name === "profilePhoto" ) {
      const file = e.target?.files[0];

      setData({
        ...data,
        profilePhoto: file && URL.createObjectURL(file),
      });
    } else if (e.target.name === "coverPhoto") {
      const file = e.target?.files[0];

      setData({
        ...data,
        coverPhoto: file && URL.createObjectURL(file),
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Validate step 1 (personal details)
  const validateStep1 = () => {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "Title is required";
    if (!description.trim()) nextErrors.description = "Description is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Validate step 2 (additional info) — as example require defaultNumber to be positive integer
  const validateStep2 = () => {
    const nextErrors: Record<string, string> = {};
    if (!defaultNumber.toString().trim()) {
      nextErrors.defaultNumber = "This number is required";
    } else {
      const num = Number(defaultNumber);
      if (!Number.isFinite(num) || num <= 0) {
        nextErrors.defaultNumber = "Enter a number greater than 0";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Final submit when wizard completes
  
  const handleComplete = async () => {
    // final full-form validation before submit
    const finalErrors: Record<string, string> = {};
    if (!title.trim()) finalErrors.title = "Title is required";
    if (!description.trim()) finalErrors.description = "Description is required";
    if (!defaultNumber.toString().trim()) finalErrors.defaultNumber = "This number is required";

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setSubmitError("Fix validation errors before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      defaultNumber: Number(defaultNumber),
      leadGeneration,
    };

    try {
      // If you have an endpoint, this will POST to it.
      // Replace /api/create-site with your real endpoint.
      const res = await fetch("/api/create-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // if API returns JSON error message, try to read it
        let msg = `Server responded with ${res.status}`;
        try {
          const json = await res.json();
          if (json?.message) msg = json.message;
        } catch (e) {}
        throw new Error(msg);
      }

      // success
      setSubmitSuccess("Site created successfully!");
      setSubmitError(null);

      // optionally clear form:
      setTitle("");
      setDescription("");
      setDefaultNumber("");
      setLeadGeneration(false);
      setErrors({});
    } catch (err: any) {
      console.error("Submit error:", err);
      setSubmitError(err?.message || "Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Site — Wizard</h1>

      <FormWizard onComplete={handleComplete} onTabChange={({ prevIndex, nextIndex }) => {
        // clear submit feedback when navigating
        // setSubmitError(null);
        // setSubmitSuccess(null);
        // setErrors({});
      }}>
        {/* STEP 1 */}
        <FormWizard.TabContent
          title="Personal details"
          icon="ti-user"
         
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-4 col-span-1 sm:col-span-2">
              <label className="text-sm font-medium">Enter Title <span className="text-red-500">*</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter Title"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-4 col-span-1 sm:col-span-2">
              <label className="text-sm font-medium">Enter Description <span className="text-red-500">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Description"
                rows={5}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
            </div>
             <div className="flex flex-col gap-4 col-span-1 sm:col-span-2">
              <label className="text-sm font-medium">Default input (number) <span className="text-red-500">*</span></label>
              <input
                value={defaultNumber}
                onChange={(e) => setDefaultNumber(e.target.value)}
                type="number"
                placeholder="Default input text"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
                  errors.defaultNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.defaultNumber && <p className="text-red-600 text-sm">{errors.defaultNumber}</p>}
            </div>

            <div className="col-span-1 sm:col-span-1 flex items-center gap-3">
              <label className="block text-sm font-medium">Lead Generation</label>
              <input
                id="leadGen"
                type="checkbox"
                checked={leadGeneration}
                onChange={(e) => setLeadGeneration(e.target.checked)}
                className="h-5 w-5"
              />
            </div>
          </div>
        </FormWizard.TabContent>

        {/* STEP 2 */}
        <FormWizard.TabContent
          title="Additional Info"
          icon="ti-settings"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
               <Select
                            label="Select Country"
                            items={[
                              { label: "Subdomain", value: "1" },
                              { label: "Custom Domain", value: "2" },
                            ]}
                            defaultValue="1"
                           
                          />
            </div>
             <div className="flex flex-col gap-3">
              <label className="block text-sm font-medium">Enter Domain Name</label>
              <input
                value={domainname}
                onChange={(e) => setdomainname(e.target.value)}
                type="text"
                placeholder="Enter Domain Name"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
             <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Enter Paypel Id<span className="text-red-500">*</span></label>
              <input
                value={paypelid}
                onChange={(e) => setpaypelid(e.target.value)}
                type="text"
                placeholder="Enter Title"
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div className="flex flex-col gap-3">
                        <label
                          htmlFor="cover"
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
                        >
                          <input
                            type="file"
                            name="coverPhoto"
                            id="coverPhoto"
                            className="sr-only"
                            onChange={handleChange}
                            accept="image/png, image/jpg, image/jpeg"
                          />
            
                          {/* <CameraIcon /> */}
            
                          <span>Edit</span>
                        </label>
                      </div>        
          </div>
        </FormWizard.TabContent>

        {/* STEP 3 - review & submit onComplete is called when user finishes */}
        <FormWizard.TabContent title="Review & Submit" icon="ti-check">
         
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review your details</h3>

            <div className="rounded-md border p-4">
              <p><span className="font-semibold">Title:</span> {title || <span className="text-gray-400">—</span>}</p>
              <p className="mt-2"><span className="font-semibold">Description:</span> {description || <span className="text-gray-400">—</span>}</p>
              <p className="mt-2"><span className="font-semibold">Number:</span> {defaultNumber || <span className="text-gray-400">—</span>}</p>
              <p className="mt-2"><span className="font-semibold">Lead Generation:</span> {leadGeneration ? "Yes" : "No"}</p>
            </div>

            {submitError && <div className="text-red-700 bg-red-50 p-3 rounded">{submitError}</div>}
            {submitSuccess && <div className="text-green-700 bg-green-50 p-3 rounded">{submitSuccess}</div>}

            <p className="text-sm text-gray-600">Click <strong>Finish</strong> to submit the form.</p>

            {submitting && <div className="text-sm">Submitting…</div>}
          </div>
          
        </FormWizard.TabContent>
      </FormWizard>                        

      {/* small note about icons/styles for the wizard */}
      <style>{`@import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");`}</style>
    </main>
  );
}
