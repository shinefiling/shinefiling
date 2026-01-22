import 'package:flutter/material.dart';


class ServiceContent {
  final String id;
  final String title;
  final String subtitle;
  final String description;
  final String heroImage;
  final Map<String, String> stats;
  final List<PricingPlan> plans;
  final String overviewTitle;
  final String overviewContent;
  final List<BenefitItem> benefits;
  final List<String> whoShouldRegister;
  final List<ProcessStep> process;
  final List<FaqItem> faqs;
  final List<String> requiredDocuments;
  final List<String>? comparisonColumns;
  final List<ComparisonItem>? comparisons;
  final List<ComplianceItem>? compliances;

  ServiceContent({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.heroImage,
    required this.stats,
    required this.plans,
    required this.overviewTitle,
    required this.overviewContent,
    required this.benefits,
    required this.whoShouldRegister,
    required this.process,
    required this.faqs,
    required this.requiredDocuments,
    this.comparisonColumns,
    this.comparisons,
    this.compliances,
  });
}

class ComparisonItem {
  final String feature;
  final List<String> values;

  ComparisonItem({required this.feature, required this.values});
}

class ComplianceItem {
  final String name;
  final String due;
  final String type;

  ComplianceItem({required this.name, required this.due, required this.type});
}

class PricingPlan {
  final String name;
  final String price;
  final String originalPrice;
  final List<String> features;
  final bool isPopular;
  final Color color;

  PricingPlan({
    required this.name,
    required this.price,
    required this.originalPrice,
    required this.features,
    this.isPopular = false,
    this.color = const Color(0xFF10232A),
  });
}

class BenefitItem {
  final String title;
  final String description;
  final IconData icon;

  BenefitItem({required this.title, required this.description, required this.icon});
}

class ProcessStep {
  final String title;
  final String days;
  final String description;

  ProcessStep({required this.title, required this.days, required this.description});
}

class FaqItem {
  final String q;
  final String a;

  FaqItem({required this.q, required this.a});
}

