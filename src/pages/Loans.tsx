
import Layout from "@/components/Layout";
import { Building, Home, Percent, Calculator, CreditCard, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { formatPrice } from "@/lib/data";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(20);
  
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  const monthlyPayment = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / 
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-6">Home Loan Calculator</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount: {formatPrice(loanAmount)}
          </label>
          <input
            type="range"
            min="500000"
            max="50000000"
            step="100000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹5 Lakhs</span>
            <span>₹5 Crores</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Rate: {interestRate}%
          </label>
          <input
            type="range"
            min="5"
            max="20"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5%</span>
            <span>20%</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Term: {loanTerm} Years
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={loanTerm}
            onChange={(e) => setLoanTerm(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 Year</span>
            <span>30 Years</span>
          </div>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Monthly Payment:</span>
          <span className="font-bold">{formatPrice(Math.round(monthlyPayment))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Payment:</span>
          <span className="font-medium">{formatPrice(Math.round(totalPayment))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Interest:</span>
          <span className="font-medium">{formatPrice(Math.round(totalInterest))}</span>
        </div>
      </div>
      
      <Button className="w-full mt-6 bg-black hover:bg-black/90">
        Check Your Eligibility
      </Button>
    </div>
  );
};

const Loans = () => {
  return (
    <Layout>
      <main className="flex-grow pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-black py-12 md:py-20">
          <div className="container text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Home Loans & Financing
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Find the perfect home loan solution to make your dream property a reality.
            </p>
          </div>
        </section>
        
        {/* Loan Types Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Explore Our Loan Options</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We offer a range of loan solutions tailored to meet different needs and property types.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-14 h-14 bg-black/5 rounded-lg flex items-center justify-center mb-4">
                  <Home className="text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Home Purchase Loan</h3>
                <p className="text-gray-600 mb-4">
                  Loans designed for purchasing residential properties, including apartments, villas, and independent houses.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-black" />
                    <span>Up to 80% of property value</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-black" />
                    <span>Competitive interest rates</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-black" />
                    <span>Flexible repayment terms</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                  Learn More
                </Button>
              </div>
              
              <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-14 h-14 bg-black/5 rounded-lg flex items-center justify-center mb-4">
                  <Building className="text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Construction Loan</h3>
                <p className="text-gray-600 mb-4">
                  Finance the construction of your dream home on a plot you already own with flexible disbursement options.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-black" />
                    <span>Phased disbursement based on stages</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-black" />
                    <span>Interest only on disbursed amount</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-black" />
                    <span>Conversion to term loan post-construction</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                  Learn More
                </Button>
              </div>
              
              <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-14 h-14 bg-black/5 rounded-lg flex items-center justify-center mb-4">
                  <Percent className="text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2">Refinance Loan</h3>
                <p className="text-gray-600 mb-4">
                  Transfer your existing home loan to us for better rates, lower EMIs or additional funding for your needs.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-black" />
                    <span>Lower interest rates</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-black" />
                    <span>Top-up loan facility</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-black" />
                    <span>Reduced processing time</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Calculator Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Plan Your Home Loan</h2>
                  <p className="text-gray-600">
                    Use our calculator to estimate your monthly payments and find a loan that fits your budget. Adjust the variables to see how they affect your payments.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calculator className="text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Easy Calculations</h3>
                      <p className="text-gray-600 text-sm">
                        Our interactive loan calculator helps you understand exactly what you'll pay each month and over the life of your loan.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Competitive Rates</h3>
                      <p className="text-gray-600 text-sm">
                        We partner with leading banks and financial institutions to bring you the most competitive interest rates in the market.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Fast Approvals</h3>
                      <p className="text-gray-600 text-sm">
                        Our streamlined process ensures quick loan approvals, so you can move forward with your property purchase without delays.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button className="mt-8 bg-black hover:bg-black/90 gap-2">
                  <span>Apply for a Loan</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
              
              <div>
                <LoanCalculator />
              </div>
            </div>
          </div>
        </section>
        
        {/* Process Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Simple Loan Process</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We've made getting a home loan as simple and painless as possible with our straightforward process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Apply Online</h3>
                <p className="text-gray-600">
                  Fill out our simple online application form to get started with your loan process.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Document Submission</h3>
                <p className="text-gray-600">
                  Submit your documents electronically for verification and processing.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Loan Approval</h3>
                <p className="text-gray-600">
                  Our team reviews your application and approves your loan quickly.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Disbursement</h3>
                <p className="text-gray-600">
                  Once approved, the loan amount is disbursed directly to the seller or developer.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-black">
          <div className="container">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Finance Your Dream Home?</h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Our loan advisors are ready to help you find the perfect financing solution for your needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-black hover:bg-gray-100">
                  Apply Now
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Schedule a Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Loans;
