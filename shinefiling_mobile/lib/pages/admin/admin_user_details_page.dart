import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import 'package:google_fonts/google_fonts.dart';

class AdminUserDetailsPage extends StatefulWidget {
  final Map<String, dynamic> user;
  const AdminUserDetailsPage({super.key, required this.user});

  @override
  State<AdminUserDetailsPage> createState() => _AdminUserDetailsPageState();
}

class _AdminUserDetailsPageState extends State<AdminUserDetailsPage> {
  late String _status;
  bool _isLoading = false;
  List<Map<String, dynamic>> _userOrders = [];

  @override
  void initState() {
    super.initState();
    _status = widget.user['status'] ?? 'Active';
    _fetchHistory();
  }

  Future<void> _fetchHistory() async {
    final orders = await ApiService().getOrders(queryEmail: widget.user['email']);
    if (mounted) setState(() => _userOrders = orders);
  }

  Future<void> _toggleStatus() async {
    setState(() => _isLoading = true);
    // Toggle logic
    String newStatus = _status == 'Active' ? 'Inactive' : 'Active';
    final success = await ApiService().updateUserStatus(widget.user['id'] is int ? widget.user['id'] : int.tryParse(widget.user['id'].toString()) ?? 0, newStatus);
    
    if (success) {
      if(mounted) setState(() { _status = newStatus; _isLoading = false; });
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("User marked as $newStatus")));
    } else {
      if(mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.user['fullName'])),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
             CircleAvatar(
               radius: 40,
               backgroundColor: Colors.blue.shade100,
               child: Text(widget.user['fullName'][0], style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.blue)),
             ),
             const SizedBox(height: 16),
             Text(widget.user['fullName'], style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.bold)),
             Text(widget.user['role'] ?? 'USER', style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
             const SizedBox(height: 32),
             _buildInfoTile(Icons.email, 'Email', widget.user['email']),
             _buildInfoTile(Icons.phone, 'Mobile', widget.user['mobile']),
             _buildInfoTile(Icons.calendar_today, 'Joined', '--'),
             const SizedBox(height: 32),
             const SizedBox(height: 32),
             _buildActionButtons(),
             const SizedBox(height: 32),
             _buildUserOrders(),
          ],
        ),
      ),
    );
  }

  Widget _buildUserOrders() {
    if (_userOrders.isEmpty) {
      return const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Service History", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          SizedBox(height: 12),
          Text("No orders found for this user.", style: TextStyle(color: Colors.grey)),
        ],
      );
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Service History", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ..._userOrders.map((order) => Card(
          margin: const EdgeInsets.only(bottom: 8),
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey.shade200)),
          child: ListTile(
            leading: Icon(
              (order['status'].toString().toLowerCase() == 'completed') ? Icons.check_circle : Icons.history, 
              color: (order['status'].toString().toLowerCase() == 'completed') ? Colors.green : Colors.orange
            ),
            title: Text(order['serviceName'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            subtitle: Text('${order['status']} • ${order['date']}', style: const TextStyle(fontSize: 12)),
          ),
        )),
      ],
    );
  }

  Widget _buildInfoTile(IconData icon, String label, String value) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon, color: Colors.blueGrey),
        title: Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        subtitle: Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
      ),
    );
  }

  Widget _buildActionButtons() {
    bool isActive = _status == 'Active';
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        style: ElevatedButton.styleFrom(
          backgroundColor: isActive ? Colors.red.shade50 : Colors.green.shade50,
          foregroundColor: isActive ? Colors.red : Colors.green,
          padding: const EdgeInsets.all(16)
        ),
        icon: Icon(isActive ? Icons.block : Icons.check_circle),
        label: Text(isActive ? 'Block User' : 'Activate User'),
        onPressed: _isLoading ? null : _toggleStatus,
      ),
    );
  }
}
