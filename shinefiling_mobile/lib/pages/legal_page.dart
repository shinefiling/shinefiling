import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class LegalPage extends StatelessWidget {
  final String title;
  final String content;

  const LegalPage({super.key, required this.title, required this.content});

  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  static const String privacyPolicyText = """
1. **Data Collection**: We collect personal details necessary for filing taxes and registrations, including PAN, Aadhaar, and Bank Details.
2. **Usage**: Your data is used SOLELY for government filings and is never sold to third parties.
3. **Security**: We use 256-bit SSL encryption. All documents are stored in secure cloud vaults (AWS S3/Google Cloud).
4. **Retention**: We retain documents for 5 years as per The Companies Act, 2013 laws.
5. **Rights**: You can request deletion of your account at any time, subject to legal retention requirements.
""";

  static const String termsText = """
**1. Acceptance of Terms**
By accessing ShineFiling, you agree to be bound by these Terms.

**2. Accuracy of Information**
You agree to provide accurate and complete information. ShineFiling is not responsible for rejections caused by incorrect data provided by you.

**3. Payments & Refunds**
- Payments are upfront.
- Refunds are processed only if the service has not commenced.
- Gov fees paid are non-refundable.

**4. Timeline Estimates**
Timelines (e.g., "5-7 days") are estimates based on normal government processing speeds. We are not liable for government-side delays.

**5. Limitation of Liability**
ShineFiling's liability is limited to the professional fee paid by you.
""";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(
        title: Text(title, style: GoogleFonts.plusJakartaSans(color: brandNavy, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: brandNavy),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        physics: const BouncingScrollPhysics(),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(color: brandNavy.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4)),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Last Updated: Dec 27, 2025',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),
              Text(
                content,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 15,
                  color: brandNavy,
                  height: 1.8,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
