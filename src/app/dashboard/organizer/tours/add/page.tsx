"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TbPhoto, TbLoader2 } from "react-icons/tb";
import { useSession } from "@/lib/auth-client";

const categories = ["Adventure", "Beach", "Mountain", "Cultural", "City"];

export default function AddTourPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImageToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error("Image upload failed. Please try a different image.");
    }

    return data.data.url;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!user) {
      setSubmitError("You must be logged in to create a tour.");
      return;
    }

    if (!imageFile) {
      setSubmitError("Please upload a cover image for your tour.");
      return;
    }

    setIsSubmitting(true);

    try {
      setIsUploadingImage(true);
      const imageUrl = await uploadImageToImgBB(imageFile);
      setIsUploadingImage(false);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          location,
          price: Number(price),
          category,
          description,
          image: imageUrl,
          organizerId: user.id,
          organizerName: user.name,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create tour.");
      }

      router.push("/dashboard/organizer/tours");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Add New Tour</h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the details below to list a new tour for travelers to discover.
        </p>
      </div>

      <form onSubmit={onSubmit} className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">

        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Cover Image</label>
          <label
            htmlFor="tour-image"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 h-48 cursor-pointer hover:bg-slate-100 transition-colors overflow-hidden"
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Tour preview" className="h-full w-full object-cover" />
            ) : (
              <>
                <TbPhoto size={28} className="text-slate-400" />
                <span className="text-sm text-slate-500">Click to upload an image</span>
              </>
            )}
          </label>
          <input
            id="tour-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Tour Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sunset Kayaking in Ha Long Bay"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </div>

        {/* Location + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Location</label>
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Ha Long Bay, Vietnam"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Price per Person ($)</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 89"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Description</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what makes this tour special..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 resize-none"
          />
        </div>

        {/* Error */}
        {submitError && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
            {submitError}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
          >
            {isSubmitting && <TbLoader2 size={16} className="animate-spin" />}
            {isUploadingImage ? "Uploading Image..." : isSubmitting ? "Creating Tour..." : "Create Tour"}
          </button>
        </div>
      </form>
    </div>
  );
}