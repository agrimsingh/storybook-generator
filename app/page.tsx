import StoryInputForm from "@/components/story-input-form"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Storybook Generator</h1>
      <StoryInputForm />
    </main>
  )
}
