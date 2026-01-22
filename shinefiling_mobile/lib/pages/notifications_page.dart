import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/api_service.dart';
import 'chat_page.dart';
import '../widgets/loader_3d.dart';

class NotificationsPage extends StatefulWidget {
  final VoidCallback? onBack;
  const NotificationsPage({super.key, this.onBack});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> with SingleTickerProviderStateMixin {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);
  
  late TabController _tabController;
  List<Map<String, dynamic>> _notifications = [];
  List<Map<String, dynamic>> _chats = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchData();
  }

  Future<void> _fetchData() async {
    final notifs = await ApiService().getNotifications();
    final orders = await ApiService().getOrders();
    final unreadMsgs = await ApiService().fetchUnreadChatMessages();
    
    // Map Unread Counts by Ticket ID
    Map<String, int> unreadMap = {};
    for (var msg in unreadMsgs) {
      String id = msg['ticketId']?.toString() ?? '';
      int count = msg['unreadCount'] ?? 0;
      if (id.isNotEmpty) {
        unreadMap[id] = count;
      }
    }
    
    // Merge unread info into orders
    List<Map<String, dynamic>> updatedOrders = [];
    for (var order in orders) {
      var newOrder = Map<String, dynamic>.from(order);
      String id = newOrder['chatId'] ?? newOrder['id'];
      newOrder['unreadCount'] = unreadMap[id] ?? 0;
      updatedOrders.add(newOrder);
    }
    
    if (mounted) {
      setState(() {
        _notifications = notifs;
        _chats = updatedOrders;
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: brandNavy, // Application Theme
        elevation: 0,
        leading: widget.onBack != null ? IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: widget.onBack,
        ) : null,
        title: Text(
          'Shine Inbox',
          style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20),
        ),
        actions: [
          IconButton(icon: const Icon(Icons.search, color: Colors.white), onPressed: () {}),
          IconButton(icon: const Icon(Icons.more_vert, color: Colors.white), onPressed: () {}),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: brandBronze,
          indicatorWeight: 3,
          labelStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold),
          unselectedLabelColor: Colors.white70,
          labelColor: Colors.white,
          tabs: const [
            Tab(text: 'CHATS'),
            Tab(text: 'ALERTS'),
          ],
        ),
      ),


      body: _isLoading 
        ? const Center(child: Loader3D(size: 45, text: "Loading Inbox..."))
        : TabBarView(
            controller: _tabController,
            children: [
              _buildChatsList(),
              _buildNotificationsList(),
            ],
          ),
      floatingActionButton: _tabController.index == 0 ? FloatingActionButton(
        heroTag: 'inboxFab',
        onPressed: () {},
        backgroundColor: brandBronze,
        child: const Icon(Icons.message, color: Colors.white),
      ) : null,
    );
  }

  Widget _buildChatsList() {
    if (_chats.isEmpty) {
      return RefreshIndicator(
        onRefresh: _fetchData,
        color: brandBronze,
        backgroundColor: Colors.white,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Container(
            height: MediaQuery.of(context).size.height * 0.7,
            alignment: Alignment.center,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                 Icon(Icons.chat_bubble_outline_rounded, size: 48, color: Colors.grey.withValues(alpha: 0.5)),
                 const SizedBox(height: 16),
                 Text("No active chats", style: GoogleFonts.plusJakartaSans(color: Colors.grey)),
              ],
            ),
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchData,
      color: brandBronze,
      backgroundColor: Colors.white,
      child: ListView.builder(
        itemCount: _chats.length,
        padding: const EdgeInsets.only(top: 8),
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        itemBuilder: (context, index) {
          final chat = _chats[index];
          final id = chat['chatId'] ?? chat['id'];
          return _buildChatItem(
            id: id,
            name: chat['serviceName'] ?? 'Service Request',
            message: chat['status'] ?? 'Active',
            time: chat['date'] ?? '',
            avatarUrl: 'https://i.pravatar.cc/150?u=${id}',
            unreadCount: chat['unreadCount'] ?? 0,
          );
        },
      ),
    );
  }

  Widget _buildChatItem({
    required String id, 
    required String name, 
    required String message, 
    required String time, 
    required String avatarUrl,
    int unreadCount = 0,
  }) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context, 
          MaterialPageRoute(builder: (_) => ChatPage(orderId: id, serviceName: name))
        ).then((_) => _fetchData()); // Refresh on return
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8), 
        child: Row(
          children: [
            CircleAvatar(
              radius: 24,
              backgroundImage: NetworkImage(avatarUrl),
              backgroundColor: Colors.grey.shade200,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          name,
                          maxLines: 1, 
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.plusJakartaSans(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: const Color(0xFF0D1B21),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      // Time Color: Application Theme (Bronze) if unread
                      Text(
                        time,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 11,
                          color: unreadCount > 0 ? brandBronze : Colors.grey,
                          fontWeight: unreadCount > 0 ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      // Status Icon (Done checks): Hide if unread
                      if (unreadCount == 0) ...[
                        const Icon(Icons.done_all, size: 16, color: Colors.grey),
                        const SizedBox(width: 4),
                      ],
                      
                      Expanded(
                        child: Text(
                          message, 
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.plusJakartaSans(
                            color: unreadCount > 0 ? brandNavy : Colors.grey.shade600,
                            fontSize: 14,
                            fontWeight: unreadCount > 0 ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      ),
                      
                      // Unread Badge: Application Theme (Bronze)
                      if (unreadCount > 0) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: brandBronze, 
                            shape: BoxShape.circle,
                          ),
                          child: Text(
                            unreadCount.toString(),
                            style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ]
                    ],
                  ),
                  const SizedBox(height: 8),
                  Divider(height: 1, color: Colors.grey.withValues(alpha: 0.1)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  } 

  Widget _buildNotificationsList() {
    if (_notifications.isEmpty) {
      return RefreshIndicator(
        onRefresh: _fetchData,
        color: brandBronze,
        backgroundColor: Colors.white,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Container(
             height: MediaQuery.of(context).size.height * 0.7,
             alignment: Alignment.center,
             child: Text(
              'No notifications',
              style: GoogleFonts.plusJakartaSans(color: Colors.grey),
            ),
          ),
        ),
      );
    }
    
    return RefreshIndicator(
      onRefresh: _fetchData,
      color: brandBronze,
      backgroundColor: Colors.white,
      child: ListView.builder(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        padding: const EdgeInsets.all(16),
        itemCount: _notifications.length,
        itemBuilder: (context, index) {
          final item = _notifications[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                )
              ],
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.notifications_active, color: brandBronze, size: 24),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item['title'] ?? 'Alert',
                        style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item['message'] ?? '',
                        style: GoogleFonts.plusJakartaSans(color: Colors.grey.shade700, fontSize: 13),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _formatTime(item['createdAt']),
                        style: GoogleFonts.plusJakartaSans(color: Colors.grey, fontSize: 11),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  String _formatTime(String? dateStr) {
    if (dateStr == null) return '';
    try {
      final date = DateTime.parse(dateStr);
      final now = DateTime.now();
      final diff = now.difference(date);
      if (diff.inDays > 0) return '${diff.inDays} days ago';
      if (diff.inHours > 0) return '${diff.inHours} h ago';
      return '${diff.inMinutes} m ago';
    } catch (e) {
      return '';
    }
  }
}

