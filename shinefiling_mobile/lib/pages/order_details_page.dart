import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'chat_page.dart';
import '../services/api_service.dart';

class OrderDetailsPage extends StatefulWidget {
  final String orderId;
  final String serviceName;
  final String status;
  final String? chatId;

  const OrderDetailsPage({
    super.key,
    required this.orderId,
    required this.serviceName,
    required this.status,
    this.chatId,
  });

  @override
  State<OrderDetailsPage> createState() => _OrderDetailsPageState();
}

class _OrderDetailsPageState extends State<OrderDetailsPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);
  
  bool _isLoading = true;
  Map<String, dynamic> _orderDetails = {};

  @override
  void initState() {
    super.initState();
    _fetchDetails();
  }

  Future<void> _fetchDetails() async {
    try {
      final details = await ApiService().getOrderDetails(widget.orderId);
      if (mounted) {
        setState(() {
          _orderDetails = details;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFFF0F2F5),
        body: Center(child: CircularProgressIndicator(color: brandBronze)),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          _buildSliverAppBar(context),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTrackStatus(),
                  const SizedBox(height: 32),
                  _buildBusinessDetails(),
                  const SizedBox(height: 32),
                  _buildPaymentSummary(),
                  const SizedBox(height: 32),
                  _buildDocumentsSection(),
                  const SizedBox(height: 32),
                  _buildRecentUpdates(),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomActions(context),
    );
  }

  Widget _buildSliverAppBar(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 140,
      pinned: true,
      backgroundColor: brandNavy,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
        onPressed: () => Navigator.pop(context),
      ),
      flexibleSpace: FlexibleSpaceBar(
        centerTitle: false,
        titlePadding: const EdgeInsets.only(left: 60, bottom: 16),
        title: Text(
          'Application Tracking',
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white,
            fontWeight: FontWeight.w900,
            fontSize: 18,
          ),
        ),
        background: Container(
          decoration: const BoxDecoration(
            color: brandNavy,
            gradient: LinearGradient(
              colors: [brandNavy, Color(0xFF1A2F38)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTrackStatus() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(
            color: brandNavy.withValues(alpha: 0.05),
            blurRadius: 20,
            offset: const Offset(0, 10),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.serviceName,
                      style: GoogleFonts.plusJakartaSans(
                        fontWeight: FontWeight.w900,
                        fontSize: 22,
                        color: brandNavy,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'REFERENCE ID: #${widget.orderId}',
                      style: GoogleFonts.plusJakartaSans(
                        color: brandNavy.withValues(alpha: 0.3),
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1,
                      ),
                    ),
                  ],
                ),
              ),
              _buildStatusIndicator(),
            ],
          ),
          const SizedBox(height: 32),
          _buildTimeline(),
        ],
      ),
    );
  }

  Widget _buildStatusIndicator() {
    Color color = widget.status == 'Completed' ? Colors.green : brandBronze;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 8),
          Text(
            widget.status.toUpperCase(),
            style: GoogleFonts.plusJakartaSans(
              color: color,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimeline() {
    List<Map<String, dynamic>> steps = List<Map<String, dynamic>>.from(_orderDetails['timeline'] ?? []);

    return Column(
      children: steps.asMap().entries.map((entry) {
        int idx = entry.key;
        var step = entry.value;
        bool isLast = idx == steps.length - 1;

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              children: [
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: step['isDone'] ? (widget.status == 'Completed' && idx == steps.length - 1 ? Colors.green : brandBronze) : Colors.grey.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 4),
                  ),
                  child: step['isDone'] ? const Icon(Icons.check, color: Colors.white, size: 12) : null,
                ),
                if (!isLast)
                  Container(
                    width: 2,
                    height: 40,
                    color: step['isDone'] ? brandBronze.withValues(alpha: 0.3) : Colors.grey.withValues(alpha: 0.1),
                  ),
              ],
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      step['title'],
                      style: GoogleFonts.plusJakartaSans(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: step['isDone'] ? brandNavy : Colors.grey,
                      ),
                    ),
                    Text(
                      step['date'],
                      style: GoogleFonts.plusJakartaSans(color: Colors.grey, fontSize: 11),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      }).toList(),
    );
  }

  Widget _buildBusinessDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader('Business Details', Icons.business_center_rounded),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32)),
          child: Column(
            children: [
              _buildDetailRow('Proposed Name 1', _orderDetails['businessDetails']['name1'] ?? 'N/A'),
              _buildDetailRow('Proposed Name 2', 'SHINE FILING SYSTEMS PVT LTD'),
              _buildDetailRow('Business Activity', _orderDetails['businessDetails']['activity'] ?? 'N/A'),
              _buildDetailRow('Authorized Capital', _orderDetails['businessDetails']['capital'] ?? 'N/A'),
              _buildDetailRow('Paid-up Capital', '₹10,000'),
              const Divider(height: 32),
              _buildDirectorsList(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDirectorsList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Directors',
          style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w900, color: brandNavy.withValues(alpha: 0.3), letterSpacing: 1),
        ),
        const SizedBox(height: 12),
        _buildDirectorItem('Prakash Kumar', 'Managing Director'),
        const SizedBox(height: 8),
        _buildDirectorItem('Suresh Raina', 'Director'),
      ],
    );
  }

  Widget _buildDirectorItem(String name, String role) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: brandNavy.withValues(alpha: 0.02),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: brandNavy.withValues(alpha: 0.05)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 14,
            backgroundColor: brandBronze.withValues(alpha: 0.2),
            child: Text(name[0], style: GoogleFonts.plusJakartaSans(color: brandBronze, fontSize: 10, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 13, color: brandNavy)),
              Text(role, style: GoogleFonts.plusJakartaSans(fontSize: 10, color: Colors.grey)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentSummary() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader('Payment Summary', Icons.receipt_long_rounded),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(32)),
          child: Column(
            children: [
              _buildDetailRow('Total Amount', '₹5,999', isValueBold: true, valueColor: Colors.green),
              _buildDetailRow('Transaction ID', 'TXN_SHINE_82741920'),
              _buildDetailRow('Payment Date', '20 Dec, 2025'),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.download_rounded, size: 18),
                label: const Text('Download Invoice'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: brandNavy,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleApp(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDocumentsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader('Documents', Icons.folder_rounded),
        const SizedBox(height: 16),
        _buildDocumentCategory('Uploaded by You', [
          {'name': 'PAN Card.pdf', 'status': 'Verified'},
          {'name': 'Address Proof.pdf', 'status': 'Verified'},
        ]),
        const SizedBox(height: 16),
        _buildDocumentCategory('Certificates', [
          {'name': 'Incorporation Certificate.pdf', 'status': 'Ready'},
          {'name': 'MOA & AOA.pdf', 'status': 'In Progress'},
        ], isHighlight: true),
      ],
    );
  }

  Widget _buildDocumentCategory(String title, List<Map<String, String>> docs, {bool isHighlight = false}) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isHighlight ? brandBronze.withValues(alpha: 0.05) : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: isHighlight ? brandBronze.withValues(alpha: 0.2) : brandNavy.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 13, color: isHighlight ? brandBronze : brandNavy),
          ),
          const SizedBox(height: 12),
          ...docs.map((doc) => Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Row(
              children: [
                Icon(Icons.description_rounded, color: brandNavy.withValues(alpha: 0.3), size: 20),
                const SizedBox(width: 12),
                Expanded(child: Text(doc['name']!, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 13))),
                Text(
                  doc['status']!,
                  style: GoogleFonts.plusJakartaSans(
                    color: doc['status'] == 'Ready' || doc['status'] == 'Verified' ? Colors.green : Colors.orange,
                    fontWeight: FontWeight.bold,
                    fontSize: 11,
                  ),
                ),
                const SizedBox(width: 8),
                const Icon(Icons.download_rounded, size: 16, color: brandBronze),
              ],
            ),
          )).toList(),
        ],
      ),
    );
  }

  Widget _buildRecentUpdates() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader('Recent Updates', Icons.history_rounded),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
          child: Column(
            children: [
              _buildUpdateItem('Documents verified by expert.', '2 hours ago'),
              _buildUpdateItem('Your application sent to MCA.', 'Yesterday'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildUpdateItem(String text, String time) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 4),
            width: 6,
            height: 6,
            decoration: const BoxDecoration(color: brandBronze, shape: BoxShape.circle),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(text, style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600, color: brandNavy)),
                Text(time, style: GoogleFonts.plusJakartaSans(fontSize: 10, color: Colors.grey)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 18, color: brandBronze),
        const SizedBox(width: 8),
        Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w900, color: brandNavy)),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value, {bool isValueBold = true, Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.plusJakartaSans(color: Colors.grey, fontSize: 13, fontWeight: FontWeight.w600)),
          const SizedBox(width: 16),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: GoogleFonts.plusJakartaSans(
                color: valueColor ?? brandNavy,
                fontSize: 13,
                fontWeight: isValueBold ? FontWeight.w800 : FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomActions(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 20, offset: const Offset(0, -10))],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ChatPage(
                        orderId: widget.chatId ?? widget.orderId,
                        serviceName: widget.serviceName,
                      ),
                    ),
                  );
                },
                icon: const Icon(Icons.chat_bubble_rounded, size: 18),
                label: const Text('Expert Chat'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleApp(borderRadius: BorderRadius.circular(16)),
                  side: const BorderSide(color: brandBronze),
                  foregroundColor: brandBronze,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.headset_mic_rounded, size: 18),
                label: const Text('Support'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: brandNavy,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleApp(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Helper class for rounded rectangles that I keep misnaming
class RoundedRectangleApp extends RoundedRectangleBorder {
  RoundedRectangleApp({super.borderRadius});
}
