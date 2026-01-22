import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import 'package:google_fonts/google_fonts.dart';

class AdminFinancePage extends StatefulWidget {
  const AdminFinancePage({super.key});

  @override
  State<AdminFinancePage> createState() => _AdminFinancePageState();
}

class _AdminFinancePageState extends State<AdminFinancePage> {
  bool _isLoading = true;
  Map<String, dynamic> _data = {};
  List<dynamic> _transactions = [];

  @override
  void initState() {
    super.initState();
    _fetchFinance();
  }

  Future<void> _fetchFinance() async {
    final data = await ApiService().getAdminFinance();
    if(mounted) {
      setState(() {
        _data = data;
        _transactions = data['transactions'] ?? [];
        _isLoading = false; 
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(title: const Text('Financial Transactions')),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
               crossAxisAlignment: CrossAxisAlignment.start,
               children: [
                 _buildSummaryCards(),
                 const SizedBox(height: 24),
                 Text('Recent Transactions', style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.bold)),
                 const SizedBox(height: 12),
                 _buildTransactionList(),
               ],
            ),
          ),
    );
  }

  Widget _buildSummaryCards() {
    final stats = _data['stats'] ?? {};
    final revenue = stats['revenue']?['total'] ?? 0;
    final mrr = stats['mrr']?['total'] ?? 0;

    return Row(
      children: [
        Expanded(child: _buildCard('Total Revenue', '₹$revenue', Colors.green)),
        const SizedBox(width: 16),
        Expanded(child: _buildCard('Est. MRR', '₹${mrr.toStringAsFixed(0)}', Colors.blue)),
      ],
    );
  }

  Widget _buildCard(String title, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: Colors.grey, fontSize: 12)),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildTransactionList() {
    if (_transactions.isEmpty) return const Text('No transactions found');

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _transactions.length,
      separatorBuilder: (_,__) => const Divider(),
      itemBuilder: (context, index) {
        final txn = _transactions[index];
        return ListTile(
          contentPadding: EdgeInsets.zero,
          leading: CircleAvatar(
             backgroundColor: Colors.green.shade50,
             child: const Icon(Icons.arrow_downward, color: Colors.green, size: 18),
          ),
          title: Text(txn['client'] ?? 'Client'),
          subtitle: Text(txn['date'] ?? ''),
          trailing: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text("+ ₹${txn['amount']}", style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
              Text(txn['status'] ?? '', style: const TextStyle(fontSize: 10, color: Colors.grey)),
            ],
          ),
        );
      },
    );
  }
}
