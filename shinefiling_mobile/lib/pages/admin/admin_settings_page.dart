import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';

class AdminSettingsPage extends StatefulWidget {
  const AdminSettingsPage({super.key});

  @override
  State<AdminSettingsPage> createState() => _AdminSettingsPageState();
}

class _AdminSettingsPageState extends State<AdminSettingsPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  static const Color brandNavy = Color(0xFF10232A);
  static const Color brandBronze = Color(0xFFC59D7F);

  bool _isLoading = true;
  List<dynamic> _logs = [];

  // Mock Settings
  bool _maintenanceMode = false;
  bool _allowSignups = true;
  bool _emailNotifications = true;
  bool _autoApproveAgents = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchLogs();
  }

  Future<void> _fetchLogs() async {
    final logs = await ApiService().getAdminLogs();
    if (mounted) setState(() { _logs = logs; _isLoading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text('System Control', style: GoogleFonts.plusJakartaSans(color: brandNavy, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: brandNavy),
        bottom: TabBar(
          controller: _tabController,
          labelColor: brandBronze,
          unselectedLabelColor: Colors.grey,
          indicatorColor: brandBronze,
          tabs: const [
            Tab(text: 'Configuration'),
            Tab(text: 'Audit Logs'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildSettingsTab(),
          _buildLogsTab(),
        ],
      ),
    );
  }

  Widget _buildSettingsTab() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _buildSectionHeader('General System'),
        _buildSwitchTile('Maintenance Mode', 'Disable access for all users except admins.', _maintenanceMode, (v) => setState(() => _maintenanceMode = v)),
        _buildSwitchTile('Allow New Signups', 'Enable registration for new users.', _allowSignups, (v) => setState(() => _allowSignups = v)),
        
        const SizedBox(height: 24),
        _buildSectionHeader('Notifications & Email'),
        _buildSwitchTile('Email Alerts', 'Send system alerts to admin email.', _emailNotifications, (v) => setState(() => _emailNotifications = v)),
        
        const SizedBox(height: 24),
        _buildSectionHeader('Automation Rules'),
        _buildSwitchTile('Auto-Approve Agents', 'Automatically verify agents with valid ID.', _autoApproveAgents, (v) => setState(() => _autoApproveAgents = v)),
        
        const SizedBox(height: 40),
        ElevatedButton(
          onPressed: () {
             ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Settings Saved Successfully")));
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: brandNavy,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: const Text('Save Changes', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        )
      ],
    );
  }

  Widget _buildSwitchTile(String title, String subtitle, bool value, Function(bool) onChanged) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.grey.shade200)),
      child: SwitchListTile(
        activeColor: brandBronze,
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        value: value,
        onChanged: onChanged,
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(title.toUpperCase(), style: TextStyle(color: brandNavy.withValues(alpha: 0.6), fontWeight: FontWeight.bold, fontSize: 12)),
    );
  }

  Widget _buildLogsTab() {
     if (_isLoading) return const Center(child: CircularProgressIndicator(color: brandBronze));
     if (_logs.isEmpty) {
       // Return Mock Logs if empty
       return ListView.separated(
         padding: const EdgeInsets.all(16),
         itemCount: 5,
         separatorBuilder: (_,__) => const Divider(),
         itemBuilder: (context, index) {
            return ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.grey, radius: 16, child: Icon(Icons.history, size: 16, color: Colors.white)),
              title: Text("System Action #$index", style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              subtitle: Text("Admin • 2 hours ago", style: const TextStyle(fontSize: 12)),
              trailing: const Icon(Icons.arrow_forward_ios, size: 14),
            );
         },
       );
     }
     
     return ListView.separated(
       itemCount: _logs.length,
       separatorBuilder: (_,__) => const Divider(height: 1),
       itemBuilder: (context, index) {
         final log = _logs[index];
         return ListTile(
           leading: const Icon(Icons.history, size: 20, color: Colors.grey),
           title: Text(log['action'] ?? 'Action', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
           subtitle: Text("${log['user']} • ${log['time']}"),
         );
       },
     );
  }
}
