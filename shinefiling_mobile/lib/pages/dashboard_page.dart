import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'order_details_page.dart';
import '../services/api_service.dart';
import '../widgets/shine_loader.dart';
import '../widgets/loader_3d.dart';

class DashboardPage extends StatefulWidget {
  final List<Map<String, dynamic>>? initialOrders;
  final Map<String, dynamic>? initialStats;

  const DashboardPage({super.key, this.initialOrders, this.initialStats});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

final RouteObserver<ModalRoute<void>> routeObserver = RouteObserver<ModalRoute<void>>();

class _DashboardPageState extends State<DashboardPage> with RouteAware {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);
  
  String _selectedFilter = 'All';
  final List<String> _filters = ['All', 'In Progress', 'Completed', 'Action Required'];
  
  
  bool _isLoading = true;
  List<Map<String, dynamic>> _orders = [];
  Map<String, dynamic> _stats = {'active': '-', 'completed': '-', 'alerts': '-'};

  Timer? _pollingTimer;

  @override
  void initState() {
    super.initState();
    
    if (widget.initialOrders != null) {
      _orders = widget.initialOrders!;
      _isLoading = false;
    }
    if (widget.initialStats != null) {
      _stats = widget.initialStats!;
    }

    if (_isLoading) {
       _fetchDashboardData();
    }

    // Auto-refresh every 15 seconds to simulate real-time updates
    _pollingTimer = Timer.periodic(const Duration(seconds: 15), (timer) {
      if (mounted) _fetchDashboardData(silent: true);
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Subscribe to RouteObserver to track navigation steps
    // Assuming routeObserver is provided globally or we ignore if not available in this context without specific provider
    // For local refresh on Tab Changes, IndexedStack keeps state alive, so we don't strictly need didPopNext unless navigating deeper.
    // However, if we push a new FULL PAGE and come back, we need this.
    final route = ModalRoute.of(context);
    if (route != null) {
      routeObserver.subscribe(this, route);
    }
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    routeObserver.unsubscribe(this);
    super.dispose();
  }

  @override
  void didPopNext() {
    // Called when the top route has been popped off, and this route shows up. All "back" events trigger this.
    _fetchDashboardData();
  }

  Future<void> _fetchDashboardData({bool silent = false}) async {
    try {
      if (!silent) {
         if (mounted) setState(() => _isLoading = true);
      }
      
      final stats = await ApiService().getUserStats(); // Use real backend stats
      final orders = await ApiService().getOrders(filter: _selectedFilter);
      
      if (mounted) {
        setState(() {
          _stats = stats;
          _orders = orders;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
      print("Error fetching data: $e");
    }
  }

  // Refresh data when filter changes
  void _onFilterChanged(String filter) async {
    setState(() {
      _selectedFilter = filter;
      _isLoading = true;
    });
    
    final orders = await ApiService().getOrders(filter: filter);
    if (mounted) {
      setState(() {
        _orders = orders;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFFF2F1EF),
        body: Center(child: Loader3D(size: 40, text: 'Updating Dashboard...')),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF2F1EF),
      body: RefreshIndicator(
        onRefresh: _fetchDashboardData,
        color: brandBronze,
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 12),
                    _buildHeader(),
                    const SizedBox(height: 32),
                    _buildOrderStats(),
                    const SizedBox(height: 32),
                    _buildFilterBar(),
                    const SizedBox(height: 24),
                    _buildApplicationsList(_orders),
                    const SizedBox(height: 120),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Command Center',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                color: brandNavy,
                letterSpacing: -1,
              ),
            ),
            Text(
              'Real-time compliance monitoring',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 14,
                color: brandNavy.withValues(alpha: 0.4),
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: brandNavy.withValues(alpha: 0.05),
                blurRadius: 10,
              )
            ],
          ),
          child: const Icon(Icons.analytics_rounded, color: brandBronze, size: 24),
        ),
      ],
    );
  }

  Widget _buildFilterBar() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'FILTER BY STATUS',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            color: brandNavy.withValues(alpha: 0.3),
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          child: Row(
            children: _filters.map((filter) {
              bool isSelected = _selectedFilter == filter;
              return Padding(
                padding: const EdgeInsets.only(right: 12),
                child: InkWell(
                  onTap: () => _onFilterChanged(filter),
                  borderRadius: BorderRadius.circular(16),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    decoration: BoxDecoration(
                      color: isSelected ? brandNavy : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: isSelected
                          ? [BoxShadow(color: brandNavy.withValues(alpha: 0.2), blurRadius: 12, offset: const Offset(0, 6))]
                          : [BoxShadow(color: brandNavy.withValues(alpha: 0.02), blurRadius: 4)],
                    ),
                    child: Text(
                      filter,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: isSelected ? Colors.white : brandNavy.withValues(alpha: 0.6),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildOrderStats() {
    return Row(
      children: [
        Expanded(child: _buildDashboardCard('Active Services', _stats['activeServices']?.toString() ?? '0', Icons.rocket_launch_rounded, Colors.blueAccent)),
        const SizedBox(width: 12),
        Expanded(child: _buildDashboardCard('Pending Actions', _stats['pendingActions']?.toString() ?? '0', Icons.warning_amber_rounded, Colors.orangeAccent)),
        const SizedBox(width: 12),
        Expanded(child: _buildDashboardCard('Total Documents', _stats['totalDocuments']?.toString() ?? '0', Icons.file_present_rounded, Colors.purpleAccent)),
      ],
    );
  }

  Widget _buildDashboardCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
        border: Border.all(color: color.withValues(alpha: 0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: brandNavy,
            ),
          ),
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: brandNavy.withValues(alpha: 0.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String count, String label, Color color) {
    return Column(
      children: [
        Text(
          count,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            color: Colors.white38,
            letterSpacing: 1,
          ),
        ),
      ],
    );
  }

  Widget _buildApplicationsList(List<Map<String, dynamic>> orders) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Applications',
          style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w900, color: brandNavy),
        ),
        const SizedBox(height: 16),
        if (orders.isEmpty)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(40),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: brandNavy.withValues(alpha: 0.05), style: BorderStyle.none),
            ),
            child: Column(
              children: [
                Icon(Icons.inventory_2_outlined, color: brandNavy.withValues(alpha: 0.1), size: 48),
                const SizedBox(height: 16),
                Text('No applications found', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: brandNavy.withValues(alpha: 0.3))),
              ],
            ),
          )
        else
          ...orders.map((order) => _buildOrderCard(context, order)).toList(),
      ],
    );
  }

  Widget _buildOrderCard(BuildContext context, Map<String, dynamic> order) {
    Color statusColor = Color(order['color']);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: brandNavy.withValues(alpha: 0.03), blurRadius: 15, offset: const Offset(0, 8))
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: IntrinsicHeight(
        child: Row(
          children: [
            Container(width: 6, color: statusColor),
            Expanded(
              child: InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => OrderDetailsPage(
                        orderId: order['id'],
                        serviceName: order['serviceName'],
                        status: order['status'],
                        chatId: order['chatId'],
                      ),
                    ),
                  );
                },
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  order['serviceName'],
                                  style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 15, color: brandNavy),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'ID: #${order['id']} • ${order['date']}',
                                  style: GoogleFonts.plusJakartaSans(color: brandNavy.withValues(alpha: 0.4), fontSize: 11, fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: statusColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              order['status'].toUpperCase(),
                              style: GoogleFonts.plusJakartaSans(color: statusColor, fontSize: 9, fontWeight: FontWeight.w900),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: LinearProgressIndicator(
                                value: order['progress'],
                                backgroundColor: brandNavy.withValues(alpha: 0.05),
                                color: statusColor,
                                minHeight: 6,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            '${(order['progress'] * 100).toInt()}%',
                            style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w900, color: brandNavy),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

}
