export default function Testimonials() {
    return (
      <section className="py-12 bg-gray-50 overflow-hidden md:py-20 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <img className="mx-auto h-8" src="https://thumbs.dreamstime.com/b/desk-table-furniture-line-icon-linear-style-sign-mobile-concept-web-design-desk-table-furniture-outline-vector-icon-symbol-249115021.jpg?height=32&width=160" alt="Workcation" />
            <blockquote className="mt-10">
              <div className="max-w-3xl mx-auto text-center text-2xl leading-9 font-medium text-gray-900">
                <p>
                  &ldquo;Bacvy has transformed the way our team collaborates. It's intuitive, fast, and helps us stay
                  organized. I can't imagine working without it now.&rdquo;
                </p>
              </div>
              <footer className="mt-8">
                <div className="md:flex md:items-center md:justify-center">
                  <div className="md:flex-shrink-0">
                    <img className="mx-auto h-10 w-10 rounded-full" src="https://prod.wp.cdn.aws.wfu.edu/sites/298/2021/06/Aidan.png?height=40&width=40" alt="" />
                  </div>
                  <div className="mt-3 text-center md:mt-0 md:ml-4 md:flex md:items-center">
                    <div className="text-base font-medium text-gray-900">Kunal Singh</div>
  
                    <svg className="hidden md:block mx-1 h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 0h3L9 20H6l5-20z" />
                    </svg>
  
                    <div className="text-base font-medium text-gray-500">CEO, TechCorp</div>
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>
    )
  }
  
  