"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Eye, Lock, Database, Users, Globe, FileText, AlertTriangle } from "lucide-react"

export function PrivacyContent() {
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

          <h1 className="text-4xl md:text-5xl font-black font-heading text-houselook-black mb-4">Privacy Policy</h1>
          <p className="text-xl text-houselook-darkGray max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-houselook-coolGray mt-4">Last updated: January 15, 2025</p>
        </div>

        {/* Privacy Content */}
        <Card
          className={`bg-white/80 backdrop-blur-md shadow-professional-xl border border-houselook-coolGray/20 rounded-2xl transition-all duration-1000 delay-300 ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">1. Introduction</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  HouseLook ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                  how we collect, use, disclose, and safeguard your information when you use our website, mobile
                  application, and services.
                </p>
                <p>
                  Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
                  please do not access or use our services.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">2. Information We Collect</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  <strong>2.1 Personal Information:</strong> We may collect personal information that you voluntarily
                  provide to us when you:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Register for an account</li>
                  <li>Make a purchase or transaction</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p>
                  <strong>2.2 Personal Information Types:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information (M-Pesa phone number, transaction IDs)</li>
                  <li>Profile information and preferences</li>
                  <li>Communication history with our support team</li>
                </ul>
                <p>
                  <strong>2.3 Automatically Collected Information:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Location data (with your permission)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">3. How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide, operate, and maintain our services</li>
                  <li>Process transactions and manage your account</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Provide customer service and support</li>
                  <li>Improve and personalize your experience</li>
                  <li>Develop new features and services</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Prevent fraud and enhance security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">
                  4. Information Sharing and Disclosure
                </h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  <strong>4.1 We do not sell your personal information.</strong> We may share your information in the
                  following circumstances:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> With third-party vendors who perform services on our behalf
                    (payment processing, analytics, customer support)
                  </li>
                  <li>
                    <strong>Property Agents:</strong> Contact information may be shared with property agents when you
                    express interest in a property
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                  </li>
                  <li>
                    <strong>Consent:</strong> With your explicit consent for specific purposes
                  </li>
                </ul>
              </div>
            </section>

            {/* M-Pesa and Payment Data */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">5. M-Pesa and Payment Data</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  <strong>5.1 Payment Processing:</strong> We use M-Pesa for secure payment processing. We do not store
                  your M-Pesa PIN or full payment credentials.
                </p>
                <p>
                  <strong>5.2 Transaction Data:</strong> We retain transaction IDs and payment amounts for accounting
                  and customer service purposes.
                </p>
                <p>
                  <strong>5.3 Security:</strong> All payment data is encrypted and processed through secure channels in
                  compliance with industry standards.
                </p>
                <p>
                  <strong>5.4 Third-Party Processing:</strong> M-Pesa transactions are subject to Safaricom's privacy
                  policy and terms of service.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">6. Data Security</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p>
                  <strong>Security measures include:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Secure hosting infrastructure</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p>
                  However, no method of transmission over the internet or electronic storage is 100% secure. We cannot
                  guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">7. Data Retention</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in
                  this Privacy Policy, unless a longer retention period is required by law.
                </p>
                <p>
                  <strong>Retention periods:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Account information: Until account deletion + 30 days</li>
                  <li>Transaction records: 7 years for tax and legal compliance</li>
                  <li>Usage data: 2 years for analytics purposes</li>
                  <li>Support communications: 3 years</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">8. Your Privacy Rights</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <strong>Access:</strong> Request access to your personal information
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal information
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your data in a portable format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing of your personal information
                  </li>
                  <li>
                    <strong>Restriction:</strong> Request restriction of processing
                  </li>
                </ul>
                <p>To exercise these rights, please contact us using the information provided in Section 12.</p>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">
                  9. Cookies and Tracking Technologies
                </h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>We use cookies and similar tracking technologies to enhance your experience on our platform.</p>
                <p>
                  <strong>Types of cookies we use:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>
                    <strong>Essential cookies:</strong> Required for basic functionality
                  </li>
                  <li>
                    <strong>Performance cookies:</strong> Help us understand how you use our service
                  </li>
                  <li>
                    <strong>Functional cookies:</strong> Remember your preferences
                  </li>
                  <li>
                    <strong>Marketing cookies:</strong> Used for targeted advertising (with consent)
                  </li>
                </ul>
                <p>
                  You can control cookies through your browser settings, but disabling certain cookies may affect
                  functionality.
                </p>
              </div>
            </section>

            {/* Third-Party Services */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">10. Third-Party Services</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  Our service may contain links to third-party websites or integrate with third-party services. We are
                  not responsible for the privacy practices of these third parties.
                </p>
                <p>
                  <strong>Third-party services we use:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>M-Pesa (Safaricom) for payment processing</li>
                  <li>Google Analytics for usage analytics</li>
                  <li>Cloud hosting providers for data storage</li>
                  <li>Email service providers for communications</li>
                </ul>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">11. Children's Privacy</h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  Our service is not intended for children under the age of 18. We do not knowingly collect personal
                  information from children under 18.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with personal information,
                  please contact us immediately.
                </p>
              </div>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-houselook-black font-heading">
                  12. Changes to This Privacy Policy
                </h2>
              </div>
              <div className="space-y-4 text-houselook-darkGray leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  For material changes, we will provide additional notice (such as email notification) at least 30 days
                  before the changes take effect.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-houselook-aliceblue/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-houselook-black font-heading mb-4">Contact Us</h2>
              <div className="space-y-2 text-houselook-darkGray">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <p>
                  <strong>Email:</strong> info@houselook.co.ke
                </p>
                <p>
                  <strong>Phone:</strong> 0793779647
                </p>
                <p>
                  <strong>Address:</strong> Westlands Business Center, Nairobi, Kenya
                </p>
                <p>
                  <strong>Data Protection Officer:</strong> info@houselook.co.ke
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
