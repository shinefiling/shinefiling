import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import 'package:google_fonts/google_fonts.dart';

class AdminAutomationPage extends StatefulWidget {
  const AdminAutomationPage({super.key});

  @override
  State<AdminAutomationPage> createState() => _AdminAutomationPageState();
}

class _AdminAutomationPageState extends State<AdminAutomationPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<Map<String, dynamic>> _workflows = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchData();
  }

  Future<void> _fetchData() async {
    final data = await ApiService().getAutomationWorkflows();
    if(mounted) setState(() { _workflows = data; _isLoading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(
        title: const Text('Automation Engine'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.blue[900],
          unselectedLabelColor: Colors.grey,
          indicatorColor: Colors.blue[900],
          tabs: const [
            Tab(text: "Workflows"),
            Tab(text: "Live Logs"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildWorkflowList(),
          _buildLiveLogs(),
        ],
      ),
    );
  }

  Widget _buildWorkflowList() {
    if (_isLoading) return const Center(child: CircularProgressIndicator());
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _workflows.length,
      itemBuilder: (context, index) {
        final wf = _workflows[index];
        bool isActive = wf['status'] == 'Active';
        return Card(
          elevation: 2,
          margin: const EdgeInsets.only(bottom: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                 Row(
                   mainAxisAlignment: MainAxisAlignment.spaceBetween,
                   children: [
                     Row(
                       children: [
                          Icon(Icons.precision_manufacturing_rounded, color: isActive ? Colors.blue : Colors.orange),
                          const SizedBox(width: 12),
                          Text(wf['name'], style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 16)),
                       ],
                     ),
                     Container(
                       padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                       decoration: BoxDecoration(color: isActive ? Colors.green[50] : Colors.orange[50], borderRadius: BorderRadius.circular(4)),
                       child: Text(wf['status'].toUpperCase(), style: TextStyle(color: isActive ? Colors.green : Colors.orange, fontSize: 10, fontWeight: FontWeight.bold)),
                     )
                   ],
                 ),
                 const SizedBox(height: 12),
                 Text(wf['description'], style: const TextStyle(color: Colors.grey, fontSize: 12)),
                 const SizedBox(height: 16),
                 Row(
                   mainAxisAlignment: MainAxisAlignment.spaceBetween,
                   children: [
                     Text("${wf['successRate']}% Success Rate", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                     Text("Last run: ${wf['lastRun']}", style: const TextStyle(color: Colors.grey, fontSize: 11)),
                   ],
                 ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildLiveLogs() {
    // Simulated Log Stream
    final logs = [
      {'time': '10:42.05', 'level': 'INFO', 'msg': 'Worker-1 Triggered event for Order #854'},
      {'time': '10:42.10', 'level': 'SUCCESS', 'msg': 'PDF Generated successfully (2.4mb)'},
      {'time': '10:42.15', 'level': 'INFO', 'msg': 'Uploading to S3 Bucket...'},
      {'time': '10:42.55', 'level': 'SUCCESS', 'msg': 'Upload Complete. URL Generated.'},
      {'time': '10:43.01', 'level': 'INFO', 'msg': 'Sending Email notification to client...'},
    ];

    return Container(
      color: const Color(0xFF1E1E1E),
      padding: const EdgeInsets.all(16),
      child: ListView.builder(
        itemCount: logs.length,
        itemBuilder: (context, index) {
          final log = logs[index];
          Color color = Colors.blue;
          if (log['level'] == 'SUCCESS') color = Colors.green;
          if (log['level'] == 'WARN') color = Colors.orange;

          return Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Row(
              children: [
                Text(log['time']!, style: const TextStyle(color: Colors.grey, fontFamily: 'monospace', fontSize: 12)),
                const SizedBox(width: 12),
                Text(log['level']!, style: TextStyle(color: color, fontFamily: 'monospace', fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(width: 12),
                Expanded(child: Text(log['msg']!, style: const TextStyle(color: Colors.white70, fontFamily: 'monospace', fontSize: 12))),
              ],
            ),
          );
        },
      ),
    );
  }
}
