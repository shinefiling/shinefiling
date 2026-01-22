import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';
import '../../widgets/shine_loader.dart';
import 'admin_user_details_page.dart';

class AdminUsersPage extends StatefulWidget {
  const AdminUsersPage({super.key});

  @override
  State<AdminUsersPage> createState() => _AdminUsersPageState();
}

class _AdminUsersPageState extends State<AdminUsersPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  List<Map<String, dynamic>> _users = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchUsers();
  }

  Future<void> _fetchUsers() async {
    final data = await ApiService().getAllUsers();
    if (mounted) {
      setState(() {
        _users = data;
        _isLoading = false;
      });
    }
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
          'User Management',
          style: GoogleFonts.plusJakartaSans(
            color: brandNavy,
            fontWeight: FontWeight.w900,
            fontSize: 18,
          ),
        ),
      ),
      body: _isLoading
          ? const ShineLoader(text: 'Managing Users...')
          : RefreshIndicator(
              onRefresh: _fetchUsers,
              color: brandBronze,
              child: ListView.builder(
                padding: const EdgeInsets.all(20),
                physics: const BouncingScrollPhysics(),
                itemCount: _users.length,
                itemBuilder: (context, index) {
                  final user = _users[index];
                  
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: brandNavy.withValues(alpha: 0.04),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(16),
                      leading: Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          color: brandBronze.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            (user['fullName'] ?? 'U')[0].toUpperCase(),
                            style: GoogleFonts.plusJakartaSans(
                              fontWeight: FontWeight.w900,
                              color: brandBronze,
                              fontSize: 18,
                            ),
                          ),
                        ),
                      ),
                      title: Text(
                        user['fullName'],
                        style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.w800,
                          color: brandNavy,
                          fontSize: 16,
                        ),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          Text(
                            user['email'],
                            style: GoogleFonts.plusJakartaSans(fontSize: 12, color: Colors.grey),
                          ),
                          const SizedBox(height: 8),
                          _buildStatusPill(user['status']),
                        ],
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.chevron_right_rounded, color: Colors.grey),
                        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => AdminUserDetailsPage(user: user))),
                      ),
                      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => AdminUserDetailsPage(user: user))),
                    ),
                  );
                },
              ),
            ),
    );
  }

  Widget _buildStatusPill(String status) {
    bool isActive = status == 'Active';
    Color color = isActive ? Colors.green : Colors.red;
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        status.toUpperCase(),
        style: GoogleFonts.plusJakartaSans(
          color: color,
          fontSize: 9,
          fontWeight: FontWeight.w900,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
