"use client"

import { useState } from "react"
import { ChevronDown, MessageCircle, Phone, Mail, Sparkles, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "How do I list my property on HouseLook?",
    answer:
      "Simply go to the 'List Property' page, fill in your details (name and phone/email), and we'll contact you within one hour to help you list your property for free!",
    icon: "🏠",
  },
  {
    question: "Is it free to list my property?",
    answer:
      "Yes! Listing your property on HouseLook is completely free. We only charge a small commission when your property gets rented or sold.",
    icon: "💰",
  },
  {
    question: "How do HouseLook points work?",
    answer:
      "Points help you boost your property visibility and access premium features. You can buy points via M-Pesa starting from KES 50 for 50 points. Points never expire!",
    icon: "⭐",
  },
  {
    question: "How quickly will I get contacted after listing?",
    answer:
      "We guarantee to contact you within one hour during business hours (8 AM - 8 PM). For listings submitted after hours, we'll reach out first thing the next morning.",
    icon: "⚡",
  },
  {
    question: "Can I edit my property listing after it's published?",
    answer:
      "Yes! Once your property is listed, you can log into your dashboard to make updates, add photos, or change the status anytime.",
    icon: "✏️",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept M-Pesa for point purchases and premium features. Simply enter your Safaricom number and follow the prompts to complete payment.",
    icon: "📱",
  },
  {
    question: "How do I save properties I'm interested in?",
    answer:
      "Click the heart icon on any property card to save it to your favorites. You can view all saved properties in your dashboard.",
    icon: "❤️",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "We use industry-standard encryption and never share your personal information with third parties without your consent.",
    icon: "🔒",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes, you can permanently delete your account from your dashboard. This will remove all your data and cannot be undone.",
    icon: "🗑️",
  },
  {
    question: "Do you charge tenants or buyers?",
    answer:
      "No! HouseLook is completely free for tenants and buyers. We only charge property owners a small commission upon successful rental or sale.",
    icon: "🎉",
  },
]

export function FaqContent() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-houselook-aliceblue via-white to-houselook-whitesmoke relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-houselook-cyan/20 to-houselook-teal/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-houselook-indigo/20 to-houselook-cyan/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-houselook-cyan/10 to-houselook-indigo/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-houselook-cyan via-houselook-teal to-houselook-indigo text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-white/20 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-white/40 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-10 right-1/3 w-5 h-5 bg-white/25 rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="text-sm font-medium">Your Questions Answered</span>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse delay-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent leading-tight">
            Frequently Asked
            <br />
            <span className="text-yellow-300">Questions</span>
          </h1>

          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed font-light">
            Got questions? We've got answers! Find everything you need to know about
            <span className="font-semibold text-yellow-300"> HouseLook</span>.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">10 Questions</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Instant Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-houselook-cyan to-houselook-indigo text-white rounded-full px-6 py-2 mb-6 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Popular Questions</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-houselook-darkgray mb-4">Everything You Need to Know</h2>
          <p className="text-houselook-coolgray text-lg max-w-2xl mx-auto">
            Quick answers to the most common questions about HouseLook
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
                openItems.includes(index) ? "ring-2 ring-houselook-cyan/50 shadow-houselook-cyan/20" : ""
              }`}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-8 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-houselook-aliceblue/50 hover:to-transparent transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <div className="text-3xl bg-gradient-to-br from-houselook-cyan to-houselook-indigo p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {faq.icon}
                  </div>
                  <h3 className="text-xl font-bold text-houselook-darkgray pr-4 group-hover:text-houselook-cyan transition-colors duration-300">
                    {faq.question}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-full transition-all duration-300 ${
                    openItems.includes(index)
                      ? "bg-houselook-cyan text-white rotate-180"
                      : "bg-houselook-aliceblue text-houselook-coolgray group-hover:bg-houselook-cyan group-hover:text-white"
                  }`}
                >
                  <ChevronDown className="w-6 h-6" />
                </div>
              </button>

              {openItems.includes(index) && (
                <div className="px-8 pb-8 border-t border-houselook-whitesmoke/50 animate-in slide-in-from-top-2 duration-300">
                  <div className="bg-gradient-to-r from-houselook-aliceblue/30 to-transparent p-6 rounded-2xl mt-6">
                    <p className="text-houselook-coolgray leading-relaxed text-lg">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-20 bg-gradient-to-r from-white via-houselook-aliceblue to-white rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-houselook-cyan/5 via-transparent to-houselook-indigo/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-houselook-cyan/20 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-houselook-indigo/20 to-transparent rounded-full blur-2xl"></div>

          <div className="relative text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-houselook-cyan to-houselook-indigo text-white rounded-full px-6 py-2 mb-6 shadow-lg">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Need More Help?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-houselook-darkgray mb-4">Still have questions?</h2>
            <p className="text-houselook-coolgray text-lg max-w-2xl mx-auto">
              We're here to help! Reach out to us through any of these channels and get instant support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-houselook-aliceblue hover:from-houselook-cyan hover:to-houselook-teal hover:text-white transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-white/50">
              <div className="bg-gradient-to-br from-houselook-cyan to-houselook-teal p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:bg-white group-hover:text-houselook-cyan transition-all duration-300 shadow-lg">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 group-hover:text-white">WhatsApp</h3>
              <p className="text-lg font-semibold bg-gradient-to-r from-houselook-cyan to-houselook-indigo bg-clip-text text-transparent group-hover:text-white">
                0793779647
              </p>
              <p className="text-sm opacity-80 mt-2 group-hover:text-white/90">Instant messaging</p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-houselook-aliceblue hover:from-houselook-indigo hover:to-houselook-cyan hover:text-white transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-white/50">
              <div className="bg-gradient-to-br from-houselook-indigo to-houselook-cyan p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:bg-white group-hover:text-houselook-indigo transition-all duration-300 shadow-lg">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 group-hover:text-white">Call Us</h3>
              <p className="text-lg font-semibold bg-gradient-to-r from-houselook-indigo to-houselook-cyan bg-clip-text text-transparent group-hover:text-white">
                0793779647
              </p>
              <p className="text-sm opacity-80 mt-2 group-hover:text-white/90">Direct support</p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-white to-houselook-aliceblue hover:from-houselook-teal hover:to-houselook-indigo hover:text-white transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-white/50">
              <div className="bg-gradient-to-br from-houselook-teal to-houselook-indigo p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:bg-white group-hover:text-houselook-teal transition-all duration-300 shadow-lg">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 group-hover:text-white">Email</h3>
              <p className="text-lg font-semibold bg-gradient-to-r from-houselook-teal to-houselook-indigo bg-clip-text text-transparent group-hover:text-white">
                info@houselook.co.ke
              </p>
              <p className="text-sm opacity-80 mt-2 group-hover:text-white/90">Professional support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
