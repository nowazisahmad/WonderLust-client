"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "Beach",
  "Mountain",
  "City",
  "Adventure",
  "Cultural",
  "Wildlife",
  "Desert",
  "Island",
];

const initialForm = {
  destination: "",
  country: "",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

type FormState = typeof initialForm;
type FieldName = keyof FormState;

const fieldClass = "border-slate-200 bg-slate-50";

export default function AddDestinationPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [category, setCategory] = useState<string | null>("Beach");
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const updateField =
    (name: FieldName) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [name]: event.target.value }));
      setSubmittedName(null);
    };

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedName(form.destination.trim());
  
    const res = await fetch("http://localhost:5000/add-destination", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form)
    });
    
    const data = await res.json()
    console.log(data)

  };

  const handleCancel = () => {
    setForm(initialForm);
    setCategory("Beach");
    setSubmittedName(null);
  };

  return (
    <main className="w-full px-6 py-8">
      <h1 className="flex justify-between text-3xl font-normal md:text-4xl">
        Add New Travel Package
      </h1>

      <form onSubmit={handleSubmit}>
        <Card className="mx-auto mt-10 w-full max-w-lg gap-0 shadow-sm [--card-spacing:--spacing(5)]">
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="destination-name">Destination Name</Label>
              <Input
                id="destination-name"
                required
                placeholder="Bali Paradise"
                value={form.destination}
                onChange={updateField("destination")}
                className={fieldClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  required
                  placeholder="Indonesia"
                  value={form.country}
                  onChange={updateField("country")}
                  className={fieldClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    setSubmittedName(null);
                  }}
                >
                  <SelectTrigger
                    id="category"
                    className={`w-full ${fieldClass}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  required
                  inputMode="decimal"
                  pattern="[0-9]+(\.[0-9]{1,2})?"
                  placeholder="e.g., 1299"
                  value={form.price}
                  onChange={updateField("price")}
                  className={fieldClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  required
                  placeholder="e.g., 7 Days/6 Nights"
                  value={form.duration}
                  onChange={updateField("duration")}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="departure-date">Departure Date</Label>
              <Input
                id="departure-date"
                required
                type="date"
                value={form.departureDate}
                onChange={updateField("departureDate")}
                className={fieldClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                required
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={updateField("imageUrl")}
                className={fieldClass}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                placeholder="Describe the travel experience..."
                value={form.description}
                onChange={updateField("description")}
                className={`min-h-20 ${fieldClass}`}
              />
            </div>
          </CardContent>

          <CardFooter className="border-transparent bg-transparent">
            {submittedName !== null && (
              <p role="status" className="mr-auto text-sm text-emerald-600">
                Package &quot;{submittedName}&quot; added successfully!
              </p>
            )}
            <div className="ml-auto flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#00A8E8] text-white hover:bg-[#0095CC]"
              >
                <Save className="size-3.5" />
                Add Travel Package
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
