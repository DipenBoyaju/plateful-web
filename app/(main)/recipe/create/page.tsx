'use client'

import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { recipeSchema, type RecipeFormData } from "@/lib/validations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { zodResolver } from '@hookform/resolvers/zod';
import Image from "next/image";
import { Loader2, Plus, Upload, X, Clock, Users, Flame, Trash2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createRecipe } from "@/actions/recipe-actions";

export default function CreateRecipePage() {
  const router = useRouter()
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      description: '',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: 'Medium',
      ingredients: [{ item: '', quantity: '' }],
      instructions: [''],
    }
  })

  // Using useFieldArray for better performance and cleaner syntax
  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients"
  });

  const { fields: instructionFields, append: appendStep, remove: removeStep } = useFieldArray({
    control: form.control,
    name: "instructions" as any // Type cast if needed depending on your Zod schema nesting
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: RecipeFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await createRecipe(data, imageFile || undefined)
      if (result.error) {
        setError(result.error)
      } else {
        router.push(`/recipe/${result.recipeId}`)
      }
    } catch (err) {
      setError('Failed to create recipe')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* HEADER SECTION */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest mb-4">
          <Plus className="h-3 w-3" /> New Masterpiece
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none mb-4">
          Recipe <span className="text-orange-500 italic">Studio.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">Format your recipe to inspire other home chefs.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

          {/* IMAGE SECTION */}
          <div className="group relative">
            <div className={`relative aspect-video rounded-[3rem] border-4 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center bg-slate-50 ${imagePreview ? 'border-transparent' : 'border-slate-200 group-hover:border-orange-400 group-hover:bg-orange-50/30'}`}>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="text-center space-y-4">
                    <div className="bg-white p-4 rounded-3xl shadow-sm mx-auto w-fit">
                      <Upload className="h-8 w-8 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900">Upload high-res photo</p>
                      <p className="text-slate-400 font-medium">Drag and drop or click to browse</p>
                    </div>
                  </div>
                )}
              </label>
              {imagePreview && (
                <Button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageFile(null) }}
                  variant="destructive"
                  size="icon"
                  className="absolute top-6 right-6 rounded-2xl shadow-xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* BASIC INFO */}
          <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                <div className="bg-orange-500 p-2 rounded-xl"><Flame className="h-5 w-5 text-white" /></div>
                Core Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Recipe Title</FormLabel>
                    <FormControl>
                      <Input placeholder="What's the name of your dish?" className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Story/Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Share the origin or the flavor profile..." className="min-h-32 rounded-2xl border-slate-100 bg-slate-50 font-medium text-lg resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: 'prepTime', label: 'Prep (min)', icon: Clock },
                  { name: 'cookTime', label: 'Cook (min)', icon: Flame },
                  { name: 'servings', label: 'Servings', icon: Users },
                ].map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400 flex items-center gap-1">
                          <item.icon className="h-3 w-3" /> {item.label}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl font-bold">
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* INGREDIENTS */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight px-2 flex items-center gap-3">
              Ingredients <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{ingredientFields.length}</span>
            </h3>
            <div className="grid gap-4">
              {ingredientFields.map((field, index) => (
                <div key={field.id} className="flex gap-3 group animate-in slide-in-from-left-2 duration-300">
                  <div className="w-1/3">
                    <Input placeholder="Qty (e.g. 2 cups)" className="h-14 rounded-2xl border-slate-100 bg-white font-bold shadow-sm" {...form.register(`ingredients.${index}.quantity`)} />
                  </div>
                  <div className="flex-1 relative">
                    <Input placeholder="Item (e.g. Flour)" className="h-14 rounded-2xl border-slate-100 bg-white font-bold shadow-sm pr-12" {...form.register(`ingredients.${index}.item`)} />
                    {index > 0 && (
                      <button type="button" onClick={() => removeIngredient(index)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendIngredient({ item: '', quantity: '' })} className="h-14 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-black hover:bg-slate-50 hover:border-orange-200">
                <Plus className="h-5 w-5 mr-2" /> Add Ingredient
              </Button>
            </div>
          </div>

          {/* INSTRUCTIONS */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tight px-2">Method / Instructions</h3>
            <div className="space-y-6">
              {instructionFields.map((field, index) => (
                <div key={field.id} className="flex gap-6 group animate-in slide-in-from-right-2 duration-300">
                  <div className="shrink-0 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Describe this step..."
                      className="min-h-24 rounded-3xl border-slate-100 bg-white font-medium text-lg shadow-sm pr-14 py-4"
                      {...form.register(`instructions.${index}` as any)}
                    />
                    {index > 0 && (
                      <button type="button" onClick={() => removeStep(index)} className="absolute right-4 top-6 text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendStep('')} className="h-14 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-black hover:bg-slate-50 hover:border-orange-200 w-full">
                <Plus className="h-5 w-5 mr-2" /> Add Next Step
              </Button>
            </div>
          </div>

          {/* SUBMIT SECTION */}
          <div className="pt-10 border-t border-slate-100">
            {error && <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl font-bold flex items-center gap-2 animate-bounce"><X className="h-5 w-5" /> {error}</div>}

            <div className="flex flex-col md:flex-row gap-4">
              <Button type="button" variant="ghost" onClick={() => router.back()} className="h-16 flex-1 rounded-[1.5rem] font-black text-slate-500 text-lg">
                Save Draft
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-16 flex-2 rounded-[1.5rem] bg-orange-500 hover:bg-orange-600 font-black text-xl shadow-xl shadow-orange-200 transition-all active:scale-[0.98]">
                {isSubmitting ? <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Publishing...</> : 'Publish Recipe'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}