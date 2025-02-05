import { Feather, Zap, Smartphone, Users, Lock, Globe } from "lucide-react"

export default function Features() {
  const features = [
    {
      name: "Intuitive Editor",
      description: "Our clean and simple editor lets you focus on your ideas and thoughts.",
      icon: Feather,
    },
    {
      name: "Lightning Fast",
      description: "Bacvy is optimized for speed, ensuring your work is always saved and synced quickly.",
      icon: Zap,
    },
    {
      name: "Mobile Friendly",
      description: "Access your notes from any device with our responsive mobile app.",
      icon: Smartphone,
    },
    {
      name: "Collaboration",
      description: "Work together with your team in real-time, no matter where you are.",
      icon: Users,
    },
    {
      name: "Secure",
      description: "Your data is encrypted and protected with industry-standard security measures.",
      icon: Lock,
    },
    {
      name: "Offline Access",
      description: "Work offline and sync your changes when you're back online.",
      icon: Globe,
    },
  ]

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to organize your thoughts
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Bacvy provides you with the tools you need to capture, organize, and share your ideas effectively.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

