import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../services/api_service.dart';

class PaymentsPage extends StatefulWidget {
  const PaymentsPage({super.key});

  @override
  State<PaymentsPage> createState() => _PaymentsPageState();
}

class _PaymentsPageState extends State<PaymentsPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  List<Map<String, dynamic>> _payments = [];
  bool _isLoading = true;
  double _totalSpent = 0.0;

  @override
  void initState() {
    super.initState();
    _fetchPayments();
  }

  Future<void> _fetchPayments() async {
    final data = await ApiService().getUserPayments();
    if (mounted) {
      double total = 0.0;
      for(var p in data) {
        total += (p['amount'] ?? 0.0);
      }
      setState(() {
        _payments = data;
        _totalSpent = total;
        _isLoading = false;
      });
    }
  }

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
          'Billing & Payments',
          style: GoogleFonts.plusJakartaSans(color: brandNavy, fontWeight: FontWeight.w900, fontSize: 18),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildBalanceCard(),
            const SizedBox(height: 32),
            _buildSectionLabel('Saved Methods'),
            const SizedBox(height: 16),
            _buildSavedCard(),
            const SizedBox(height: 32),
            _buildSectionHeader('Transaction History'),
            const SizedBox(height: 16),
            _isLoading 
                ? const Center(child: CircularProgressIndicator(color: brandBronze))
                : _payments.isEmpty 
                    ? const Center(child: Padding(
                        padding: EdgeInsets.all(20),
                        child: Text('No transactions found'),
                      ))
                    : Column(
                        children: _payments.map((p) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _buildTransactionItem(
                            p['description'] ?? 'Service Payment',
                            '₹${p['amount']}',
                            p['date'] ?? '',
                            p['status'] ?? 'Success',
                          ),
                        )).toList(),
                      ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: brandNavy,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(color: brandNavy.withValues(alpha: 0.3), blurRadius: 20, offset: const Offset(0, 10))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'TOTAL SPENT',
            style: GoogleFonts.plusJakartaSans(color: Colors.white.withValues(alpha: 0.5), fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 1.5),
          ),
          const SizedBox(height: 12),
          Text(
            '₹${_totalSpent.toStringAsFixed(2)}',
            style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 32),
          Row(
            children: [
              _buildCompactButton('Add Credit', Colors.white, brandNavy),
              const SizedBox(width: 12),
              _buildCompactButton('Download Statement', Colors.white.withValues(alpha: 0.1), Colors.white),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCompactButton(String label, Color bg, Color text) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
        alignment: Alignment.center,
        child: Text(label, style: GoogleFonts.plusJakartaSans(color: text, fontSize: 13, fontWeight: FontWeight.w900)),
      ),
    );
  }

  Widget _buildSectionLabel(String label) {
    return Text(
      label.toUpperCase(),
      style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w900, color: brandNavy.withValues(alpha: 0.3), letterSpacing: 1.5),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildSectionLabel(title),
        Text('View all', style: GoogleFonts.plusJakartaSans(color: brandBronze, fontSize: 12, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildSavedCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.grey.shade200)),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: brandNavy, borderRadius: BorderRadius.circular(8)),
            child: const Text('VISA', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold, fontStyle: FontStyle.italic)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text('•••• 4242', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: brandNavy, fontSize: 14)),
          ),
          const Icon(Icons.more_vert_rounded, color: Colors.grey, size: 20),
        ],
      ),
    );
  }

  Widget _buildTransactionItem(String title, String amount, String date, String status) {
    bool isSuccess = status == 'Success';
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: (isSuccess ? Colors.green : Colors.orange).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16)),
            child: Icon(isSuccess ? Icons.check_circle_outline_rounded : Icons.access_time_rounded, color: isSuccess ? Colors.green : Colors.orange, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, color: brandNavy, fontSize: 14)),
                const SizedBox(height: 2),
                Text(date, style: GoogleFonts.plusJakartaSans(color: Colors.grey, fontSize: 11, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(amount, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, color: brandNavy, fontSize: 14)),
              const SizedBox(height: 2),
              Text(status, style: GoogleFonts.plusJakartaSans(color: isSuccess ? Colors.green : Colors.orange, fontSize: 10, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }
}
