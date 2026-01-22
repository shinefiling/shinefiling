import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../services/api_service.dart';

class AgentDashboardPage extends StatefulWidget {
  const AgentDashboardPage({super.key});

  @override
  State<AgentDashboardPage> createState() => _AgentDashboardPageState();
}

class _AgentDashboardPageState extends State<AgentDashboardPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);
  List<Map<String, dynamic>> _assignedTasks = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchAgentData();
  }

  Future<void> _fetchAgentData() async {
    // In Production this would be: await ApiService().getAgentTasks();
    // Since request is "remove demo data", we will add the real API stub in ApiService if missing,
    // or try calling a generic endpoint.
    // For now assuming getOrders() retrieves agent specific orders if logged in as agent.
    try {
      final tasks = await ApiService().getOrders(); 
      if (mounted) {
        setState(() {
          _assignedTasks = tasks;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    if (mounted) Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: Text('Agent Portal', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: brandNavy,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: _logout,
          ),
        ],
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator(color: brandBronze))
        : Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildStatCard(),
                const SizedBox(height: 24),
                Text(
                  'Assigned Tasks', 
                  style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.bold, color: brandNavy),
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: _assignedTasks.isEmpty 
                    ? Center(child: Text("No tasks assigned yet.", style: GoogleFonts.plusJakartaSans(color: Colors.grey)))
                    : ListView.builder(
                        itemCount: _assignedTasks.length,
                        itemBuilder: (context, index) {
                          final task = _assignedTasks[index];
                          return Card(
                            elevation: 2,
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: brandBronze.withOpacity(0.1),
                                child: const Icon(Icons.assignment, color: brandBronze),
                              ),
                              title: Text(task['serviceName'] ?? 'Task', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
                              subtitle: Text('Status: ${task['status']}', style: GoogleFonts.plusJakartaSans(color: Colors.grey)),
                              trailing: const Icon(Icons.chevron_right),
                              onTap: () {
                                // Navigate to task details
                              },
                            ),
                          );
                        },
                      ),
                ),
              ],
            ),
          ),
    );
  }

  Widget _buildStatCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: brandNavy,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: brandNavy.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 5))],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _statItem('Pending', '${_assignedTasks.where((t) => t['status'] != 'Completed').length}'),
          Container(width: 1, height: 40, color: Colors.white24),
          _statItem('Completed', '${_assignedTasks.where((t) => t['status'] == 'Completed').length}'),
        ],
      ),
    );
  }

  Widget _statItem(String label, String count) {
    return Column(
      children: [
        Text(count, style: GoogleFonts.plusJakartaSans(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
        Text(label, style: GoogleFonts.plusJakartaSans(color: Colors.white70)),
      ],
    );
  }
}
