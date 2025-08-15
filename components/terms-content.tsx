"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Shield, Coins, Smartphone, AlertTriangle, Scale } from "lucide-react"

export function TermsContent() {
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
            <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <Image
                src="/images/houselooklogo.png"
                alt="HouseLook Logo"
                width={96}
                height={96}
                className="w-24 h-24 object-contain drop-shadow-lg"
              />
            </div>
            <span className="text-3xl font-black font-heading tracking-tight">
              <span className="text-houselook-black">House</span>
              <span className="bg-gradient-primary bg-clip-text text-transparent">Look</span>
            </span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-black font-heading text-houselook-black mb-4">Terms of Service</h1>
          <p className="text-xl text-houselook-darkGray max-w-2xl mx-auto">
            Please read these terms carefully before using HouseLook services
          </p>
          <p className="text-sm text-houselook-coolGray mt-4">Last updated: January 15, 2025</p>
        </div>

        {/* Terms Content */}
        <Card
          className={`bg-white/80 backdrop-blur-md shadow-professional-xl border border-houselook-coolGray/20 rounded-2xl transition-all duration-1000 delay-300 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">1. Introduction</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  Welcome to HouseLook ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our
                  website, mobile application, and services (collectively, the "Service") operated by HouseLook.
                </p>
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part
                  of these terms, then you may not access the Service.
                </p>
              </div>
            </section>

            {/* Points System */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Coins className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">2. Points System</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  <strong>2.1 Points Overview:</strong> HouseLook operates on a points-based system where users purchase
                  points to access premium features such as viewing property details and saving properties.
                </p>
                <p>
                  <strong>2.2 Point Values:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>1 Point = 1 Kenyan Shilling (KSh 1)</li>
                  <li>Viewing property details: 20 points</li>
                  <li>Saving a property: 10 points</li>
                  <li>Minimum purchase: 10 points (KSh 10)</li>
                </ul>
                <p>
                  <strong>2.3 Point Purchases:</strong> Points can be purchased through M-Pesa integration. All
                  transactions are processed securely through authorized payment gateways.
                </p>
                <p>
                  <strong>2.4 Point Expiry:</strong> Points do not expire but may be subject to account inactivity
                  policies as outlined in Section 8.
                </p>
                <p>
                  <strong>2.5 Refunds:</strong> Points are generally non-refundable except in cases of technical errors
                  or unauthorized transactions. Refund requests must be submitted within 7 days of purchase.
                </p>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">3. Payment Terms</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  <strong>3.1 M-Pesa Integration:</strong> We use M-Pesa for secure payment processing. By using our
                  payment services, you agree to M-Pesa's terms and conditions.
                </p>
                <p>
                  <strong>3.2 Transaction Fees:</strong> Standard M-Pesa transaction fees may apply as per Safaricom's
                  current rates.
                </p>
                <p>
                  <strong>3.3 Failed Transactions:</strong> In case of failed transactions, points will not be credited,
                  and any deducted amounts will be refunded within 24-48 hours.
                </p>
                <p>
                  <strong>3.4 Pricing:</strong> We reserve the right to modify point values and pricing with 30 days'
                  notice to users.
                </p>
              </div>
            </section>

            {/* User Accounts */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">4. User Accounts</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  <strong>4.1 Account Creation:</strong> You must provide accurate, complete, and current information
                  when creating an account.
                </p>
                <p>
                  <strong>4.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your
                  account credentials.
                </p>
                <p>
                  <strong>4.3 Account Termination:</strong> We reserve the right to terminate accounts that violate
                  these terms or engage in fraudulent activities.
                </p>
                <p>
                  <strong>4.4 Data Accuracy:</strong> Users must ensure all personal information provided is accurate
                  and up-to-date.
                </p>
              </div>
            </section>

            {/* Prohibited Uses */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">5. Prohibited Uses</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>You may not use our Service:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>
                    To violate any international, federal, provincial, or state regulations, rules, laws, or local
                    ordinances
                  </li>
                  <li>
                    To infringe upon or violate our intellectual property rights or the intellectual property rights of
                    others
                  </li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>For any obscene or immoral purpose</li>
                  <li>To interfere with or circumvent the security features of the Service</li>
                </ul>
              </div>
            </section>

            {/* Property Listings */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">6. Property Listings</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  <strong>6.1 Accuracy:</strong> While we strive to ensure accuracy, we do not guarantee the
                  completeness or accuracy of property information.
                </p>
                <p>
                  <strong>6.2 Third-Party Content:</strong> Property listings are provided by third-party agents and
                  landlords. We are not responsible for the accuracy of such content.
                </p>
                <p>
                  <strong>6.3 Verification:</strong> Users are advised to verify all property details independently
                  before making any commitments.
                </p>
                <p>
                  <strong>6.4 Availability:</strong> Property availability is subject to change without notice.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">7. Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  In no event shall HouseLook, nor its directors, employees, partners, agents, suppliers, or affiliates,
                  be liable for any indirect, incidental, special, consequential, or punitive damages, including without
                  limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use
                  of the Service.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">8. Termination</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, without prior
                  notice or liability, under our sole discretion, for any reason whatsoever and without limitation,
                  including but not limited to a breach of the Terms.
                </p>
                <p>If you wish to terminate your account, you may simply discontinue using the Service.</p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">9. Governing Law</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  These Terms shall be interpreted and governed by the laws of the Republic of Kenya, without regard to
                  its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
                  rights.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">10. Changes to Terms</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                  revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                </p>
                <p>What constitutes a material change will be determined at our sole discretion.</p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-houselook-aliceblue/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-houselook-black font-heading mb-4">Contact Us</h2>
              <div className="space-y-2 text-houselook-darkGray">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <p>
                  <strong>Email:</strong> houselook254@gmail.com
                </p>
                <p>
                  <strong>Phone:</strong> +254 700 123 456
                </p>
                <p>
                  <strong>Address:</strong> Westlands Business Center, Nairobi, Kenya
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
