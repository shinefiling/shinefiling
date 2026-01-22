import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'chat_page.dart';
import 'video_call_page.dart';
import '../services/api_service.dart';

class SupportPage extends StatefulWidget {
  const SupportPage({super.key});

  @override
  State<SupportPage> createState() => _SupportPageState();
}

class _SupportPageState extends State<SupportPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  int? _activeFaq;
  final _subjectController = TextEditingController();
  final _descController = TextEditingController();
  bool _isLoading = false;

  Future<void> _submitTicket() async {
    if (_subjectController.text.isEmpty || _descController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    setState(() => _isLoading = true);
    final result = await ApiService().createSupportTicket(_subjectController.text, _descController.text);
    
    if (mounted) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['message'])));
      if (result['success']) {
        _subjectController.clear();
        _descController.clear();
       }
    }
  }

  final List<Map<String, String>> faqs = [
    { 'q': 'How long does GST registration take?', 'a': 'Typically 3-5 working days after document submission, subject to government processing times.' },
    { 'q': 'Is Digital Signature (DSC) included?', 'a': 'Yes, for Company Registration packages, 2 Class-3 DSCs are included securely.' },
    { 'q': 'Can I cancel my order?', 'a': 'Cancellation is possible before the application is filed with the government. A cancellation fee may apply.' },
    { 'q': 'What docs are required for Trademark?', 'a': 'ID proof, address proof, and a logo image (if applicable).' },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: brandNavy, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Support Center',
          style: GoogleFonts.plusJakartaSans(color: brandNavy, fontWeight: FontWeight.w900, fontSize: 18),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildContactGrid(),
            const SizedBox(height: 32),
            _buildSectionLabel('Raise a Support Ticket'),
            const SizedBox(height: 16),
            _buildTicketForm(),
            const SizedBox(height: 32),
            _buildSectionLabel('Common Questions'),
            const SizedBox(height: 16),
            _buildFaqList(),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildContactGrid() {
    return Row(
      children: [
        _buildContactCard('Chat', '~2 min', Icons.message_rounded, Colors.green, onTap: () {
          Navigator.push(context, MaterialPageRoute(builder: (c) => const ChatPage(orderId: 'NEW', serviceName: 'Support')));
        }),
        const SizedBox(width: 12),
        _buildContactCard('Call', '9am-7pm', Icons.phone_rounded, Colors.blue, onTap: () {
           Navigator.push(context, MaterialPageRoute(builder: (c) => const VoiceCallPage(expertName: 'Support Team', expertRole: 'Customer Care')));
        }),
      ],
    );
  }

  // Adjusted to handle 3 items in a Row by removing Expanded or wrapping in loop if needed. 
  // Wait, Row with 3 Expanded works fine.
  // Actually, I need to rethink the Row structure because the previous code had 2 items.
  // I will replace the Widget _buildContactGrid() entirely to support 3 columns or scrolling row.
  // I'll make it a SingleChildScrollView horizontal row to be safe.
  

  Widget _buildContactCard(String title, String subtitle, IconData icon, Color color, {VoidCallback? onTap}) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(color: brandNavy.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, 4))
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(height: 16),
            Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 15, color: brandNavy)),
            Text(subtitle, style: GoogleFonts.plusJakartaSans(color: Colors.grey, fontSize: 11, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      ),
    );
  }

  Widget _buildSectionLabel(String label) {
    return Text(
      label.toUpperCase(),
      style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w900, color: brandNavy.withValues(alpha: 0.3), letterSpacing: 1.5),
    );
  }

  Widget _buildTicketForm() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Column(
        children: [
          _buildFormInput('Subject', 'e.g., Delay in GST Application', controller: _subjectController),
          const SizedBox(height: 16),
          _buildFormInput('Description', 'Describe your issue...', maxLines: 3, controller: _descController),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _submitTicket,
              style: ElevatedButton.styleFrom(
                backgroundColor: brandNavy,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _isLoading 
                ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Submit Ticket', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormInput(String label, String hint, {int maxLines = 1, TextEditingController? controller}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.bold, color: brandNavy)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 13),
            filled: true,
            fillColor: Colors.grey.shade50,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }

  Widget _buildFaqList() {
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: faqs.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        bool isActive = _activeFaq == index;
        return InkWell(
          onTap: () => setState(() => _activeFaq = isActive ? null : index),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: isActive ? Border.all(color: brandBronze, width: 1.5) : null,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(faqs[index]['q']!, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 13, color: brandNavy)),
                    ),
                    Icon(isActive ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded, color: Colors.grey, size: 18),
                  ],
                ),
                if (isActive) ...[
                  const SizedBox(height: 12),
                  Text(faqs[index]['a']!, style: GoogleFonts.plusJakartaSans(fontSize: 12, color: Colors.grey.shade600, height: 1.5)),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}
