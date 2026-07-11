"use client";

import { useEffect, useState } from "react";

import { Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";
import { BiPencil } from "react-icons/bi";

const categories = ["Adventure", "Beach", "Mountain", "Cultural", "City"];

interface Tour {
  _id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface EditTourModalProps {
  tourId: string;
  onUpdated?: (tour: Tour) => void;
}

export function EditTourModal({ tourId, onUpdated }: EditTourModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const loadTour = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours/${tourId}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load tour.");

      const data = await res.json();
      const tour: Tour = data.tour;

      setTitle(tour.title);
      setLocation(tour.location);
      setPrice(String(tour.price));
      setCategory(tour.category);
      setDescription(tour.description);
      setImage(tour.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tours/${tourId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          location,
          price: Number(price),
          category,
          description,
          image,
        }),
      });

      if (!res.ok) throw new Error("Failed to update tour.");

      const data = await res.json();
      onUpdated?.(data.tour);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal onOpenChange={(open) => open && loadTour()}>
      <Button variant="secondary" className="flex flex-1 items-center justify-center gap-1.5">
        <BiPencil className="size-3.5" />
        Edit
      </Button>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <BiPencil className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Edit Tour</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Update the details below and save your changes.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <Surface variant="default">
                {isLoading ? (
                  <p className="text-sm text-muted">Loading tour details...</p>
                ) : (
                  <form id="edit-tour-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField className="w-full" name="title" type="text" variant="secondary">
                      <Label>Tour Title</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Sunset Kayaking in Ha Long Bay"
                      />
                    </TextField>

                    <TextField className="w-full" name="location" type="text" variant="secondary">
                      <Label>Location</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Ha Long Bay, Vietnam"
                      />
                    </TextField>

                    <TextField className="w-full" name="category" variant="secondary">
                      <Label>Category</Label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </TextField>

                    <TextField className="w-full" name="price" type="number" variant="secondary">
                      <Label>Price per Person ($)</Label>
                      <Input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="e.g. 89"
                      />
                    </TextField>

                    <TextField className="w-full" name="image" type="url" variant="secondary">
                      <Label>Cover Image URL</Label>
                      <Input
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://..."
                      />
                    </TextField>

                    <TextField className="w-full" name="description" variant="secondary">
                      <Label>Description</Label>
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what makes this tour special..."
                      />
                    </TextField>

                    {error && (
                      <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600">
                        {error}
                      </div>
                    )}
                  </form>
                )}
              </Surface>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-tour-form"
                disabled={isLoading || isSaving}
                slot={error ? undefined : "close"}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}