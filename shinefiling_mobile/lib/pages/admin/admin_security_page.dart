import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import 'package:google_fonts/google_fonts.dart';

class AdminSecurityPage extends StatefulWidget {
  const AdminSecurityPage({super.key});

  @override
  State<AdminSecurityPage> createState() => _AdminSecurityPageState();
}

class _AdminSecurityPageState extends State<AdminSecurityPage> {
  bool _isLoading = true;
  Map<String, dynamic> _data = {};

  @override
  void initState() {
    super.initState();
    _fetchSecurity();
  }

  Future<void> _fetchSecurity() async {
    final data = await ApiService().getFirewallStats();
    if (mounted) setState(() { _data = data; _isLoading = false; });
  }

  @override
  Widget build(BuildContext context) {
    List<dynamic> logs = _data['logs'] ?? [];
    
    return Scaffold(
      backgroundColor: const Color(0xFF10232A),
      appBar: AppBar(
        title: const Text('Firewall & Security'),
        backgroundColor: const Color(0xFF0D1B21),
        foregroundColor: Colors.white,
      ),
      body: _isLoading 
       ? const Center(child: CircularProgressIndicator(color: Colors.green))
       : SingleChildScrollView(
         padding: const EdgeInsets.all(16),
         child: Column(
           crossAxisAlignment: CrossAxisAlignment.start,
           children: [
             _buildStatusCard(),
             const SizedBox(height: 24),
             Text("Threat Monitor", style: GoogleFonts.sourceCodePro(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
             const SizedBox(height: 12),
             _buildLogConsole(logs),
           ],
         ),
       ),
    );
  }

  Widget _buildStatusCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [Colors.green.shade900, Colors.black]),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.green.shade800),
      ),
      child: Column(
        children: [
          const Icon(Icons.security, size: 48, color: Colors.greenAccent),
          const SizedBox(height: 12),
          Text(_data['status']?.toUpperCase() ?? 'UNKNOWN', style: GoogleFonts.sourceCodePro(color: Colors.greenAccent, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text("SYSTEM SECURE", style: TextStyle(color: Colors.white70, letterSpacing: 2)),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStat("Blocked", "${_data['threatsBlocked']}"),
              _buildStat("Sessions", "${_data['activeSessions']}"),
              _buildStat("Load", "${_data['serverLoad']}"),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 10)),
      ],
    );
  }

  Widget _buildLogConsole(List<dynamic> logs) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.black54,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        children: logs.map((l) => Container(
          padding: const EdgeInsets.all(12),
          decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Colors.white10))),
          child: Row(
            children: [
              Text(l['time'], style: const TextStyle(color: Colors.grey, fontFamily: 'monospace', fontSize: 11)),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(l['action'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(l['ip'], style: const TextStyle(color: Colors.white38, fontSize: 11)),
                  ],
                ),
              ),
              Text(l['status'], style: TextStyle(color: l['status'] == 'Blocked' ? Colors.redAccent : Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 11)),
            ],
          ),
        )).toList(),
      ),
    );
  }
}
