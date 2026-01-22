import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';
import '../login_page.dart';
import 'admin_users_page.dart';
import 'admin_services_page.dart';
import 'admin_orders_page.dart';
import 'admin_finance_page.dart';
import 'admin_files_page.dart';
import 'admin_automation_page.dart';
import 'admin_settings_page.dart';
import 'admin_notifications_page.dart';
import 'admin_approvals_page.dart';
import 'admin_security_page.dart';
import '../../widgets/shine_loader.dart';

class AdminDashboardPage extends StatefulWidget {
  const AdminDashboardPage({super.key});

  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  bool _isLoading = true;
  Map<String, dynamic> _stats = {};
  List<Map<String, dynamic>> _recentOrders = [];

  Timer? _pollingTimer;

  @override
  void initState() {
    super.initState();
    _fetchAdminData();
    // Real-time updates for Admin
    _pollingTimer = Timer.periodic(const Duration(seconds: 15), (timer) {
      if (mounted) _fetchAdminData(silent: true);
    });
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchAdminData({bool silent = false}) async {
    try {
      if (!silent) {
        if(mounted) setState(() => _isLoading = true);
      }
      
      final stats = await ApiService().getAdminStats();
      final orders = await ApiService().getAllAdminOrders(); 
      
      if (mounted) {
        setState(() {
          _stats = stats;
          _recentOrders = orders;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Row(
          children: [
            Icon(Icons.admin_panel_settings_rounded, color: brandBronze, size: 24),
            const SizedBox(width: 12),
            Text(
              'Admin Console',
              style: GoogleFonts.plusJakartaSans(
                color: brandNavy,
                fontWeight: FontWeight.w900,
                fontSize: 18,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () => _handleLogout(context),
            icon: const Icon(Icons.logout_rounded, color: Colors.redAccent),
          ),
          const SizedBox(width: 8),
        ],
      ),
      drawer: Drawer(
        backgroundColor: Colors.white,
        child: Column(
          children: [
            UserAccountsDrawerHeader(
              decoration: const BoxDecoration(color: brandNavy),
              currentAccountPicture: const CircleAvatar(
                backgroundColor: brandBronze,
                child: Text('A', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
              accountName: const Text('Admin', style: TextStyle(fontWeight: FontWeight.bold)),
              accountEmail: const Text('admin@shinefiling.com'),
            ),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  _buildDrawerItem(Icons.dashboard_rounded, 'Overview', () => Navigator.pop(context)),
                  _buildDrawerItem(Icons.people_rounded, 'User Management', () => _navTo(const AdminUsersPage())),
                  _buildDrawerItem(Icons.verified_user_rounded, 'Agent Approvals', () => _navTo(const AdminApprovalsPage())),
                  _buildDrawerItem(Icons.category_rounded, 'Services', () => _navTo(const AdminServicesPage())),
                  _buildDrawerItem(Icons.shopping_cart_rounded, 'Orders', () => _navTo(const AdminOrdersPage())),
                  _buildDrawerItem(Icons.account_balance_wallet_rounded, 'Finance', () => _navTo(const AdminFinancePage())),
                  _buildDrawerItem(Icons.folder_shared_rounded, 'Files & CMS', () => _navTo(const AdminFilesPage())),
                  _buildDrawerItem(Icons.smart_toy_rounded, 'Automation', () => _navTo(const AdminAutomationPage())),
                  _buildDrawerItem(Icons.security_rounded, 'Security', () => _navTo(const AdminSecurityPage())),
                  _buildDrawerItem(Icons.notifications_active_rounded, 'Notifications', () => _navTo(const AdminNotificationsPage())),
                  const Divider(),
                  _buildDrawerItem(Icons.settings_rounded, 'Settings', () => _navTo(const AdminSettingsPage())),
                ],
              ),
            ),
          ],
        ),
      ),
      body: _isLoading
          ? const ShineLoader(text: 'Loading Admin Console...')
          : RefreshIndicator(
              onRefresh: _fetchAdminData,
              color: brandBronze,
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Overview',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: brandNavy,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildStatsGrid(),
                    const SizedBox(height: 32),
                    Text(
                      'Recent Orders',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: brandNavy,
                      ),
                    ),
                    const SizedBox(height: 16),
                    _buildOrdersList(),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: brandNavy, size: 22),
      title: Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w600, color: brandNavy)),
      onTap: onTap,
      dense: true,
      horizontalTitleGap: 0,
    );
  }

  void _navTo(Widget page) {
    Navigator.pop(context); // Close drawer
    Navigator.push(context, MaterialPageRoute(builder: (context) => page));
  }

  Widget _buildStatsGrid() {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.5,
      children: [
        _buildStatCard('Total Users', _stats['totalUsers']?.toString() ?? '-', Icons.people_outline_rounded, Colors.blue),
        _buildStatCard('Revenue', _stats['revenue']?.toString() ?? '-', Icons.currency_rupee_rounded, Colors.green),
        _buildStatCard('Orders', _stats['totalOrders']?.toString() ?? '-', Icons.shopping_bag_outlined, Colors.orange),
        _buildStatCard('Pending', _stats['pendingTasks']?.toString() ?? '-', Icons.pending_actions_rounded, Colors.redAccent),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          Flexible(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Flexible(
                  child: Text(
                    value,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: brandNavy,
                    ),
                  ),
                ),
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    color: Colors.grey,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrdersList() {
    if (_recentOrders.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Text(
            'No recent orders',
            style: GoogleFonts.plusJakartaSans(color: Colors.grey),
          ),
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _recentOrders.length,
      itemBuilder: (context, index) {
        final order = _recentOrders[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: brandNavy.withValues(alpha: 0.05)),
          ),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: brandBronze.withValues(alpha: 0.1),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    (order['customerName'] ?? 'U')[0].toUpperCase(),
                    style: GoogleFonts.plusJakartaSans(
                      fontWeight: FontWeight.bold,
                      color: brandBronze,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      order['serviceName'] ?? 'Service',
                      style: GoogleFonts.plusJakartaSans(
                        fontWeight: FontWeight.w800,
                        color: brandNavy,
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      '${order['customerName']} • ${order['date']}',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 11,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),
              _buildStatusPill(order['status'] ?? 'Pending'),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatusPill(String status) {
    Color color = Colors.orange;
    if (status.toLowerCase().contains('completed') || status.toLowerCase().contains('approved')) {
      color = Colors.green;
    } else if (status.toLowerCase().contains('reject')) {
      color = Colors.red;
    }

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
          fontSize: 10,
          fontWeight: FontWeight.w900,
        ),
      ),
    );
  }

  Future<void> _handleLogout(BuildContext context) async {
    await ApiService().logout();
    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const LoginPage()),
        (route) => false,
      );
    }
  }
}
