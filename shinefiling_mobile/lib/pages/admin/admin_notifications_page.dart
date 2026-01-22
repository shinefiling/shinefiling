import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AdminNotificationsPage extends StatefulWidget {
  const AdminNotificationsPage({super.key});

  @override
  State<AdminNotificationsPage> createState() => _AdminNotificationsPageState();
}

class _AdminNotificationsPageState extends State<AdminNotificationsPage> {
  // Mock Notification Data
  final List<Map<String, dynamic>> _notifications = [
    {'title': 'New Agent Registration', 'message': 'Ramesh Kumar (CA) has applied for verification.', 'time': '10 min ago', 'type': 'user', 'isRead': false},
    {'title': 'System Warning', 'message': 'High server load detected on API Gateway.', 'time': '1 hour ago', 'type': 'alert', 'isRead': false},
    {'title': 'Order #921 Completed', 'message': 'Pvt Ltd Registration for TechCorp was successful.', 'time': '2 hours ago', 'type': 'order', 'isRead': true},
    {'title': 'New Support Ticket', 'message': 'User #502 raised a ticket regarding GST Filing.', 'time': '5 hours ago', 'type': 'support', 'isRead': true},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text('Notifications', style: GoogleFonts.plusJakartaSans(color: const Color(0xFF10232A), fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF10232A)),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.done_all_rounded, color: Colors.blue)),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _notifications.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final notif = _notifications[index];
          IconData icon;
          Color color;
          
          switch(notif['type']) {
            case 'alert': icon = Icons.warning_amber_rounded; color = Colors.red; break;
            case 'order': icon = Icons.check_circle_outline; color = Colors.green; break;
            case 'user': icon = Icons.person_add_rounded; color = Colors.blue; break;
            default: icon = Icons.notifications_rounded; color = Colors.grey;
          }

          return Container(
            decoration: BoxDecoration(
              color: notif['isRead'] ? Colors.white : Colors.blue.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: ListTile(
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: color.withValues(alpha: 0.1), shape: BoxShape.circle),
                child: Icon(icon, color: color, size: 20),
              ),
              title: Text(notif['title'], style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 14)),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 4),
                  Text(notif['message'], style: const TextStyle(fontSize: 12, color: Colors.black87)),
                  const SizedBox(height: 6),
                  Text(notif['time'], style: const TextStyle(fontSize: 10, color: Colors.grey)),
                ],
              ),
              trailing: notif['isRead'] ? null : Container(width: 8, height: 8, decoration: const BoxDecoration(color: Colors.blue, shape: BoxShape.circle)),
            ),
          );
        },
      ),
    );
  }
}
