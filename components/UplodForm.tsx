"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, ImagePlus, X, Loader2 } from "lucide-react";
import { UploadSchema } from "@/lib/zod";
import { BookUploadFormValues } from "@/types";
import { voiceOptions, voiceCategories } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { cn } from "@/lib/utils";

const UplodForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      voice: "rachel",
    },
  });

  const onSubmit = async (values: BookUploadFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    console.log("Submitting:", values);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsSubmitting(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "pdf" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "pdf") {
      setPdfFile(file);
      form.setValue("file", [file]);
      // Auto-fill title if empty
      if (!form.getValues("title")) {
        const titleLine = file.name.replace(".pdf", "");
        form.setValue("title", titleLine);
      }
    } else {
      setCoverImage(file);
      form.setValue("cover", [file]);
    }
  };

  const removeFile = (type: "pdf" | "cover") => {
    if (type === "pdf") {
      setPdfFile(null);
      form.setValue("file", undefined as any);
    } else {
      setCoverImage(null);
      form.setValue("cover", undefined);
    }
  };

  return (
    <div className="new-book-wrapper">
      {isSubmitting && <LoadingOverlay message="Synthesizing your book..." />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
          {/* PDF Upload */}
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel className="form-label">PDF Book File</FormLabel>
                <FormControl>
                  <div className="relative">
                    {!pdfFile ? (
                      <label className="upload-dropzone">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "pdf")}
                        />
                        <FileUp className="h-12 w-12 text-[#663820] mb-4" />
                        <span className="text-xl font-bold text-[#212a3b]">
                          Click to upload PDF
                        </span>
                        <span className="text-sm text-[#3d485e] mt-2">
                          PDF file (max 50MB)
                        </span>
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-6 bg-white border-2 border-[#663820]/20 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-[#663820]/10 rounded-xl">
                            <FileUp className="h-6 w-6 text-[#663820]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#212a3b] truncate max-w-[300px]">
                              {pdfFile.name}
                            </p>
                            <p className="text-sm text-[#3d485e]">
                              {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile("pdf")}
                          className="hover:bg-red-50 hover:text-red-600 rounded-full"
                        >
                          <X className="h-6 w-6" />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Upload */}
          <FormField
            control={form.control}
            name="cover"
            render={() => (
              <FormItem>
                <FormLabel className="form-label">Cover Image</FormLabel>
                <FormControl>
                  <div className="relative">
                    {!coverImage ? (
                      <label className="upload-dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "cover")}
                        />
                        <ImagePlus className="h-12 w-12 text-[#663820] mb-4" />
                        <span className="text-xl font-bold text-[#212a3b]">
                          Click to upload cover image
                        </span>
                        <span className="text-sm text-[#3d485e] mt-2">
                          Leave empty to auto-generate from PDF
                        </span>
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-6 bg-white border-2 border-[#663820]/20 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-[#663820]/10 rounded-xl">
                            <ImagePlus className="h-6 w-6 text-[#663820]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#212a3b] truncate max-w-[300px]">
                              {coverImage.name}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile("cover")}
                          className="hover:bg-red-50 hover:text-red-600 rounded-full"
                        >
                          <X className="h-6 w-6" />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Rich Dad Poor Dad"
                      className="form-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="form-label">Author Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Robert Kiyosaki"
                      className="form-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Voice Selector */}
          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem className="space-y-6">
                <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-8"
                  >
                    {(Object.keys(voiceCategories) as Array<keyof typeof voiceCategories>).map((category) => (
                      <div key={category} className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-[#3d485e]">
                          {category} Voices
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {voiceCategories[category].map((voiceKey) => {
                            const voice = voiceOptions[voiceKey as keyof typeof voiceOptions];
                            const isSelected = field.value === voiceKey;
                            return (
                              <FormItem key={voiceKey} className="space-y-0">
                                <FormControl>
                                  <div
                                    className={cn(
                                      "voice-selector-option group",
                                      isSelected && "voice-selector-option-selected"
                                    )}
                                    onClick={() => field.onChange(voiceKey)}
                                  >
                                    <RadioGroupItem
                                      value={voiceKey}
                                      className="sr-only"
                                    />
                                    <p className="font-bold text-[#212a3b] text-lg">
                                      {voice.name}
                                    </p>
                                    <p className="text-sm text-[#3d485e] leading-snug mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                      {voice.description}
                                    </p>
                                  </div>
                                </FormControl>
                              </FormItem>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="form-btn mt-8" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Synthesizing...
              </>
            ) : (
              "Begin Synthesis"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UplodForm;