import { Check } from 'lucide-react';

export default function Pricing() {
  const tiers = [
    {
      name: "Hobby",
      href: "#",
      priceMonthly: 12,
      description: "Perfect for personal use and small projects",
      includedFeatures: [
        "5 GB of storage",
        "Up to 3 users",
        "Basic support",
        "Simple collaboration tools",
      ],
    },
    {
      name: "Pro",
      href: "#",
      priceMonthly: 24,
      description: "Everything you need for growing teams",
      includedFeatures: [
        "50 GB of storage",
        "Up to 20 users",
        "Priority support",
        "Advanced collaboration tools",
        "Custom integrations",
      ],
    },
    {
      name: "Enterprise",
      href: "#",
      priceMonthly: 49,
      description: "Advanced features for large organizations",
      includedFeatures: [
        "Unlimited storage",
        "Unlimited users",
        "24/7 dedicated support",
        "Advanced security features",
        "Custom branding",
        "API access",
        "Dedicated account manager",
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the perfect plan for your needs
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Whether you're a solo creator or a large team, we have a plan that's right for you. All plans include our core features.
        </p>
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier, tierIdx) => (
              <div
                key={tier.name}
                className={`flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10 ${
                  tierIdx === 1 ? 'relative' : ''
                }`}
              >
                {tierIdx === 1 && (
                  <div className="absolute -top-4 left-0 right-0">
                    <div className="mx-auto w-32 rounded-full bg-indigo-600 px-4 py-1 text-center text-sm font-semibold text-white">
                      Most Popular
                    </div>
                  </div>
                )}
                <div>
                  <h3
                    className={`text-2xl font-bold tracking-tight ${
                      tierIdx === 1 ? 'text-indigo-600' : 'text-gray-900'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">{tier.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">${tier.priceMonthly}</span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {tier.includedFeatures.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={tier.href}
                  className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    tierIdx === 1
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  Choose plan
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
