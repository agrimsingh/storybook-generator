"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { useStoryStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import StoryPromptPreview from "./story-prompt-preview";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import AnimatedReveal from "./animated-reveal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  genre: z.string().min(2, {
    message: "Genre must be at least 2 characters.",
  }),
  mainCharacter: z.string().min(2, {
    message: "Main character must be at least 2 characters.",
  }),
  setting: z.string().min(2, {
    message: "Setting must be at least 2 characters.",
  }),
  mood: z.string().min(2, {
    message: "Mood must be at least 2 characters.",
  }),
  theme: z.string().min(2, {
    message: "Theme must be at least 2 characters.",
  }),
});

export default function StoryInputForm() {
  const router = useRouter();
  const { storyPrompt, setStoryPrompt, startGeneration, isGenerating, error } =
    useStoryStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: storyPrompt,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    setStoryPrompt(values);
    await startGeneration();
    router.push("/story");
  }

  return (
    <AnimatedReveal>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a title for your story"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setStoryPrompt({ ...storyPrompt, title: e.target.value });
                    }}
                  />
                </FormControl>
                <FormDescription>The main title of your story.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Fantasy, Sci-Fi, Romance"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setStoryPrompt({
                          ...storyPrompt,
                          genre: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainCharacter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Character</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., A brave knight, a curious scientist"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setStoryPrompt({
                          ...storyPrompt,
                          mainCharacter: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="setting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setting</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., A mystical forest, a futuristic city"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setStoryPrompt({
                          ...storyPrompt,
                          setting: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mood</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Mysterious, Joyful, Tense"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setStoryPrompt({
                          ...storyPrompt,
                          mood: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Redemption, Love conquers all, The price of power"
                    className="resize-none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setStoryPrompt({ ...storyPrompt, theme: e.target.value });
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The underlying message or main idea of the story.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Story"
            )}
          </Button>
        </form>
      </Form>
    </AnimatedReveal>
  );
}