// DATA REPOSITORY
class ServiceRepository {
  static final Map<String, ServiceContent> _data = {
    'Private Limited Company': ServiceContent(
      id: 'private-limited',
      title: 'Private Limited',
      subtitle: 'Company Registration',
      description: 'Launch your startup with the most trusted business structure. Get Limited Liability, Easy Funding, and Global Recognition.',
      heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Fast Track': '5-7 Days',
        'Trusted By': '50k+',
      },
      plans: [
        PricingPlan(
            name: 'Startup',
            price: '₹6,999',
            originalPrice: '₹12,000',
            features: [
              '2 DSC & 2 DIN',
              'Name Approval',
              'MOA & AOA Drafting',
              'Certificate of Incorporation',
              'PAN & TAN Allotment',
              'PF & ESIC Registration'
            ],
            color: Colors.white),
        PricingPlan(
            name: 'Growth',
            price: '₹14,999',
            originalPrice: '₹25,000',
            isPopular: true,
            features: [
              'Everything in Startup',
              'GST Registration',
              'Udyam (MSME) Registration',
              'Business Bank Account Support',
              'Accounting Software (1 Year)',
              'Dedicated Account Manager'
            ],
            color: const Color(0xFF10232A)),
        PricingPlan(
            name: 'Enterprise',
            price: '₹24,999',
            originalPrice: '₹40,000',
            features: [
              'Everything in Growth',
              'Trademark Filing (1 Class)',
              '1st Year ROC Compliance',
              'Auditor Appointment (ADT-1)',
              'Commencement of Business (INC-20A)',
              'Zero Balance Current A/c'
            ],
            color: Colors.white),
      ],
      overviewTitle: 'What is a Private Limited Company?',
      overviewContent:
          'A Private Limited Company (Pvt Ltd) is the most popular corporate legal entity in India. It is preferred by startups and growing businesses because it offers limited liability protection to its shareholders.\\n\\nIt is a separate legal entity from its owners, meaning the company is responsible for its own debts.',
      benefits: [
        BenefitItem(
            title: 'Limited Liability',
            description: 'Personal assets are safe.',
            icon: Icons.shield_rounded),
        BenefitItem(
            title: 'Separate Identity',
            description: 'Can own property in its name.',
            icon: Icons.business_rounded),
        BenefitItem(
            title: 'Easy Funding',
            description: 'Investors prefer Pvt Ltd.',
            icon: Icons.trending_up_rounded),
        BenefitItem(
            title: 'Perpetual Existence',
            description: 'Continues despite ownership changes.',
            icon: Icons.history_rounded),
      ],
      whoShouldRegister: [
        'Startups',
        'Tech Businesses',
        'E-commerce',
        'Consultants'
      ],
      process: [
        ProcessStep(
            title: 'DSC & Name',
            days: 'Day 1-2',
            description: 'DSC application and Name Approval.'),
        ProcessStep(
            title: 'Docs Drafting',
            days: 'Day 2-3',
            description: 'MOA, AOA and DIN preparation.'),
        ProcessStep(
            title: 'Filing',
            days: 'Day 3-5',
            description: 'SPICe+ filing with ROC.'),
        ProcessStep(
            title: 'Incorporation',
            days: 'Day 5-7',
            description: 'Get COI, PAN, TAN.'),
      ],
      faqs: [
        FaqItem(q: 'Min directors?', a: 'Minimum 2 directors required.'),
        FaqItem(q: 'Min capital?', a: 'No minimum capital required.'),
        FaqItem(q: 'Physical presence?', a: 'No, 100% online process.'),
      ],
      requiredDocuments: [
        'PAN & Aadhaar (Directors)',
        'Voter ID / Passport',
        'Bank Statement',
        'Electricity Bill (Office)',
        'Rent Agreement & NOC'
      ],
      comparisonColumns: ['Pvt Ltd', 'LLP', 'Proprietorship'],
      comparisons: [
        ComparisonItem(
            feature: 'Separate Legal Entity', values: ['Yes', 'Yes', 'No']),
        ComparisonItem(
            feature: 'Liability Protection',
            values: ['Limited (Safe)', 'Limited (Safe)', 'Unlimited (Risky)']),
        ComparisonItem(
            feature: 'Fundraising',
            values: ['High', 'Low', 'Impossible']),
        ComparisonItem(
            feature: 'Annual Compliance',
            values: ['High', 'Moderate', 'Low']),
      ],
      compliances: [
        ComplianceItem(
            name: 'Auditor Appointment (ADT-1)',
            due: '30 Days of Inc',
            type: 'One Time'),
        ComplianceItem(
            name: 'Commencement of Biz (INC-20A)',
            due: '180 Days of Inc',
            type: 'One Time'),
        ComplianceItem(
            name: 'ITR Filing',
            due: '30th Sep',
            type: 'Annual'),
        ComplianceItem(
            name: 'AOC-4 & MGT-7',
            due: 'Oct/Nov',
            type: 'Annual'),
      ],
    ),
    'One Person Company (OPC)': ServiceContent(
      id: 'opc',
      title: 'One Person Company',
      subtitle: '(OPC) Registration',
      description: 'Perfect for solo entrepreneurs. Enjoy Limited Liability with complete control. Register your OPC 100% Online.',
      heroImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Solo Control': '100%',
        'Liability': 'Limited',
      },
      plans: [
        PricingPlan(
          name: 'Basic',
          price: '₹4,999',
          originalPrice: '₹8,000',
          features: [
            '1 DSC & 1 DIN',
            'Name Approval',
            'Certificate of Incorporation',
            'MOA & AOA Drafting',
            'PAN & TAN Allotment',
            'GST Support'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Standard',
          price: '₹8,999',
          originalPrice: '₹15,000',
          features: [
            'Everything in Basic',
            'Nominee Consent Filing',
            'Share Certificate',
            'GST Registration',
            'Bank Account Support'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Premium',
          price: '₹12,999',
          originalPrice: '₹20,000',
          features: [
            'Everything in Standard',
            'MSME (Udyam) Registration',
            'First Board Resolution',
            'Bank Account Priority',
            'Dedicated Manager'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'Solo Entrepreneurship Redefined',
      overviewContent: 'One Person Company (OPC) is a hybrid structure that combines the benefits of a sole proprietorship and a company. It allows a single person to own and manage a company with limited liability protection.',
      benefits: [
        BenefitItem(title: 'Single Owner', description: 'Complete control over the business.', icon: Icons.person_rounded),
        BenefitItem(title: 'Limited Liability', description: 'Personal assets are safe.', icon: Icons.shield_rounded),
        BenefitItem(title: 'Legal Status', description: 'Separate legal entity from owner.', icon: Icons.business_rounded),
        BenefitItem(title: 'Easy Funding', description: 'Better credibility for banks.', icon: Icons.account_balance_rounded),
      ],
      whoShouldRegister: [
        'Solo Founders',
        'Freelancers moving to Corp',
        'Small Business Owners'
      ],
      process: [
        ProcessStep(title: 'DSC & Name', days: 'Day 1-2', description: 'Obtain DSC for Director and reserve name.'),
        ProcessStep(title: 'Incorporation', days: 'Day 3-5', description: 'File SPICe+ forms with Nominee consent.'),
        ProcessStep(title: 'Approval', days: 'Day 6-7', description: 'Get COI, PAN and TAN.'),
      ],
      faqs: [
        FaqItem(q: 'Is a Nominee mandatory?', a: 'Yes, a nominee is required for OPC registration.'),
        FaqItem(q: 'Can I convert to Pvt Ltd later?', a: 'Yes, you can convert it voluntarily or mandatorily based on turnover.'),
      ],
      requiredDocuments: [
        'Director PAN & Aadhaar',
        'Nominee PAN & Aadhaar',
        'Photo of Director',
        'Office Address Proof (Bill)',
        'Rent Agreement (if rented)',
        'NOC',
        'Nominee Consent Form'
      ],
    ),

    'Limited Liability Partnership (LLP)': ServiceContent(
      id: 'llp',
      title: 'Limited Liability Partnership',
      subtitle: '(LLP) Registration',
      description: 'The flexibility of a partnership with the safety of limited liability. Ideal for professional firms and small businesses.',
      heroImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=2069',
      stats: {
        'Compliance': 'Low',
        'Partners': 'Min 2',
      },
      plans: [
        PricingPlan(
          name: 'Basic',
          price: '₹4,999',
          originalPrice: '₹8,000',
          features: [
            '2 DSC & 2 DIN',
            'Name Approval',
            'Certificate of Incorporation',
            'LLP Agreement Drafting',
            'PAN & TAN Application'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Standard',
          price: '₹8,999',
          originalPrice: '₹14,000',
          features: [
            'Everything in Basic',
            'GST Registration',
            'Bank Account Support',
            'Udyam Registration',
            'Stamp Duty Support'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Premium',
          price: '₹12,999',
          originalPrice: '₹22,000',
          features: [
            'Everything in Standard',
            'Detailed LLP Deed',
            'First Compliance Filing',
            'Trademark Consultation',
            'Priority Support'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'Partnership Modernized',
      overviewContent: 'LLP is a balanced structure providing the benefits of limited liability to its partners at a low compliance cost. It is a separate legal entity from its partners.',
      benefits: [
        BenefitItem(title: 'No Min Capital', description: 'Start with any amount.', icon: Icons.monetization_on_rounded),
        BenefitItem(title: 'Limited Liability', description: 'Partners represent checks, not debts.', icon: Icons.gavel_rounded),
        BenefitItem(title: 'Low Compliance', description: 'Audit only if turnover > 40 Lakhs.', icon: Icons.check_circle_outline_rounded),
        BenefitItem(title: 'No Dividend Tax', description: 'Profits can be withdrawn easily.', icon: Icons.percent_rounded),
      ],
      whoShouldRegister: [
        'Professional Firms (CA, Law)',
        'Small Businesses',
        'Family Businesses'
      ],
      process: [
        ProcessStep(title: 'DSC & Name', days: 'Day 1-2', description: 'Apply for DSC and Name Reservation (RUN-LLP).'),
        ProcessStep(title: 'Incorporation', days: 'Day 3-5', description: 'File FiLLiP form with ROC.'),
        ProcessStep(title: 'Agreement', days: 'Post-Inc', description: 'File LLP Agreement (Form 3) within 30 days.'),
      ],
      faqs: [
        FaqItem(q: 'Is audit mandatory?', a: 'Only if turnover > ₹40 Lakhs or Contribution > ₹25 Lakhs.'),
        FaqItem(q: 'Can a company be a partner?', a: 'Yes, a body corporate can be a partner in an LLP.'),
      ],
      requiredDocuments: [
        'Partners PAN & Aadhaar',
        'Partners Photo',
        'Business Address Proof',
        'Rent Agreement & NOC',
        'Digital Signatures'
      ],
    ),

    'Partnership Firm Registration': ServiceContent(
      id: 'partnership',
      title: 'Partnership Firm',
      subtitle: 'Registration',
      description: 'The classic way to build together. Simple Structure with Shared Growth. Ideal for family businesses and small teams.',
      heroImage: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Time': '5-7 Days',
        'Type': 'Joint Venture',
      },
      plans: [
        PricingPlan(
          name: 'Lite',
          price: '₹2,999',
          originalPrice: '₹6,000',
          features: [
            'Custom Deed Drafting',
            'PAN Card Application',
            'Initial Legal Consulting',
            'Affidavit Preparation',
            'Bank Account Advisory'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Classic',
          price: '₹5,999',
          originalPrice: '₹12,000',
          features: [
            'Everything in Lite',
            'Registrar of Firms (ROF) Filing',
            'Registration Certificate',
            'TAN Allotment',
            'Priority Support',
            'Dedicated Manager'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Complete',
          price: '₹8,999',
          originalPrice: '₹18,000',
          features: [
            'Everything in Classic',
            'GST Registration',
            'MSME/Udyam Registration',
            'Shop & Establishment',
            'Logo & Invoice Design',
            'Zero Balance Current A/c'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'Understanding Partnership Firm',
      overviewContent: 'A Partnership Firm is one of the most popular forms of business organization in India for small to medium-scale businesses where two or more persons come together to carry on a business and share profits.\\n\\nIt is created by a written agreement known as the Partnership Deed, which outlines the rights, duties, and profit-sharing ratios of partners.',
      benefits: [
        BenefitItem(title: 'Minimal Compliance', description: 'No need for annual filings with MCA.', icon: Icons.bolt_rounded),
        BenefitItem(title: 'Cost Effective', description: 'Low cost of formation and dissolution.', icon: Icons.trending_up_rounded),
        BenefitItem(title: 'Shared Responsibility', description: 'Risks and financial burden are shared.', icon: Icons.handshake_rounded),
        BenefitItem(title: 'Flexibility', description: 'Partners decide how to operate via Deed.', icon: Icons.balance_rounded),
      ],
      whoShouldRegister: [
        'Family Businesses',
        'Small Traders',
        'Retail Shops',
        'Home Businesses',
        'Service Agencies'
      ],
      process: [
        ProcessStep(title: 'Name & Deed', days: 'Day 1-2', description: 'Selection of name and drafting of Partnership Deed.'),
        ProcessStep(title: 'Notarization', days: 'Day 3', description: 'Deed assigned by partners and notarized.'),
        ProcessStep(title: 'PAN & TAN', days: 'Day 4-5', description: 'Application for PAN card and TAN number.'),
        ProcessStep(title: 'ROF Filing', days: 'Day 6+', description: 'Submission to Registrar of Firms (Optional but Recommended).'),
      ],
      faqs: [
        FaqItem(q: 'Is registration mandatory?', a: 'No, but highly recommended to sue third parties.'),
        FaqItem(q: 'Minimum partners required?', a: 'Minimum 2 and maximum 50 partners are allowed.'),
        FaqItem(q: 'Can a minor be a partner?', a: 'Only for benefits, not liable for losses.'),
      ],
      requiredDocuments: [
        'PAN Card (All Partners)',
        'Address Proof (Voter/DL/Aadhar)',
        'Passport Photos',
        'Electricity Bill (Office)',
        'Rent Agreement & NOC'
      ],
    ),

    'Sole Proprietorship Registration': ServiceContent(
      id: 'proprietorship',
      title: 'Sole Proprietorship',
      subtitle: 'Registration',
      description: 'The simplest way to start your business. 100% Control, Zero Complexity. Get your Trade License & GST in days.',
      heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Fast Track': '3-5 Days',
        'Compliance': 'Minimal',
      },
      plans: [
        PricingPlan(
          name: 'Startup',
          price: '₹1,999',
          originalPrice: '₹5,000',
          features: [
            'MSME / Udyam Registration',
            'Professional Tax Enrollment',
            'Expert Consultation (15 Mins)',
            'Bank Account Advisory'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Optimal',
          price: '₹4,999',
          originalPrice: '₹10,000',
          features: [
            'Everything in Startup',
            'GST Registration',
            'Official Business Proof',
            'Current Bank Account Support',
            'Invoicing Software (Free)',
            'Dedicated Manager'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Elite',
          price: '₹7,999',
          originalPrice: '₹16,000',
          features: [
            'Everything in Optimal',
            'Shop & Establishment License',
            'FSSAI Registration (If Food)',
            'Income Tax Filing (1st Year)',
            'Trademark Filing Assistance',
            'Priority Support'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'About Sole Proprietorship',
      overviewContent: 'A Sole Proprietorship is a business that is owned and managed by a single individual. It is not a separate legal entity from its owner. This is the simplest and most common form of business registration in India.\\n\\nIt is ideal for local businesses, freelancers, small traders, and service providers who want to start operations immediately with minimal compliances.',
      benefits: [
        BenefitItem(title: 'Easiest to Start', description: 'Start in 3-5 days with just PAN/Aadhaar.', icon: Icons.rocket_launch_rounded),
        BenefitItem(title: 'Total Control', description: 'You are the only boss.', icon: Icons.person_rounded),
        BenefitItem(title: 'Minimal Compliance', description: 'Only Annual ITR required.', icon: Icons.bolt_rounded),
        BenefitItem(title: 'Lower Taxes', description: 'Taxed at individual slab rates.', icon: Icons.trending_up_rounded),
      ],
      whoShouldRegister: [
        'Freelancers',
        'Small Traders',
        'Local Shops',
        'Service Providers'
      ],
      process: [
        ProcessStep(title: 'Docs Collection', days: 'Day 1', description: 'Submission of PAN, Aadhaar, and Address Proofs.'),
        ProcessStep(title: 'MSME/Udyam', days: 'Day 2', description: 'Registration under MSME for recognition.'),
        ProcessStep(title: 'GST Registration', days: 'Day 3-5', description: 'Application for GSTIN.'),
        ProcessStep(title: 'Business Ready', days: 'Day 6', description: 'Get Certificates and open Bank Account.'),
      ],
      faqs: [
        FaqItem(q: 'Is separate bank account needed?', a: 'Yes, a Current Account in firm name is recommended.'),
        FaqItem(q: 'Minimum capital?', a: 'No minimum capital required.'),
        FaqItem(q: 'Can I convert later?', a: 'Yes, easily convertible to Pvt Ltd or LLP.'),
      ],
      requiredDocuments: [
        'PAN Card (Mandatory)',
        'Aadhaar Card',
        'Bank Passbook Review',
        'Electricity Bill',
        'Rent Agreement (If Rented)'
      ],
    ),

    'Section 8 NGO Company': ServiceContent(
      id: 'section8',
      title: 'Section 8 Company',
      subtitle: 'NGO Registration',
      description: 'Build a credible foundation for your cause. Get 12A & 80G Exemptions, CSR Funding eligibility, and corporate legal standing.',
      heroImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Timeline': '10-15 Days',
        'Status': 'Tax Exempt',
      },
      plans: [
        PricingPlan(
          name: 'Foundation',
          price: '₹9,999',
          originalPrice: '₹15,000',
          features: [
            '2 DSC & 2 DIN',
            'Name Approval (RUN)',
            'MOA & AOA Drafting',
            'Section 8 License (INC-12)',
            'Certificate of Incorporation',
            'PAN & TAN Allotment'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Impact',
          price: '₹14,999',
          originalPrice: '₹25,000',
          features: [
            'Everything in Foundation',
            '12A Tax Exemption App',
            '80G (Donor Tax Benefit) App',
            'NGO Darpan Registration',
            'Bank Account Support',
            'Digital Signature (DSC)'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Global',
          price: '₹24,999',
          originalPrice: '₹40,000',
          features: [
            'Everything in Impact',
            'FCRA Prior Permission App',
            'CSR Policy Drafting',
            'Project Proposal Template',
            'Annual Compliance (1 Year)',
            'Dedicated NGO Expert'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'Defining Section 8 Company',
      overviewContent: 'A Section 8 Company is registered under the Companies Act, 2013, for charitable or not-for-profit purposes. It has better recognition, credibility, and legal standing compared to traditional Trusts or Societies.\\n\\nIt is the most robust structure for NGOs looking to work with the Corporate Sector (CSR) and Government agencies.',
      benefits: [
        BenefitItem(title: 'Tax Exemptions', description: '100% tax exemption under 12A.', icon: Icons.bolt_rounded),
        BenefitItem(title: 'Donor Benefits', description: '50% deduction for donors (80G).', icon: Icons.trending_up_rounded),
        BenefitItem(title: 'CSR Funding', description: 'Preferred for CSR funds.', icon: Icons.emoji_events_rounded),
        BenefitItem(title: 'Credibility', description: 'High trust due to MCA regulations.', icon: Icons.star_rounded),
      ],
      whoShouldRegister: [
        'Social Workers',
        'Charitable Trusts',
        'Educationists',
        'CSR Foundations'
      ],
      process: [
        ProcessStep(title: 'Name Approval', days: 'Day 1-2', description: 'Name Reservation (RUN) without "Pvt Ltd".'),
        ProcessStep(title: 'DSC & DIN', days: 'Day 3-4', description: 'Digital Signatures for directors.'),
        ProcessStep(title: 'License (INC-12)', days: 'Day 5-9', description: 'Application for Central Govt License.'),
        ProcessStep(title: 'Incorporation', days: 'Day 10-15', description: 'Final SPICe+ filing for COI.'),
      ],
      faqs: [
        FaqItem(q: 'Can we distribute profits?', a: 'No, profits must be reinvested in objectives.'),
        FaqItem(q: 'Minimum capital?', a: 'No minimum capital required.'),
        FaqItem(q: 'Is FCRA mandatory?', a: 'Only for foreign contributions.'),
      ],
      requiredDocuments: [
        'PAN & Aadhaar (Directors)',
        'Voter ID / Passport',
        'Passport Photo',
        'Electricity Bill (Office)',
        'Rent Agreement'
      ],
      comparisonColumns: ['Section 8', 'Trust', 'Society'],
      comparisons: [
        ComparisonItem(feature: 'Registration', values: ['Central (MCA)', 'State', 'State']),
        ComparisonItem(feature: 'Credibility', values: ['High (Corporate)', 'Medium', 'Medium']),
        ComparisonItem(feature: 'Foreign Funds', values: ['FCRA Allowed', 'FCRA Allowed', 'Harder']),
        ComparisonItem(feature: 'Time', values: ['15-20 Days', '10-15 Days', '15-20 Days']),
      ],
      compliances: [
        ComplianceItem(name: 'Income Tax Return', due: '30th Sep', type: 'Annual'),
        ComplianceItem(name: 'AOC-4 & MGT-7', due: 'Oct/Nov', type: 'Annual'),
      ],
    ),

    'Nidhi Company Registration': ServiceContent(
      id: 'nidhi',
      title: 'Nidhi Company',
      subtitle: 'Registration',
      description: 'Launch a safe and improved lending business. No RBI License needed. Accept deposits and lend to members with complete legal compliance.',
      heroImage: 'https://images.unsplash.com/photo-1579621970795-87f9ac75eb1e?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Fast Track': '15-20 Days',
        'Compliance': 'MCA Regulated',
      },
      plans: [
        PricingPlan(
          name: 'Starter',
          price: '₹14,999',
          originalPrice: '₹25,000',
          features: [
            '3 DSC & 3 DIN',
            'Name Approval',
            'MOA & AOA Drafting',
            'Certificate of Incorporation',
            'PAN & TAN Allotment',
            'Bank Account Support'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Growth',
          price: '₹19,999',
          originalPrice: '₹35,000',
          features: [
            'Everything in Starter',
            'Loan Agreement Formats',
            'Membership Forms',
            'FD/RD Bond Certificates',
            'Loan Calculator Sheet',
            'Nidhi Rules Consultation'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Banker',
          price: '₹29,999',
          originalPrice: '₹50,000',
          features: [
            'Everything in Growth',
            'NDH-4 Filing Filing',
            'NDH-1 (Return) Support',
            'Nidhi Software (3 Months)',
            'Branch Opening Guidance',
            'Dedicated CA Support'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'What is a Nidhi Company?',
      overviewContent: 'A Nidhi Company is an NBFC (Non-Banking Financial Company) that is exempted from RBI license requirements. It is formed to cultivate the habit of thrift and savings among its members.\\n\\nIt is the easiest way to start a finance business in India where you can accept deposits and lend money against gold, property, or government bonds to your members.',
      benefits: [
        BenefitItem(title: 'No RBI License', description: 'Exempted from strict RBI regulations.', icon: Icons.shield_rounded),
        BenefitItem(title: 'Low Capital', description: 'Start with ₹5 Lakhs capital.', icon: Icons.monetization_on_rounded),
        BenefitItem(title: 'Accept Deposits', description: 'Legally accept FD, RD from members.', icon: Icons.trending_up_rounded),
        BenefitItem(title: 'Secured Lending', description: 'Low risk lending against Gold/Property.', icon: Icons.lock_rounded),
      ],
      whoShouldRegister: [
        'Local Lenders',
        'Finance Professionals',
        'Community Groups',
        'Gold Loan Biz'
      ],
      process: [
        ProcessStep(title: 'DSC & DIN', days: 'Day 1-3', description: 'DSC for 3 Directors.'),
        ProcessStep(title: 'Name Approval', days: 'Day 3-5', description: 'Reserving name with "Nidhi Limited".'),
        ProcessStep(title: 'Incorporation', days: 'Day 5-10', description: 'Drafting MOA/AOA and filing SPICe+.'),
        ProcessStep(title: 'Approval', days: 'Day 15-20', description: 'Get COI, PAN, TAN.'),
      ],
      faqs: [
        FaqItem(q: 'Do we need RBI license?', a: 'No, Nidhi is exempt from core RBI Act.'),
        FaqItem(q: 'Can we open branches?', a: 'Yes, up to 3 branches in district after 3 years profit.'),
        FaqItem(q: 'Public deposits?', a: 'No, only from members.'),
      ],
      requiredDocuments: [
        'PAN & Aadhaar (3 Directors)',
        'Voter ID / Passport',
        'Bank Statement',
        'Electricity Bill',
        'NOC from Owner'
      ],
      comparisonColumns: ['Nidhi Company', 'NBFC (Full)'],
      comparisons: [
        ComparisonItem(feature: 'RBI License', values: ['Exempt', 'Mandatory']),
        ComparisonItem(feature: 'Min Capital', values: ['₹5 Lakhs', '₹2 Crores']),
        ComparisonItem(feature: 'Public Deposits', values: ['Members Only', 'Allowed']),
        ComparisonItem(feature: 'Time', values: ['15-20 Days', '4-6 Months']),
      ],
      compliances: [
        ComplianceItem(name: 'NDH-4 (Status)', due: 'Within 1 Yr', type: 'Exemption'),
        ComplianceItem(name: 'NDH-1 (Return)', due: 'Annual', type: 'Annual'),
        ComplianceItem(name: 'NDH-3 (Half Year)', due: 'Half Yearly', type: 'Recurring'),
      ],
    ),

    'Producer Company Registration': ServiceContent(
      id: 'producer',
      title: 'Producer Company',
      subtitle: 'Registration',
      description: 'Unite for better profits. Establish a Farmer Producer Organization (FPO) to gain direct market access, government subsidies, and easy bank loans.',
      heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Growth': 'Scale Up',
        'Support': 'NABARD',
      },
      plans: [
        PricingPlan(
          name: 'Seeds',
          price: '₹14,999',
          originalPrice: '₹25,000',
          features: [
            'Name Approval (RUN)',
            'Incorporation (SPICe+)',
            'Pro-Object MoA/AoA',
            'PAN & TAN Allotment',
            'e-Share Cert Format'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Harvest',
          price: '₹24,999',
          originalPrice: '₹35,000',
          features: [
            'Everything in Seeds',
            '5 DSC & 5 DIN Acquisition',
            'Board Resolution Dossier',
            'Farmer Registry Format',
            'NABARD Support Docs',
            'Bank Account Support'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Bounty',
          price: '₹39,999',
          originalPrice: '₹55,000',
          features: [
            'Everything in Harvest',
            'MSME/Udyam Registration',
            '1-Year Compliance Radar',
            'NABARD Subsidy Guide',
            'Audit Prep Module',
            'Legal Advisory (2 Hrs)'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'What is a Producer Company?',
      overviewContent: 'A Producer Company is a hybrid legal entity that combines the efficiency of a Private Limited Company with the cooperative spirit of a Society. It allows primary producers (farmers, artisans) to come together to improve their income.\\n\\nIt is the easiest way to start a finance business in India where you can accept deposits and lend money against gold, property, or government bonds to your members.',
      benefits: [
        BenefitItem(title: 'Collective Bargaining', description: 'Negotiate better prices.', icon: Icons.groups_rounded),
        BenefitItem(title: 'Limited Liability', description: 'Assets safe, liability limited to shares.', icon: Icons.shield_rounded),
        BenefitItem(title: 'NABARD Support', description: 'Access to grants and subsidies.', icon: Icons.account_balance_rounded),
        BenefitItem(title: 'Tax Exemptions', description: '100% tax exempt Ag income.', icon: Icons.bolt_rounded),
      ],
      whoShouldRegister: [
        'Farmers Groups',
        'Artisans',
        'Fisherfolk',
        'Self Help Groups'
      ],
      process: [
        ProcessStep(title: 'DSC (5 Directors)', days: 'Day 1-3', description: 'Class-3 DSC for directors.'),
        ProcessStep(title: 'Name Reservation', days: 'Day 3-5', description: 'Unique name with "Producer Company Ltd".'),
        ProcessStep(title: 'Incorporation', days: 'Day 5-10', description: 'Filing SPICe+ with MoA/AoA.'),
        ProcessStep(title: 'Approval', days: 'Day 10-15', description: 'COI, PAN, TAN issued.'),
      ],
      faqs: [
        FaqItem(q: 'Who can be member?', a: 'Primary Producers (Farmers, Artisans).'),
        FaqItem(q: 'Min Directors?', a: 'Min 5 Directors and 10 Members.'),
        FaqItem(q: 'Min Capital?', a: '₹5 Lakhs paid-up capital.'),
      ],
      requiredDocuments: [
        'PAN & Aadhaar (5 Directors)',
        '7/12 Extract (Farmer Proof)',
        'Bank Statement',
        'Electricity Bill',
        'NOC from Owner'
      ],
      comparisonColumns: ['Producer Co.', 'Coop. Society'],
      comparisons: [
        ComparisonItem(feature: 'Area of Operation', values: ['Complete India', 'District/State']),
        ComparisonItem(feature: 'Professionalism', values: ['High', 'Low']),
        ComparisonItem(feature: 'Political Interference', values: ['None', 'High']),
      ],
      compliances: [
        ComplianceItem(name: 'Annual General Meeting', due: 'Sep 30', type: 'Annual'),
        ComplianceItem(name: 'Annual Return', due: '60 days of AGM', type: 'Annual'),
      ],
    ),

    'Public Limited Company': ServiceContent(
      id: 'public-limited',
      title: 'Public Limited',
      subtitle: 'Company',
      description: 'The highest form of corporate structure. Raise capital from the General Public, list on the Stock Exchange, and build a global brand.',
      heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Growth': 'IPO Ready',
        'Scale': 'Global',
      },
      plans: [
        PricingPlan(
          name: 'Core',
          price: '₹19,999',
          originalPrice: '₹30,000',
          features: [
            'Name Approval (RUN)',
            'Incorporation (SPICe+)',
            'MOA & AOA Drafting',
            'PAN & TAN Allotment',
            'Certificate of Incorporation'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Corporate',
          price: '₹34,999',
          originalPrice: '₹50,000',
          features: [
            'Everything in Core',
            '3 DSC & 3 DIN',
            'Share Certificates',
            'Board Resolutions',
            'Checklist for 1st Board Meeting',
            'Bank Account Support'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Ultimate',
          price: '₹59,999',
          originalPrice: '₹80,000',
          features: [
            'Everything in Corporate',
            'Commencement of Business (INC-20A)',
            'Auditor Appointment (ADT-1)',
            'GST Registration',
            'Trademark Search & Filing',
            'Dedicated Compliance Manager'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'What is a Public Limited Company?',
      overviewContent: 'A Public Limited Company is a company whose shares can be sold to the general public. It offers the highest level of transparency and is ideal for businesses that have a large scale of operations and require huge capital investment. It is the only structure that allows raising funds through IPO.',
      benefits: [
        BenefitItem(title: 'Raise Capital', description: 'Issue shares to public via IPO.', icon: Icons.trending_up_rounded),
        BenefitItem(title: 'Credibility', description: 'Highest trust and strict compliance.', icon: Icons.star_rounded),
        BenefitItem(title: 'Limited Liability', description: 'Shareholders liable only for unpaid shares.', icon: Icons.shield_rounded),
        BenefitItem(title: 'Transferable Shares', description: 'Easily transferable shares (Liquidity).', icon: Icons.compare_arrows_rounded),
      ],
      whoShouldRegister: [
        'Large Scale Biz',
        'Manufacturing',
        'Infra Projects',
        'Companies planning IPO'
      ],
      process: [
        ProcessStep(title: 'DSC & DIN', days: 'Day 1-3', description: 'DSC for 3 Directors.'),
        ProcessStep(title: 'Name Approval', days: 'Day 3-5', description: 'Check availability and apply via RUN.'),
        ProcessStep(title: 'Document Drafting', days: 'Day 5-8', description: 'Drafting MOA and AOA.'),
        ProcessStep(title: 'Incorporation', days: 'Day 8-12', description: 'Filing SPICe+ and getting COI.'),
      ],
      faqs: [
        FaqItem(q: 'Min members?', a: 'Minimum 7 members and 3 directors.'),
        FaqItem(q: 'Min Capital?', a: 'No minimum paid-up capital requirement.'),
        FaqItem(q: 'Startups?', a: 'Usually prefer Pvt Ltd first.'),
      ],
      requiredDocuments: [
        'PAN & Aadhaar (3 Directors)',
        'Voter ID / Passport',
        'Bank Statement (6 Months)',
        'Electricity Bill',
        'Rent Agreement & NOC'
      ],
      comparisonColumns: ['Public Limited', 'Private Limited'],
      comparisons: [
        ComparisonItem(feature: 'Min Members', values: ['7', '2']),
        ComparisonItem(feature: 'Min Directors', values: ['3', '2']),
        ComparisonItem(feature: 'Public Offer', values: ['Allowed', 'Prohibited']),
      ],
      compliances: [
        ComplianceItem(name: 'Financial Statements', due: 'Annual', type: 'High'),
        ComplianceItem(name: 'Secretarial Audit', due: 'Annual', type: 'High'),
      ],
    ),
    
    // Dynamic Generator for ~50 services to avoid massive file size
    'default': ServiceContent(
      id: 'generic',
      title: 'Business Service',
      subtitle: 'Registration & Licensing',
      description: 'Professional filing service for your business needs. Fast, secure, and fully online.',
      heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070',
      stats: {'Duration': 'Varies', 'Support': '24/7'},
      plans: [
        PricingPlan(
          name: 'Standard',
          price: '₹4,999',
          originalPrice: '₹8,000',
          features: ['Document Review', 'Application Filing', 'Status Tracking', 'Support'],
          isPopular: true,
          color: const Color(0xFF10232A),
        )
      ],
      overviewTitle: 'About this Service',
      overviewContent: 'We provide end-to-end support for this business service, ensuring comlpete compliance and peace of mind.',
      benefits: [
        BenefitItem(title: 'Expert Support', description: 'Guided by professionals.', icon: Icons.verified_user_rounded),
        BenefitItem(title: 'Online Process', description: 'No physical visits needed.', icon: Icons.laptop_mac_rounded),
      ],
      whoShouldRegister: ['Any Business Entity', 'Individuals'],
      process: [
        ProcessStep(title: 'Submit Documents', days: 'Day 1', description: 'Upload required documents.'),
        ProcessStep(title: 'Processing', days: 'Day 2-5', description: 'We process your application.'),
        ProcessStep(title: 'Approval', days: 'Final', description: 'Receive your certificate.'),
      ],
      faqs: [
        FaqItem(q: 'Is this process online?', a: 'Yes, completely online.'),
      ],
      requiredDocuments: ['Identity Proof', 'Address Proof']
    ),
    'MSME / Udyam Registration': ServiceContent(
      id: 'msme',
      title: 'MSME / Udyam',
      subtitle: 'Registration',
      description: 'Get official recognition for your business. Unlock Subsidy Benefits, Low-Interest Loans, and Protection against Delayed Payments.',
      heroImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Validity': 'Lifetime',
        'Processing': '24 Hours',
      },
      plans: [
        PricingPlan(
          name: 'Basic',
          price: '₹999',
          originalPrice: '₹1,500',
          features: [
            'Udyam Certificate',
            'Lifetime Validity',
            'Digital Copy',
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Udyam Pro',
          price: '₹1,499',
          originalPrice: '₹2,500',
          features: [
            'Everything in Basic',
            'MSME Databank Profile',
            'GeM Portal Registration',
            'TReDS Registration',
            'Priority Support'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
      ],
      overviewTitle: 'What is Udyam Registration?',
      overviewContent: 'Udyam Registration is the official recognition for Micro, Small, and Medium Enterprises (MSMEs) in India. It is a completely digital process with no requirement for paper upload.\\n\\nRegistered MSMEs enjoy various incentives from the government, including priority sector lending, lower interest rates on bank loans, excise exemption scheme, and protection against delayed payments.',
      benefits: [
        BenefitItem(title: 'Collateral Free Loans', description: 'Access to loans under CGTMSE.', icon: Icons.credit_card_rounded),
        BenefitItem(title: 'Subsidy on IP', description: '50% subsidy on Patent/Trademark fees.', icon: Icons.shield_rounded),
        BenefitItem(title: 'Interest Rate Exemption', description: '1% exemption on OD interest.', icon: Icons.percent_rounded),
        BenefitItem(title: 'Payment Protection', description: 'Protection against delayed payments.', icon: Icons.timer_rounded),
      ],
      whoShouldRegister: ['Micro Enterprises', 'Small Businesses', 'Manufacturers', 'Service Providers'],
      process: [
        ProcessStep(title: 'Aadhaar Verification', days: 'Instant', description: 'OTP verification using Aadhaar.'),
        ProcessStep(title: 'Business Details', days: '10 Mins', description: 'Entering business & bank details.'),
        ProcessStep(title: 'Certificate', days: '24-48 Hrs', description: 'Govt validation and certificate issue.'),
      ],
      faqs: [
        FaqItem(q: 'Is Aadhaar mandatory?', a: 'Yes, Aadhaar of the owner/partner/director is mandatory.'),
        FaqItem(q: 'Validity of certificate?', a: 'Udyam Registration is valid for a lifetime.'),
        FaqItem(q: 'Do I need to renew?', a: 'No renewal is required, but details must be updated annually.'),
      ],
      requiredDocuments: ['Aadhaar Card', 'PAN Card', 'GST Number (if any)', 'Bank Details'],
    ),

    'ISO Certification (9001 / 14001 / 27001)': ServiceContent(
      id: 'iso',
      title: 'ISO Certification',
      subtitle: '9001 / 14001 / 27001',
      description: 'Build trust and credibility with ISO certification. Demonstrate your commitment to quality, environment, and security.',
      heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071',
      stats: {
        'Quality': 'Assured',
        'Recognition': 'Global',
      },
      plans: [
        PricingPlan(
          name: 'Essential',
          price: '₹1,499',
          originalPrice: '₹3,000',
          features: [
            'ISO 9001:2015',
            'Non-IAF Certificate',
            'Digital Copy',
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Professional',
          price: '₹3,999',
          originalPrice: '₹7,000',
          features: [
            'ISO 9001:2015 (IAF)',
            'Global Acceptance',
            'Valid for Tenders',
            'Full Documentation'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Enterprise',
          price: '₹6,999',
          originalPrice: '₹12,000',
          features: [
            'ISO 9001 + 14001',
            'Integrated Audit',
            'Priority Support',
            'Consultant Included'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'Global Quality Standards',
      overviewContent: 'ISO certification is a seal of approval from a third-party body that a company runs to one of the international standards developed by ISO. It helps organizations improve their performance and demonstrate their commitment to quality.',
      benefits: [
        BenefitItem(title: 'Tender Eligibility', description: 'Mandatory for most Govt tenders.', icon: Icons.description_rounded),
        BenefitItem(title: 'Global Recognition', description: 'Enhances brand trust globally.', icon: Icons.public_rounded),
        BenefitItem(title: 'Efficiency', description: 'Standardized processes reduce errors.', icon: Icons.settings_rounded),
        BenefitItem(title: 'Marketing Edge', description: 'Use ISO mark on products.', icon: Icons.star_rounded),
      ],
      whoShouldRegister: ['Manufacturers', 'Service Companies', 'Exporters', 'Contractors'],
      process: [
        ProcessStep(title: 'Application', days: 'Day 1', description: 'Standard selection & consulting.'),
        ProcessStep(title: 'Documentation', days: 'Day 2-3', description: 'Drafting SOPs and Manuals.'),
        ProcessStep(title: 'Audit', days: 'Day 4-5', description: 'Remote or Physical Audit.'),
        ProcessStep(title: 'Certification', days: 'Day 6+', description: 'Issuance of Certificate.'),
      ],
      faqs: [
        FaqItem(q: 'IAF vs Non-IAF?', a: 'IAF is globally recognized for tenders. Non-IAF is for branding.'),
        FaqItem(q: 'Validity period?', a: 'Valid for 3 years with annual surveillance.'),
      ],
      requiredDocuments: ['Business Registration', 'Letterhead', 'Invoice Copy', 'Scope of Work'],
    ),

    'Startup India Registration': ServiceContent(
      id: 'startup-india',
      title: 'Startup India',
      subtitle: 'Recognition',
      description: 'Unlock 3-Year Tax Holidays, Angel Tax Exemption, and Govt Funding Support for your high-growth startup.',
      heroImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Tax Benefit': '3 Years',
        'Funding': 'Access',
      },
      plans: [
        PricingPlan(
          name: 'Basic',
          price: '₹4,999',
          originalPrice: '₹8,000',
          features: [
            'DPIIT Certificate',
            'Startup India Profile',
            'IPR Benefits Access',
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Standard',
          price: '₹9,999',
          originalPrice: '₹15,000',
          features: [
            'Everything in Basic',
            'Professional Pitch Deck',
            'Business Model Review',
            '10 Slides Presentation'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Premium',
          price: '₹14,999',
          originalPrice: '₹25,000',
          features: [
            'DPIIT Recognition',
            '80-IAC Application',
            'Angel Tax Exemption',
            'IMB Query Support'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'DPIIT Recognition',
      overviewContent: 'Startup India is a flagship initiative of the Government of India. Recognition by DPIIT allows startups to avail tax benefits, easier compliance, and IPR fast-tracking. It is the first step towards availing the 3-year Income Tax Holiday.',
      benefits: [
        BenefitItem(title: 'Income Tax Exemption', description: '3 years tax holiday (80-IAC).', icon: Icons.money_off_rounded),
        BenefitItem(title: 'Angel Tax Exemption', description: 'Exemption u/s 56(2)(viib).', icon: Icons.trending_up_rounded),
        BenefitItem(title: 'IPR Benefits', description: '80% rebate on Patent fees.', icon: Icons.lightbulb_rounded),
        BenefitItem(title: 'Easy Compliance', description: 'Self-certification allowed.', icon: Icons.check_circle_rounded),
      ],
      whoShouldRegister: ['Pvt Ltd Companies', 'LLPs', 'Registered Partnerships', '< 10 Years Old'],
      process: [
        ProcessStep(title: 'Profile Creation', days: 'Day 1', description: 'Startup India portal registration.'),
        ProcessStep(title: 'Pitch Deck', days: 'Day 2-3', description: 'Drafting innovation pitch deck.'),
        ProcessStep(title: 'Application', days: 'Day 4', description: 'Submission with documents.'),
        ProcessStep(title: 'Recognition', days: 'Day 5-7', description: 'Receipt of DPIIT Certificate.'),
      ],
      faqs: [
        FaqItem(q: 'Who is eligible?', a: 'Entity < 10 years old, turnover < 100 Cr, innovative model.'),
        FaqItem(q: 'Is Pitch Deck mandatory?', a: 'Yes, describing innovation is mandatory.'),
      ],
      requiredDocuments: ['Incorporation Cert', 'MOA/AOA', 'Directors KYC', 'Pitch Deck', 'Product Video'],
    ),

    'Digital Signature Certificate (DSC)': ServiceContent(
      id: 'dsc',
      title: 'Digital Signature',
      subtitle: 'Certificate (DSC)',
      description: 'Get your Paperless Class 3 DSC in 30 minutes. Mandatory for MCA, GST, Income Tax, and e-Tendering.',
      heroImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Security': 'Class 3',
        'Token': 'Included',
      },
      plans: [
        PricingPlan(
          name: 'Standard',
          price: '₹1,999',
          originalPrice: '₹3,000',
          features: [
            'Class 3 Signing + Encryption',
            'Validity: 2 Years',
            'USB Token Included',
            'Free Home Delivery'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Plus',
          price: '₹2,999',
          originalPrice: '₹4,500',
          features: [
            'Everything in Standard',
            'Validity: 3 Years',
            'Priority Dispatch',
            'Video KYC Support'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'DGFT',
          price: '₹4,999',
          originalPrice: '₹7,000',
          features: [
            'DGFT Digital Signature',
            'For Import/Export (IEC)',
            'Validity: 2 Years',
            'USB Token Included'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'Class 3 DSC',
      overviewContent: 'A Digital Signature Certificate (DSC) is the digital equivalent of a physical signature. Class 3 DSC is the highest level of security and is mandatory for e-filing on MCA, GST, and Income Tax portals.',
      benefits: [
        BenefitItem(title: 'Legal Compliance', description: 'Mandatory for company filings.', icon: Icons.gavel_rounded),
        BenefitItem(title: 'High Security', description: 'Encryption ensures data safety.', icon: Icons.lock_rounded),
        BenefitItem(title: 'Paperless', description: 'Sign documents digitally.', icon: Icons.edit_document),
        BenefitItem(title: 'e-Tendering', description: 'Required for Govt tenders.', icon: Icons.account_balance_rounded),
      ],
      whoShouldRegister: ['Directors', 'Authorized Signatories', 'Tax Practitioners', 'Contractors'],
      process: [
        ProcessStep(title: 'Order', days: 'Mins', description: 'Select plan & pay.'),
        ProcessStep(title: 'e-KYC', days: '10 Mins', description: 'Aadhaar/PAN based KYC.'),
        ProcessStep(title: 'Video Recording', days: '30 Sec', description: 'Short verification video.'),
        ProcessStep(title: 'Dispatch', days: '1 Hour', description: 'Token dispatched same day.'),
      ],
      faqs: [
        FaqItem(q: 'Is USB Token included?', a: 'Yes, FIPS certified token is included.'),
        FaqItem(q: 'Total time taken?', a: 'Processing in 30 mins, delivery depends on courier.'),
      ],
      requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Photo', 'Mobile & Email'],
    ),

    'Barcode / GS1 Registration': ServiceContent(
      id: 'barcode',
      title: 'GS1 Barcode',
      subtitle: 'Registration',
      description: 'Get valid EAN-13 / UPC Barcodes for Amazon, Flipkart, & Retail. Secure your Global Company Prefix (GCP) today.',
      heroImage: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=2074',
      stats: {
        'Format': 'EAN-13',
        'Accepted': 'Global',
      },
      plans: [
        PricingPlan(
          name: 'Consultation',
          price: '₹2,499',
          originalPrice: '₹5,000',
          features: [
            'Turnover Analysis',
            'Fee Calculation',
            'Document Review',
            'Application Filing'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Registration',
          price: '₹44,999',
          originalPrice: '₹50,000',
          features: [
            'New Registration',
            '100 GTINs Allocation',
            '10 Years Validity',
            'DataKart Access'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
      ],
      overviewTitle: 'GS1 India Registration',
      overviewContent: 'GS1 barcodes are the only globally recognized product identifiers (GTIN). They are mandatory for selling on large retail chains and online marketplaces like Amazon and Flipkart.',
      benefits: [
        BenefitItem(title: 'Retail Mandate', description: 'Accepted by all major retailers.', icon: Icons.shopping_cart_rounded),
        BenefitItem(title: 'Online Sales', description: 'Mandatory for Amazon/Flipkart.', icon: Icons.language_rounded),
        BenefitItem(title: 'Global Trade', description: 'Valid in 150+ countries.', icon: Icons.public_rounded),
        BenefitItem(title: 'Inventory', description: 'Better stock management.', icon: Icons.inventory_2_rounded),
      ],
      whoShouldRegister: ['Manufacturers', 'Importers', 'E-commerce Sellers', 'Brand Owners'],
      process: [
        ProcessStep(title: 'Analysis', days: 'Day 1', description: 'Turnover & Slab analysis.'),
        ProcessStep(title: 'Application', days: 'Day 2', description: 'Filing on GS1 portal.'),
        ProcessStep(title: 'Payment', days: 'Day 3', description: 'Govt fee payment.'),
        ProcessStep(title: 'Allocation', days: 'Day 5-7', description: 'GCP & Barcode allocation.'),
      ],
      faqs: [
        FaqItem(q: 'Can I buy cheap barcodes?', a: 'No, they are often fake/rejected. Only GS1 is valid.'),
        FaqItem(q: 'How many do I need?', a: '1 barcode per product variant (Size/Color).'),
      ],
      requiredDocuments: ['GST/MSME Cert', 'Balance Sheet', 'PAN Card', 'Cancelled Cheque'],
    ),
    
    'PAN Application': ServiceContent(
      id: 'pan',
      title: 'PAN Application',
      subtitle: 'New / Correction',
      description: 'Apply for a new Permanent Account Number (PAN) or correct existing details. Essential for all financial transactions.',
      heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Type': 'ID Proof',
        'Mandatory': 'Tax',
      },
      plans: [
        PricingPlan(
          name: 'Standard',
          price: '₹299',
          originalPrice: '₹500',
          features: ['New Application', 'Data Entry', 'Hard Copy Dispatch'],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Assisted',
          price: '₹499',
          originalPrice: '₹1000',
          features: ['Everything in Standard', 'Correction/Update', 'Document Verification', 'Priority Support'],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
      ],
      overviewTitle: 'Permanent Account Number',
      overviewContent: 'PAN is a ten-digit alphanumeric number, issued in the form of a laminated card, by the Income Tax Department, to any "person" who applies for it or to whom the department allots the number.',
      benefits: [
        BenefitItem(title: 'Identity Proof', description: 'Valid Govt ID proof.', icon: Icons.badge_rounded),
        BenefitItem(title: 'Financial Txns', description: 'Mandatory for high value txns.', icon: Icons.currency_rupee_rounded),
        BenefitItem(title: 'Business', description: 'Required for Business Reg.', icon: Icons.business_rounded),
        BenefitItem(title: 'ITR Filing', description: 'Essential for Tax Returns.', icon: Icons.receipt_long_rounded),
      ],
      whoShouldRegister: ['Individuals', 'Companies', 'Partnerships', 'Trusts'],
      process: [
        ProcessStep(title: 'Application', days: 'Day 1', description: 'Form 49A filling.'),
        ProcessStep(title: 'Processing', days: 'Day 3-5', description: 'Verification by NSDL/UTIITSL.'),
        ProcessStep(title: 'Dispatch', days: 'Day 10-15', description: 'Physical card delivery.'),
      ],
      faqs: [
        FaqItem(q: 'Is physical card sent?', a: 'Yes, to the address mentioned in Adhaar/Proof.'),
        FaqItem(q: 'Documents needed?', a: 'Aadhaar is usually sufficient for Individuals.'),
      ],
      requiredDocuments: ['Aadhaar Card', 'Passport Photo', 'Signature'],
    ),

    'TAN Application': ServiceContent(
      id: 'tan',
      title: 'TAN Application',
      subtitle: 'Allocation',
      description: 'Obtain Tax Deduction and Collection Account Number (TAN). Mandatory for businesses deducting TDS.',
      heroImage: 'https://images.unsplash.com/photo-1554224154-260312cb2957?auto=format&fit=crop&q=80&w=2072',
      stats: {
        'Type': 'Tax ID',
        'Mandatory': 'TDS',
      },
      plans: [
        PricingPlan(
          name: 'Standard',
          price: '₹999',
          originalPrice: '₹1,500',
          features: ['Form 49B Filling', 'Govt Fee Included', 'Acknowledgement Receipt'],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
      ],
      overviewTitle: 'About TAN',
      overviewContent: 'TAN or Tax Deduction and Collection Account Number is a 10-digit alpha-numeric number required to be obtained by all persons who are responsible for deducting or collecting tax. It is mandatory to quote TAN in all TDS/TCS returns.',
      benefits: [
        BenefitItem(title: 'TDS Compliance', description: 'Mandatory for deducting tax.', icon: Icons.rule_rounded),
        BenefitItem(title: 'Avoid Penalty', description: 'Penalty for not quoting TAN.', icon: Icons.warning_rounded),
        BenefitItem(title: 'Centralized', description: 'Linked to TRACES portal.', icon: Icons.link_rounded),
      ],
      whoShouldRegister: ['Companies', 'LLPs', 'Employers', 'Deductors'],
      process: [
        ProcessStep(title: 'Application', days: 'Day 1', description: 'Online Form 49B.'),
        ProcessStep(title: 'Verification', days: 'Day 2-3', description: 'Validation by dept.'),
        ProcessStep(title: 'Allotment', days: 'Day 5-7', description: 'TAN Letter dispatch.'),
      ],
      faqs: [
        FaqItem(q: 'Who needs TAN?', a: 'Anyone liable to deduct TDS.'),
        FaqItem(q: 'Is it different from PAN?', a: 'Yes, PAN is for income, TAN is for deduction.'),
      ],
      requiredDocuments: ['Entity PAN', 'Address Proof', 'Incorporation Cert'],
    ),

    'Limited Liability Partnership (LLP) Registration': ServiceContent(
      id: 'llp-registration',
      title: 'Limited Liability Partnership',
      subtitle: '(LLP) Registration',
      description: 'The ultimate balance of Flexible Partnership and Limited Liability. Perfect for professional firms and startups.',
      heroImage: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Turnaround': '10-15 Days',
        'Ideal For': 'Service Firms',
      },
      plans: [
        PricingPlan(
          name: 'Startup',
          price: '₹4,999',
          originalPrice: '₹8,000',
          features: [
            '2 DSC & 2 DPIN',
            'Name Approval',
            'Certificate of Incorporation',
            'PAN & TAN Allotment',
            'Partner KYC'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Growth',
          price: '₹8,999',
          originalPrice: '₹16,000',
          features: [
            'Everything in Startup',
            'LLP Agreement (Form 3)',
            'Stamp Paper Assistance',
            'Business Bank Account Support',
            'Accounting Software (1 Year)',
            'Dedicated Manager'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Elite',
          price: '₹12,499',
          originalPrice: '₹24,000',
          features: [
            'Everything in Growth',
            'GST Registration',
            'MSME/Udyam Registration',
            'Trademark Filing (1 Class)',
            'Domain + Email (1 Yr)',
            'Zero Balance Current A/c'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'What is an LLP?',
      overviewContent: 'A Limited Liability Partnership (LLP) is a modern business structure that provides the benefits of limited liability to its partners while maintaining the flexibility of a traditional partnership. It is governed by the Limited Liability Partnership Act, 2008.\\n\\nUnlike a standard partnership firm where partners have unlimited liability, in an LLP, the partners are not personally liable for the firm debts. This makes it a safe option for small businesses.',
      benefits: [
        BenefitItem(title: 'Limited Liability', description: 'Partners are not personally liable.', icon: Icons.shield_rounded),
        BenefitItem(title: 'No Dividend Tax', description: 'No Dividend Distribution Tax (DDT).', icon: Icons.trending_up_rounded),
        BenefitItem(title: 'Low Compliance', description: 'Audit not required for small firms.', icon: Icons.check_circle_outline_rounded),
        BenefitItem(title: 'Separate Legal Entity', description: 'Distinct identity from partners.', icon: Icons.business_center_rounded),
      ],
      whoShouldRegister: ['Professional Firms', 'Consultancy Business', 'Small Agencies', 'Software Consultants'],
      process: [
        ProcessStep(title: 'DSC & DPIN', days: 'Day 1-3', description: 'Digital Signature & DIN Application.'),
        ProcessStep(title: 'Name Reservation', days: 'Day 3-5', description: 'RUN-LLP Filing for Name Approval.'),
        ProcessStep(title: 'Incorporation', days: 'Day 5-10', description: 'FiLLiP Form Filing & Approval.'),
        ProcessStep(title: 'LLP Agreement', days: 'Post-Reg', description: 'Drafting & Filing Form 3 (Crucial).'),
      ],
      faqs: [
        FaqItem(q: 'How many partners?', a: 'Minimum 2 partners are required. No upper limit.'),
        FaqItem(q: 'Is audit mandatory?', a: 'Only if turnover > ₹40 Lakhs or contribution > ₹25 Lakhs.'),
        FaqItem(q: 'Time taken?', a: 'Typically 10-15 business days.'),
      ],
      requiredDocuments: ['Identity Proof (PAN)', 'Address Proof (Aadhaar/Voter)', 'Bank Statement', 'Utility Bill', 'NOC'],
    ),

    'One Person Company (OPC) Registration': ServiceContent(
      id: 'opc-registration',
      title: 'One Person Company',
      subtitle: '(OPC) Registration',
      description: 'The perfect start for the solo entrepreneur. Get Limited Liability protection with 100% control over your business.',
      heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Turnaround': '7-10 Days',
        'Ownership': '100%',
      },
      plans: [
        PricingPlan(
          name: 'Startup',
          price: '₹4,999',
          originalPrice: '₹8,000',
          features: [
            '1 DSC & 1 DIN',
            'Name Approval',
            'MOA & AOA Drafting',
            'Certificate of Incorporation',
            'PAN & TAN Allotment',
            'Nominee Consent Filing'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Growth',
          price: '₹8,999',
          originalPrice: '₹16,000',
          features: [
            'Everything in Startup',
            'Nominee Consent Filing',
            'Digital Share Certificate',
            'Business Bank Account Support',
            'Compliance Tracker',
            'Dedicated Account Manager'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Elite',
          price: '₹12,999',
          originalPrice: '₹20,000',
          features: [
            'Everything in Growth',
            'GST Registration',
            'MSME/Udyam Registration',
            'First Board Resolutions',
            'Domain + Email (1 Yr)',
            'Zero Balance Current A/c'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'What is an OPC?',
      overviewContent: 'An One Person Company (OPC) is a revolutionary business structure that allows a single entrepreneur to operate a corporate entity with Limited Liability protection. It combines the benefits of a Sole Proprietorship (full control) with the legal standing of a Private Limited Company.',
      benefits: [
        BenefitItem(title: 'Limited Liability', description: 'Personal assets are safe.', icon: Icons.shield_rounded),
        BenefitItem(title: 'Complete Control', description: '100% control over decisions.', icon: Icons.person_rounded),
        BenefitItem(title: 'Separate Legal Entity', description: 'Can own property in its name.', icon: Icons.business_rounded),
        BenefitItem(title: 'Easy Banking', description: 'Preferred by banks for loans.', icon: Icons.account_balance_rounded),
      ],
      whoShouldRegister: ['Software Developers', 'Consultants', 'Content Creators', 'E-commerce Sellers'],
      process: [
        ProcessStep(title: 'DSC & Name', days: 'Day 1-2', description: 'DSC application & Name Reservation.'),
        ProcessStep(title: 'Incorporation', days: 'Day 3-5', description: 'SPICe+ Form Filing including Nominee.'),
        ProcessStep(title: 'Certificate', days: 'Day 6-8', description: 'Certificate of Incorporation Issue.'),
        ProcessStep(title: 'Bank & Compliance', days: 'Post-Reg', description: 'Bank Account & Compliance guidance.'),
      ],
      faqs: [
        FaqItem(q: 'Can I convert to Pvt Ltd?', a: 'Yes, voluntarily after 2 years or if threshold crossed.'),
        FaqItem(q: 'Is audit mandatory?', a: 'Yes, statutory audit is mandatory for OPC.'),
        FaqItem(q: 'Who is a Nominee?', a: 'Person who takes over in case of death/incapacity.'),
      ],
      requiredDocuments: ['Director PAN & Aadhaar', 'Nominee PAN & Aadhaar', 'Photos', 'Utility Bill', 'NOC'],
    ),

    'Partnership Firm Registration': ServiceContent(
      id: 'partnership-registration',
      title: 'Partnership Firm',
      subtitle: 'Registration',
      description: 'The classic way to build together. Simple Structure with Shared Growth. Ideal for family businesses and small teams.',
      heroImage: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Turnaround': '5-7 Days',
        'Type': 'Joint Venture',
      },
      plans: [
        PricingPlan(
          name: 'Lite',
          price: '₹2,999',
          originalPrice: '₹6,000',
          features: [
            'Custom Deed Drafting',
            'PAN Card Application',
            'Initial Legal Consulting',
            'Affidavit Preparation',
            'Bank Account Advisory'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Classic',
          price: '₹5,999',
          originalPrice: '₹12,000',
          features: [
            'Everything in Lite',
            'Registrar of Firms (ROF) Filing',
            'Registration Certificate',
            'TAN Allotment',
            'Priority Support',
            'Dedicated Manager'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Complete',
          price: '₹8,999',
          originalPrice: '₹18,000',
          features: [
            'Everything in Classic',
            'GST Registration',
            'MSME/Udyam Registration',
            'Shop & Establishment',
            'Logo & Invoice Design',
            'Zero Balance Current A/c'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'Understanding Partnership',
      overviewContent: 'A Partnership Firm is formed when two or more individuals come together to carry on a business and share its profits and losses. It is governed by a Partnership Deed which defines the terms. Registration with Registrar of Firms (ROF) is optional but recommended for legal rights.',
      benefits: [
        BenefitItem(title: 'Minimal Compliance', description: 'No annual MCA filings.', icon: Icons.check_circle_outline_rounded),
        BenefitItem(title: 'Cost Effective', description: 'Low formation cost.', icon: Icons.savings_rounded),
        BenefitItem(title: 'Shared Risk', description: 'Responsibility is shared.', icon: Icons.group_rounded),
        BenefitItem(title: 'Flexibility', description: 'Operate as per Deed terms.', icon: Icons.tune_rounded),
      ],
      whoShouldRegister: ['Family Businesses', 'Small Traders', 'Retail Shops', 'Home Businesses'],
      process: [
        ProcessStep(title: 'Name & Deed', days: 'Day 1-2', description: 'Name selection & Deed drafting.'),
        ProcessStep(title: 'Notarization', days: 'Day 3', description: 'Signing & Notarization of Deed.'),
        ProcessStep(title: 'PAN & TAN', days: 'Day 4-5', description: 'Application for Firm PAN/TAN.'),
        ProcessStep(title: 'ROF Filing', days: 'Day 6+', description: 'Filing with Registrar (Optional).'),
      ],
      faqs: [
        FaqItem(q: 'Is registration mandatory?', a: 'No, but recommended to sue third parties.'),
        FaqItem(q: 'Minimum partners?', a: 'Minimum 2 partners.'),
        FaqItem(q: 'Liability?', a: 'Unlimited joint and several liability.'),
      ],
      requiredDocuments: ['Partners PAN & Address Proof', 'Photos', 'Electricity Bill', 'Rent Agreement', 'NOC'],
    ),

    'Sole Proprietorship Registration': ServiceContent(
      id: 'proprietorship-registration',
      title: 'Sole Proprietorship',
      subtitle: 'Registration',
      description: 'The simplest way to start your business. 100% Control, Zero Complexity. Get your Trade License & GST in days.',
      heroImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Turnaround': '3-5 Days',
        'Compliance': 'Minimal',
      },
      plans: [
        PricingPlan(
          name: 'Startup',
          price: '₹1,999',
          originalPrice: '₹5,000',
          features: [
            'MSME / Udyam Registration',
            'Professional Tax Enrollment',
            'Expert Consultation (15 Mins)',
            'Bank Account Advisory'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Optimal',
          price: '₹4,999',
          originalPrice: '₹10,000',
          features: [
            'Everything in Startup',
            'GST Registration',
            'Official Business Proof',
            'Current Bank Account Support',
            'Invoicing Software (Free)',
            'Dedicated Manager'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Elite',
          price: '₹7,999',
          originalPrice: '₹16,000',
          features: [
            'Everything in Optimal',
            'Shop & Establishment License',
            'FSSAI Registration (If Food)',
            'Income Tax Filing (1st Year)',
            'Trademark Filing Assistance',
            'Priority Support'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'About Proprietorship',
      overviewContent: 'A Sole Proprietorship is the simplest form of business registration where the business is owned and managed by a single individual. It has no separate legal existence from its owner. It is established through tax registrations like GST or Udyam.',
      benefits: [
        BenefitItem(title: 'Easiest to Start', description: 'Start with just PAN & Aadhaar.', icon: Icons.rocket_launch_rounded),
        BenefitItem(title: 'Total Control', description: 'You are the only boss.', icon: Icons.person_add_rounded),
        BenefitItem(title: 'Minimal Compliance', description: 'Only annual ITR filing.', icon: Icons.check_circle_rounded),
        BenefitItem(title: 'Lower Taxes', description: 'Taxed at individual slab rates.', icon: Icons.percent_rounded),
      ],
      whoShouldRegister: ['Small Business Owners', 'Freelancers', 'Shopkeepers', 'Traders'],
      process: [
        ProcessStep(title: 'Documents', days: 'Day 1', description: 'Collection of KYC documents.'),
        ProcessStep(title: 'MSME', days: 'Day 2', description: 'Udyam Registration generation.'),
        ProcessStep(title: 'GST', days: 'Day 3-5', description: 'GST Application & Approval.'),
        ProcessStep(title: 'Ready', days: 'Day 6', description: 'Certificate receipt & Bank Open.'),
      ],
      faqs: [
        FaqItem(q: 'Is separate PAN needed?', a: 'No, Proprietorship uses owner PAN.'),
        FaqItem(q: 'Can I convert later?', a: 'Yes, easily convertible to other forms.'),
        FaqItem(q: 'Capital required?', a: 'No minimum capital required.'),
      ],
      requiredDocuments: ['Owner PAN & Aadhaar', 'Photo', 'Electricity Bill', 'Rent Agreement', 'Bank Passbook'],
    ),

    'GST Registration': ServiceContent(
      id: 'gst-registration',
      title: 'GST',
      subtitle: 'Registration',
      description: 'Get your GSTIN number online. Unlock Input Tax Credit, Legal Recognition, and sell on Amazon & Flipkart.',
      heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2070',
      stats: {
        'Turnaround': '3-7 Days',
        'Benefit': 'ITC',
      },
      plans: [
        PricingPlan(
          name: 'Basic',
          price: '₹999',
          originalPrice: '₹2,000',
          features: [
            'GST Registration',
            'Application Filing',
            'Return Filing (None)'
          ],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Standard',
          price: '₹1,499',
          originalPrice: '₹3,000',
          features: [
            'Everything in Basic',
            'Document Verification',
            'ARN Generation',
            'Certificate Download',
            'Expert Support'
          ],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
        PricingPlan(
          name: 'Premium',
          price: '₹2,999',
          originalPrice: '₹5,000',
          features: [
            'Everything in Standard',
            '3 Months Return Filing',
            'Invoicing Software',
            'Dedicated CA Support'
          ],
          color: Colors.white,
        ),
      ],
      overviewTitle: 'What is GST?',
      overviewContent: 'Goods and Services Tax (GST) is a unified indirect tax system in India. GST Registration is mandatory for businesses with turnover > ₹40 Lakhs (Goods) or ₹20 Lakhs (Services), and for inter-state sellers and E-commerce operators.',
      benefits: [
        BenefitItem(title: 'Legal Recognition', description: 'Recognized supplier status.', icon: Icons.verified_rounded),
        BenefitItem(title: 'Input Tax Credit', description: 'Claim credit on purchases.', icon: Icons.trending_up_rounded),
        BenefitItem(title: 'Inter-State Sales', description: 'Sell across India freely.', icon: Icons.local_shipping_rounded),
        BenefitItem(title: 'E-Commerce', description: 'Sell on Amazon/Flipkart.', icon: Icons.shopping_bag_rounded),
      ],
      whoShouldRegister: ['Turnover > Threshold', 'Inter-state Sellers', 'E-commerce Sellers', 'Casual Taxable Persons'],
      process: [
        ProcessStep(title: 'Docs Upload', days: 'Day 1', description: 'Verification of documents.'),
        ProcessStep(title: 'Application', days: 'Day 2', description: 'Filing on GST Portal.'),
        ProcessStep(title: 'ARN Gen', days: 'Day 3', description: 'Application Reference No generated.'),
        ProcessStep(title: 'Certificate', days: 'Day 4-7', description: 'GST Certificate Issued.'),
      ],
      faqs: [
        FaqItem(q: 'Is office proof needed?', a: 'Yes, electricity bill/NOC is mandatory.'),
        FaqItem(q: 'Penalty for non-reg?', a: '100% of tax due or ₹10,000 whichever higher.'),
        FaqItem(q: 'Can I register voluntarily?', a: 'Yes, beneficial for ITC claim.'),
      ],
      requiredDocuments: ['PAN & Aadhaar', 'Photo', 'Electricity Bill', 'Rent Agreement/NOC', 'Cancelled Cheque'],
    ),
  };

  static ServiceContent get(String serviceName) {
    // 1. Direct Match
    if (_data.containsKey(serviceName)) return _data[serviceName]!;
    
    // 2. Normalized Match (Remove ' Registration')
    String normalized = serviceName.replaceAll(' Registration', '');
    if (_data.containsKey(normalized)) return _data[normalized]!;

    // 3. Smart Keyword Match (Aliases)
    final lowerName = serviceName.toLowerCase();
    if (lowerName.contains('msme') || lowerName.contains('udyam')) return _data['MSME / Udyam Registration']!;
    if (lowerName.contains('iso') && lowerName.contains('certification')) return _data['ISO Certification (9001 / 14001 / 27001)']!;
    if (lowerName.contains('startup india')) return _data['Startup India Registration']!;
    if (lowerName.contains('digital signature') || lowerName.contains('dsc')) return _data['Digital Signature Certificate (DSC)']!;
    if ((lowerName.contains('barcode') || lowerName.contains('gs1')) && lowerName.contains('registration')) return _data['Barcode / GS1 Registration']!;
    if (lowerName.contains('pan application') || (lowerName.contains('pan') && lowerName.contains('card'))) return _data['PAN Application']!;
    if (lowerName.contains('tan application') || (lowerName.contains('tan') && lowerName.contains('number'))) return _data['TAN Application']!;

    // 4. Existing Fallback for Partial Match on removed "Registration"
    if (_data.containsKey(serviceName.replaceAll(' Registration', ''))) {
       return _data[serviceName.replaceAll(' Registration', '')]!;
    }

    // Dynamic Generator for ~50 services to avoid massive file size
    String description = 'Professional completion of your $serviceName. Fully online process with expert support.';
    String heroImage = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070';
    List<String> docs = ['Identity Proof', 'Address Proof'];
    String price = '₹2,999';

    // Tailor content based on keywords
    if (serviceName.contains('Registration')) {
      description = 'Complete your $serviceName hassle-free. We handle the paperwork, government filings, and approvals so you can start your business instantly.';
      heroImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070';
      price = '₹6,999';
    } else if (serviceName.contains('Return') || serviceName.contains('Filing')) {
      description = 'Timely filing of your $serviceName. Avoid penalties and notices with our expert-assisted tax filing services.';
      heroImage = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2070';
      price = '₹1,499';
      docs = ['Previous Return Copy', 'Bank Statement', 'Invoices'];
    } else if (serviceName.contains('License')) {
      description = 'Get your $serviceName approved efficiently. We ensure 100% compliance with local and central regulations.';
      heroImage = 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=2032';
      price = '₹4,999';
      docs = ['Premises Proof', 'NOC', 'ID Proof'];
    } else if (serviceName.contains('Trademark') || serviceName.contains('Patent') || serviceName.contains('Copyright')) {
      description = 'Protect your brand and innovation with $serviceName. Secure your Intellectual Property rights globally.';
      heroImage = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2070';
      price = '₹5,999';
      docs = ['Logo/Work Details', 'Applicant KYC', 'Signed POA'];
    }

    return ServiceContent(
      id: serviceName.toLowerCase().replaceAll(' ', '-'),
      title: serviceName,
      subtitle: serviceName.contains('Registration') ? 'Business Startup' : 'Professional Service',
      description: description,
      heroImage: heroImage,
      stats: {'Duration': '3 - 15 Days', 'Support': 'Dedicated Expert'},
      plans: [
        PricingPlan(
          name: 'Essential',
          price: price,
          originalPrice: '₹${(int.tryParse(price.replaceAll(RegExp(r'[^0-9]'), '')) ?? 2000) * 2}',
          features: ['Application Preparation', 'Expert Review', 'Govt Portal Filing', 'Status Tracking'],
          color: Colors.white,
        ),
        PricingPlan(
          name: 'Professional',
          price: '₹${((int.tryParse(price.replaceAll(RegExp(r'[^0-9]'), '')) ?? 2000) * 1.5).round()}',
          originalPrice: '₹${(int.tryParse(price.replaceAll(RegExp(r'[^0-9]'), '')) ?? 2000) * 3}',
          features: ['Everything in Essential', 'Priority Processing', 'Dedicated Manager', 'Post-Service Support'],
          isPopular: true,
          color: const Color(0xFF10232A),
        ),
      ],
      overviewTitle: 'Why Choose ShineFiling for $serviceName?',
      overviewContent: 'We make $serviceName simple, digital, and affordable. Our platform connects you with verify experts who ensure your application is accurate and compliant with the latest laws.',
      benefits: [
        BenefitItem(title: '100% Online', description: 'No physical presence needed.', icon: Icons.laptop_mac_rounded),
        BenefitItem(title: 'Expert Verified', description: 'Zero errors guaranteed.', icon: Icons.verified_user_rounded),
        BenefitItem(title: 'Fast Track', description: 'Priority submission support.', icon: Icons.rocket_launch_rounded),
        BenefitItem(title: 'Secure', description: 'Bank-grade data security.', icon: Icons.lock_rounded),
      ],
      whoShouldRegister: ['Startups', 'Small Businesses', 'Entrepreneurs'],
      process: [
        ProcessStep(title: 'Upload Docs', days: 'Day 1', description: 'Submit required details online.'),
        ProcessStep(title: 'Expert Review', days: 'Day 2-3', description: 'We verify and prepare drafts.'),
        ProcessStep(title: 'Filing', days: 'Day 4+', description: 'Submission to government portal.'),
      ],
      faqs: [
        FaqItem(q: 'Is this service fully online?', a: 'Yes, you can track everything from the app.'),
        FaqItem(q: 'Are government fees included?', a: 'The plan covers professional fees. Govt fees are actuals.'),
      ],
      requiredDocuments: docs,
    );
  }
}
