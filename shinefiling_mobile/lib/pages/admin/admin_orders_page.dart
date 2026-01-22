import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';
import '../../widgets/shine_loader.dart';
import '../chat_page.dart';

class AdminOrdersPage extends StatefulWidget {
  const AdminOrdersPage({super.key});

  @override
  State<AdminOrdersPage> createState() => _AdminOrdersPageState();
}

class _AdminOrdersPageState extends State<AdminOrdersPage> with SingleTickerProviderStateMixin {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  late TabController _tabController;
  List<Map<String, dynamic>> _allOrders = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _fetchOrders();
  }

  Future<void> _fetchOrders() async {
    final data = await ApiService().getAllAdminOrders();
    if (mounted) {
      setState(() {
        _allOrders = data;
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteOrder(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: Text('Delete Order?', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
        content: Text('This action cannot be undone.', style: GoogleFonts.plusJakartaSans()),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(c, true), child: const Text('Delete', style: TextStyle(color: Colors.red))),
        ],
      ),
    );

    if (confirm == true) {
      if (mounted) setState(() => _isLoading = true);
      final success = await ApiService().deleteOrder(id);
      if (success) _fetchOrders();
      else if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _verifyOrder(String id) async {
    if (mounted) setState(() => _isLoading = true);
    await ApiService().verifyOrderDocs(id);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Documents Verified')));
      _fetchOrders();
    }
  }

  List<Map<String, dynamic>> _filterOrders(String type) {
    if (type == 'All') return _allOrders;
    if (type == 'Pending') return _allOrders.where((o) => o['status'] == 'Pending' || o['status'] == 'In Progress').toList();
    if (type == 'Completed') return _allOrders.where((o) => o['status'] == 'Completed' || o['status'] == 'Approved').toList();
    return _allOrders;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: brandNavy, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Orders Management',
          style: GoogleFonts.plusJakartaSans(
            color: brandNavy,
            fontWeight: FontWeight.w900,
            fontSize: 18,
          ),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: brandBronze,
          labelColor: brandNavy,
          unselectedLabelColor: Colors.grey,
          labelStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 13),
          tabs: const [
            Tab(text: "All"),
            Tab(text: "Pending"),
            Tab(text: "Completed"),
          ],
        ),
      ),
      body: _isLoading
          ? const ShineLoader(text: 'Loading Orders...')
          : TabBarView(
              controller: _tabController,
              children: [
                _buildList(_filterOrders('All')),
                _buildList(_filterOrders('Pending')),
                _buildList(_filterOrders('Completed')),
              ],
            ),
    );
  }

  Widget _buildList(List<Map<String, dynamic>> orders) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.shopping_bag_outlined, size: 48, color: brandNavy.withValues(alpha: 0.1)),
            const SizedBox(height: 16),
            Text('No orders found', style: GoogleFonts.plusJakartaSans(color: Colors.grey)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(20),
      physics: const BouncingScrollPhysics(),
      itemCount: orders.length,
      itemBuilder: (context, index) {
        final order = orders[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: brandNavy.withValues(alpha: 0.04),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        order['serviceName'] ?? 'Service',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 16, color: brandNavy),
                      ),
                    ),
                    _buildStatusPill(order['status'] ?? 'Pending'),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(Icons.person_rounded, size: 14, color: brandBronze),
                    const SizedBox(width: 8),
                    Text(order['customerName'] ?? 'Unknown', style: GoogleFonts.plusJakartaSans(fontSize: 13, color: Colors.grey)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.calendar_today_rounded, size: 14, color: brandBronze),
                    const SizedBox(width: 8),
                    Text(order['date'] ?? '', style: GoogleFonts.plusJakartaSans(fontSize: 13, color: Colors.grey)),
                  ],
                ),
                const Divider(height: 32),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    if (order['status'] != 'Completed' && order['status'] != 'Approved')
                      _buildActionButton(Icons.verified_user_rounded, 'Verify', Colors.green, () => _verifyOrder(order['id'])),
                    const SizedBox(width: 8),
                    _buildActionButton(Icons.chat_bubble_rounded, 'Chat', Colors.blue, () {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => ChatPage(orderId: order['id'], serviceName: order['serviceName'] ?? 'Order Support')));
                    }),
                    const SizedBox(width: 8),
                    _buildActionButton(Icons.delete_rounded, 'Delete', Colors.redAccent, () => _deleteOrder(order['id'])),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildActionButton(IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 6),
            Text(label, style: GoogleFonts.plusJakartaSans(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusPill(String status) {
    Color color = Colors.orange;
    if (status.toLowerCase().contains('completed') || status.toLowerCase().contains('approved')) color = Colors.green;
    else if (status.toLowerCase().contains('reject')) color = Colors.red;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        status.toUpperCase(),
        style: GoogleFonts.plusJakartaSans(color: color, fontSize: 10, fontWeight: FontWeight.w900),
      ),
    );
  }
}
