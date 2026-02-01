import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter/foundation.dart';
import 'dart:async';
import '../services/api_service.dart';

import 'business_health_page.dart';
import 'smart_vault_page.dart';

// Page Imports
import 'services_page.dart';
import 'dashboard_page.dart';
import 'notifications_page.dart';
import 'profile_page.dart';
import 'service_details_page.dart';
import 'chat_page.dart';
import '../widgets/loader_3d.dart';

final RouteObserver<ModalRoute<void>> routeObserver = RouteObserver<ModalRoute<void>>();

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  final TextEditingController _searchController = TextEditingController();
  bool _isSearchActive = false;
  String _searchQuery = '';
  String _userName = 'User';
  String? _profileImage;

  Map<String, dynamic> _serviceData = {};
  List<Map<String, dynamic>> _recentFiles = [];
  Map<String, dynamic> _userStats = {};
  Map<String, dynamic> _userProfileData = {};

  final Map<String, IconData> _categoryIcons = {
    'Registration': Icons.business_rounded,
    'Tax & Filing': Icons.account_balance_wallet_rounded,
    'Licenses': Icons.card_membership_rounded,
    'IP & Legal': Icons.verified_user_rounded,
    'Certs': Icons.stars_rounded,
  };

  bool _isLoading = true;
  int _processIndex = 0;
  Timer? _processTimer;
  Timer? _chatPollTimer;
  Timer? _statusPollTimer;
  int _notificationCount = 0;
  int _lastUnreadChatCount = 0;
  Map<String, String> _lastOrderStatuses = {}; // Track previous statuses
  final FlutterLocalNotificationsPlugin _notificationsPlugin = FlutterLocalNotificationsPlugin();

  @override
  void initState() {
    super.initState();
    _initNotifications();
    _fetchHomeData();
    _processTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      if (mounted) {
        setState(() {
          _processIndex = (_processIndex + 1) % 4;
        });
      }
    });
    
    // Poll for chat messages every 10 seconds
    _chatPollTimer = Timer.periodic(const Duration(seconds: 10), (timer) => _checkChatNotifications());
    
    // Poll for status updates every 15 seconds
    _statusPollTimer = Timer.periodic(const Duration(seconds: 15), (timer) => _checkStatusUpdates());
  }

  @override
  void dispose() {
    _searchController.dispose();
    _processTimer?.cancel();
    _chatPollTimer?.cancel();
    _statusPollTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchHomeData() async {
    try {
      // Parallel fetch for speed
      final results = await Future.wait([
        ApiService().getAllServicesCategorized(),
        ApiService().getOrders(),
        ApiService().getUserProfile(),
        ApiService().getNotifications(),
        ApiService().getUserStats(),
        // Add a small delay to prevent flickering if response is too fast
        Future.delayed(const Duration(milliseconds: 800))
      ]);

      final services = results[0] as Map<String, dynamic>;
      final orders = results[1] as List<Map<String, dynamic>>;
      final userProfile = results[2] as Map<String, dynamic>;
      final notifications = results[3] as List<Map<String, dynamic>>;
      final stats = results[4] as Map<String, dynamic>;

      // CRITICAL: If profile is empty, the API request likely failed.
      // We must throw an error to trigger the "Connection Failed" popup.
      if (userProfile.isEmpty) {
         throw Exception("Connection Failed: Unable to fetch user profile.");
      }

      int actionRequired = orders.where((o) => (o['status'] ?? '').toString().toLowerCase().contains('action')).length;
      int unreadNotifs = notifications.where((n) => !(n['read'] ?? false)).length;
      if (unreadNotifs == 0 && notifications.isNotEmpty) unreadNotifs = 1;

      if (mounted) {
        setState(() {
          _serviceData = services;
          _recentFiles = orders;
          _notificationCount = actionRequired + unreadNotifs;
          _userStats = stats;
          _userProfileData = userProfile;
          
          for (var o in orders) {
             _lastOrderStatuses[o['id'].toString()] = o['status'].toString();
          }
          
          // Profile Data
          _userName = userProfile['fullName'] ?? 'User';
          String? img = userProfile['profileImage'];
          if (img != null && img.contains('localhost')) {
            try {
              final apiHost = Uri.parse(ApiService().baseUrl).host;
              img = img.replaceFirst('localhost', apiHost);
            } catch (e) {
                // ignore
            }
          }
          _profileImage = img;
   
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        // Handle Server Unreachable / Critical Error
        setState(() {
           _isLoading = false;
           _hasError = true; // Hides the background
        });
        showDialog(
          context: context,
          barrierDismissible: false, // User must tap action
          builder: (ctx) => AlertDialog(
            title: Text('Connection Error', style: GoogleFonts.plusJakartaSans(color: brandNavy, fontWeight: FontWeight.bold)),
            content: Text(
              'Could not connect to the server.',
              style: GoogleFonts.plusJakartaSans(fontSize: 14),
            ),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            actions: [
              TextButton(
                onPressed: () async {
                  Navigator.of(ctx).pop(); // Close dialog
                  await ApiService().logout(); // Clear session
                  if (mounted) {
                     Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
                  }
                },
                child: Text('OK', style: GoogleFonts.plusJakartaSans(color: brandBronze, fontWeight: FontWeight.bold)),
              )
            ],
          ),
        );
      }
    }
  }

  bool _hasShownWelcomeAlert = false;

  Future<void> _initNotifications() async {
    const AndroidInitializationSettings androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const DarwinInitializationSettings iosSettings = DarwinInitializationSettings();
    const InitializationSettings initSettings = InitializationSettings(android: androidSettings, iOS: iosSettings);

    await _notificationsPlugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (details) {
        if (details.payload != null) {
          _handleNotificationClick(details.payload!);
        }
      },
    );

    if (defaultTargetPlatform == TargetPlatform.android) {
      await _notificationsPlugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()?.requestNotificationsPermission();
    }
  }

  void _handleNotificationClick(String chatId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ChatPage(
          orderId: chatId,
          serviceName: 'New Message',
        ),
      ),
    );
  }

  Future<void> _showNotification(String title, String body, {String? payload}) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'channel_id', 'General Notifications',
      importance: Importance.max, priority: Priority.high,
      playSound: true,
    );
    const NotificationDetails details = NotificationDetails(android: androidDetails, iOS: DarwinNotificationDetails());
    await _notificationsPlugin.show(0, title, body, details, payload: payload);
  }

  Future<void> _checkChatNotifications() async {
    if (ChatPage.isChatOpen) return;

    try {
      final messages = await ApiService().fetchUnreadChatMessages();
      int totalUnread = 0;
      for (var msg in messages) {
        totalUnread += (msg['unreadCount'] as int? ?? 1);
      }
      
      if (totalUnread > 0 && totalUnread > _lastUnreadChatCount) {
         Map<String, dynamic>? latestMsg;
         DateTime? latestTime;

         for (var msg in messages) {
            String tStr = msg['timestamp'] ?? msg['createdAt'] ?? msg['date'] ?? '';
            if (tStr.isNotEmpty) {
               try {
                  final t = DateTime.parse(tStr);
                  if (latestTime == null || t.isAfter(latestTime)) {
                     latestTime = t;
                     latestMsg = msg;
                  }
               } catch (_) {}
            }
         }
         latestMsg ??= messages.last;

         bool isMe = false;
         final currentUserEmail = await ApiService().getStoredEmail();
         final role = (latestMsg['role'] ?? latestMsg['sender'] ?? '').toString().toUpperCase();
         final senderEmail = (latestMsg['email'] ?? latestMsg['senderEmail'] ?? '').toString();

         if (role == 'USER' || role == 'CLIENT') {
            isMe = true;
         } else if (currentUserEmail != null && senderEmail.isNotEmpty) {
            if (currentUserEmail.toLowerCase() == senderEmail.toLowerCase()) {
               isMe = true;
            }
         }
         
         if (!isMe) {
            String msgContent = latestMsg['message'] ?? 'New Attachment';
            String ticketId = latestMsg['ticketId']?.toString() ?? latestMsg['submissionId']?.toString() ?? latestMsg['id']?.toString() ?? '';
            String title = 'New Message from Expert';
            String body = msgContent;
            if (totalUnread > 1) {
               body = '$msgContent (+${totalUnread - 1} unread)';
            }
            await _showNotification(title, body, payload: ticketId);
         }
      }
      _lastUnreadChatCount = totalUnread;
    } catch (e) {
      // ignore
    }
  }

  Future<void> _checkStatusUpdates() async {
    try {
      final orders = await ApiService().getOrders();
      bool updated = false;
      
      for (var order in orders) {
         String id = order['id'].toString();
         String chatId = order['chatId']?.toString() ?? id;
         String status = order['status'].toString();
         String serviceName = order['serviceName'].toString();

         if (_lastOrderStatuses.containsKey(id)) {
            if (_lastOrderStatuses[id] != status) {
               _showNotification(
                  'Status Update', 
                  '$serviceName is now $status',
                  payload: chatId
               );
               updated = true;
            }
         }
         _lastOrderStatuses[id] = status;
      }
      
      if (updated && mounted) {
         setState(() {
            _recentFiles = orders;
         });
      }
    } catch (e) {
      // Silent error
    }
  }

  static const Color brandNavy = Color(0xFF0D1B21); 
  static const Color brandBronze = Color(0xFFC59D7F); 
  static const Color pureWhite = Colors.white;

  String _getGreeting() {
    var hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  bool _hasError = false;

  @override
  Widget build(BuildContext context) {
    if (_hasError) {
      return const Scaffold(backgroundColor: Colors.white);
    }
    
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFFF8F9FA),
        body: Center(
          child: Loader3D(size: 60, text: 'Getting things ready...'),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      extendBody: true,
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          _buildHomeContent(),
          const ServicesPage(),
          DashboardPage(initialOrders: _recentFiles, initialStats: _userStats),
          NotificationsPage(onBack: () => setState(() => _selectedIndex = 0)), 
          ProfilePage(initialProfile: _userProfileData),
        ],
      ),
      floatingActionButton: Container(
        height: 64, width: 64,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: const LinearGradient(
            colors: [brandBronze, Color(0xFF8B6B4E)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: brandBronze.withOpacity(0.4),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: FloatingActionButton(
          heroTag: 'homeFab',
          onPressed: () => setState(() => _selectedIndex = 2),
          backgroundColor: Colors.transparent,
          elevation: 0,
          child: const Icon(Icons.dashboard_customize_rounded, color: Colors.white, size: 28),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, -5))
          ],
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          child: BottomAppBar(
            shape: const CircularNotchedRectangle(),
            notchMargin: 8,
            color: Colors.white,
            elevation: 0,
            height: 70,
            padding: EdgeInsets.zero,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                 _buildNavItem(0, Icons.home_rounded, 'Home'),
                 _buildNavItem(1, Icons.grid_view_rounded, 'Services'),
                 const SizedBox(width: 48), // Gap for FAB
                 Stack(
                   clipBehavior: Clip.none,
                   children: [
                     _buildNavItem(3, Icons.notifications_rounded, 'Alerts'),
                     if (_notificationCount > 0)
                       Positioned(
                         top: 4,
                         right: 12,
                         child: Container(
                           width: 8,
                           height: 8,
                           decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                         ),
                       ),
                   ],
                 ),
                 _buildNavItem(4, Icons.person_rounded, 'Profile'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHomeContent() {
    if (_isLoading) return _buildLoadingSkeleton();

    return SafeArea(
      bottom: false,
      child: RefreshIndicator(
        onRefresh: _fetchHomeData,
        color: brandBronze,
        backgroundColor: Colors.white,
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
          _buildModernHeader(),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                const SizedBox(height: 8),
                if (!_isSearchActive)
                  Text(
                    'Your business command center is ready. checks and alerts are up to date.',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 13,
                      color: brandNavy.withValues(alpha: 0.5),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                const SizedBox(height: 12),
                _buildPromoSlider(),
                const SizedBox(height: 16),
                _buildSearchSection(),
                const SizedBox(height: 16),
                if (_isSearchActive)
                  _buildSearchResults()
                else ...[
                  _buildRecentFiles(),
                  const SizedBox(height: 20),
                  _buildServiceShortcuts(),
                  const SizedBox(height: 8),
                  _buildDeadlinesSection(),
                  const SizedBox(height: 20),
                  _buildHowItWorks(),
                  const SizedBox(height: 20),
                  _buildUnifiedReferralCard(),
                  const SizedBox(height: 20),
                  _buildExpertCarousel(),
                  const SizedBox(height: 20),
                  _buildRecentActivityFeed(),
                ],
                const SizedBox(height: 120),
              ]),
            ),
          ),
        ],
        ),
      ),
    );
  }



   Widget _buildLoadingSkeleton() {
     return const Center(
       child: Loader3D(
         size: 45, 
         text: "Loading...",
       ),
     );
  }

  Widget _buildModernHeader() {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ShaderMask(
                          shaderCallback: (bounds) => const LinearGradient(
                            colors: [brandBronze, Color(0xFF8B6B4E)],
                          ).createShader(bounds),
                          child: Text(
                            '${DateTime.now().day} ${_getMonthName(DateTime.now().month)} ${DateTime.now().year}'.toUpperCase(),
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '${_getGreeting()},',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 28,
                            fontWeight: FontWeight.w600,
                            color: brandNavy,
                            letterSpacing: -1,
                          ),
                        ),
                        Text(
                          _userName,
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            color: brandBronze,
                            letterSpacing: -1,
                            height: 1,
                          ),
                        ),
                      ],
                    ),
                  ),
            Row(
              children: [
                IconButton(
                  onPressed: () => setState(() => _selectedIndex = 3),
                  icon: Stack(
                    children: [
                      const Icon(Icons.notifications_none_rounded, color: brandNavy, size: 28),
                      if (_notificationCount > 0)
                        Positioned(
                          right: 4,
                          top: 4,
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: () => setState(() => _selectedIndex = 4),
                  child: _buildProfileBadge(),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _getMonthName(int month) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[month - 1];
  }

  Widget _buildProfileBadge() {
    return Stack(
      alignment: Alignment.bottomRight,
      children: [
        Container(
          padding: const EdgeInsets.all(3),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: const LinearGradient(colors: [brandBronze, brandNavy]),
            boxShadow: [
              BoxShadow(
                color: brandBronze.withValues(alpha: 0.2),
                blurRadius: 15,
                offset: const Offset(0, 8),
              )
            ],
          ),
          child: CircleAvatar(
            radius: 26,
            backgroundImage: _profileImage != null 
                ? NetworkImage(_profileImage!) 
                : const NetworkImage('https://i.pravatar.cc/150?u=default'),
          ),
        ),
        Container(
          height: 14,
          width: 14,
          decoration: BoxDecoration(
            color: Colors.greenAccent,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 2),
          ),
        ),
      ],
    );
  }

  Widget _buildSearchSection() {
    return Row(
      children: [
        Expanded(
          child: Container(
            height: 52,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: brandNavy.withValues(alpha: 0.08)),
              boxShadow: [
                BoxShadow(
                  color: brandNavy.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                const Icon(Icons.search_rounded, color: brandBronze, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    onChanged: (val) {
                      setState(() {
                        _isSearchActive = val.isNotEmpty;
                        _searchQuery = val.toLowerCase();
                      });
                    },
                    style: GoogleFonts.plusJakartaSans(
                      color: brandNavy,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Search services, files...',
                      hintStyle: GoogleFonts.plusJakartaSans(
                        color: brandNavy.withValues(alpha: 0.4),
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                      ),
                      border: InputBorder.none,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSearchResults() {
    List<Map<String, dynamic>> results = [];
    _serviceData.forEach((category, data) {
      final List<dynamic> items = data['items'] ?? [];
      for (var item in items) {
        if (item.toString().toLowerCase().contains(_searchQuery)) {
          results.add({
            'title': item.toString(),
            'category': category,
            'color': Color(data['color']),
            'icon': _categoryIcons[category] ?? Icons.category,
          });
        }
      }
    });

    if (results.isEmpty) {
      return Center(child: Text('No results found', style: GoogleFonts.plusJakartaSans(color: Colors.grey)));
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: results.length,
      itemBuilder: (context, index) {
        final item = results[index];
        return ListTile(
          leading: Icon(item['icon'], color: item['color']),
          title: Text(item['title'], style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
          subtitle: Text(item['category']),
          onTap: () => Navigator.push(context, MaterialPageRoute(builder: (c) => ServiceDetailsPage(serviceName: item['title'], category: item['category']))),
        );
      },
    );
  }

  Widget _buildRecentFiles() {
    if (_recentFiles.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Recent Files'),
        const SizedBox(height: 12),
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: _recentFiles.length,
            itemBuilder: (context, index) {
              final file = _recentFiles[index];
              return Container(
                width: 85,
                margin: const EdgeInsets.only(right: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: pureWhite,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [BoxShadow(color: brandNavy.withValues(alpha: 0.04), blurRadius: 10)],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.description_rounded, color: Color(file['color'] ?? 0xFFB58863)),
                    const SizedBox(height: 8),
                    Text(file['serviceName'], maxLines: 1, overflow: TextOverflow.ellipsis, style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.bold)),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildServiceShortcuts() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Quick Access'),
        const SizedBox(height: 16),
        LayoutBuilder(
          builder: (context, constraints) {
            return GridView.count(
              crossAxisCount: constraints.maxWidth > 500 ? 6 : 4,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              children: [
                _buildNeatActionCard('Pvt Ltd', Icons.business_rounded, brandBronze, 'Registration', serviceId: 'Private Limited Company'),
                _buildNeatActionCard('GST', Icons.receipt_long_rounded, Colors.blue, 'Tax', serviceId: 'GST Registration'),
                _buildNeatActionCard('ITR', Icons.account_balance_wallet_rounded, Colors.green, 'Tax', serviceId: 'Income Tax Return Filing'),
                _buildNeatActionCard('Vault', Icons.lock_outline_rounded, Colors.purple, 'Vault-Action'), // Link to Vault
              ],
            );
          }
        ),
      ],
    );
  }

  Widget _buildPromoSlider() {
    final List<Map<String, String>> promos = [
      {
        'title': 'Startup Bundle',
        'subtitle': 'Flat 20% OFF on Pvt Ltd',
        'code': 'USE: STARTUP20',
        'image': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000',
      },
      {
        'title': 'GST Filing',
        'subtitle': '3 Months Return Filing @ ₹999',
        'code': 'LIMITED TIME',
        'image': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000',
      },
      {
        'title': 'Trademark',
        'subtitle': 'Protect Your Brand Identity',
        'code': 'FAST TRACK',
        'image': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000',
      },
    ];

    return SizedBox(
      height: 180,
      child: PageView.builder(
        controller: PageController(viewportFraction: 0.92),
        padEnds: false,
        physics: const BouncingScrollPhysics(),
        itemCount: promos.length,
        itemBuilder: (context, index) {
          final promo = promos[index];
          return Container(
            margin: const EdgeInsets.only(right: 12),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              image: DecorationImage(
                image: NetworkImage(promo['image']!),
                fit: BoxFit.cover,
                colorFilter: ColorFilter.mode(Colors.black.withValues(alpha: 0.4), BlendMode.darken),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(24),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black.withValues(alpha: 0.8)],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: brandBronze, borderRadius: BorderRadius.circular(8)),
                        child: Text(promo['code']!, style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800)),
                      ),
                      const SizedBox(height: 8),
                      Text(promo['title']!, style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
                      Text(promo['subtitle']!, style: GoogleFonts.plusJakartaSans(color: Colors.white.withValues(alpha: 0.9), fontSize: 12, fontWeight: FontWeight.w500)),
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

  Widget _buildNeatActionCard(String label, IconData icon, Color color, String category, {String? serviceId}) {
    return InkWell(
      onTap: () {
        if (category == 'Vault-Action') {
            Navigator.push(context, MaterialPageRoute(builder: (c) => const SmartVaultPage()));
        } else {
            Navigator.push(context, MaterialPageRoute(builder: (c) => ServiceDetailsPage(serviceName: serviceId ?? label, category: category)));
        }
      },
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16)),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 4),
          Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildDeadlinesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Compliance Watch'),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: brandNavy, borderRadius: BorderRadius.circular(24)),
          child: Row(
            children: [
              const Icon(Icons.event_note_rounded, color: brandBronze, size: 32),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('GSTR-1 Filing Due', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.bold)),
                    Text('Deadline: 13th Jan', style: GoogleFonts.plusJakartaSans(color: Colors.white70, fontSize: 12)),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white24, size: 16),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildHowItWorks() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('How It Works'),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          decoration: BoxDecoration(
            color: pureWhite,
            borderRadius: BorderRadius.circular(24),
            boxShadow: [BoxShadow(color: brandNavy.withValues(alpha: 0.05), blurRadius: 10)],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildAnimatedStep(0, Icons.touch_app_rounded, 'Select'),
              _buildAnimatedLine(0),
              _buildAnimatedStep(1, Icons.upload_file_rounded, 'Upload'),
              _buildAnimatedLine(1),
              _buildAnimatedStep(2, Icons.psychology_rounded, 'Expert'),
              _buildAnimatedLine(2),
              _buildAnimatedStep(3, Icons.check_circle_rounded, 'Done'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAnimatedStep(int index, IconData icon, String label) {
    bool isActive = _processIndex >= index;
    bool isCurrent = _processIndex == index;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isActive ? brandBronze : brandNavy.withValues(alpha: 0.05),
              shape: BoxShape.circle,
              boxShadow: isCurrent
                  ? [BoxShadow(color: brandBronze.withValues(alpha: 0.4), blurRadius: 10, spreadRadius: 2)]
                  : [],
            ),
            child: Icon(icon, color: isActive ? Colors.white : brandNavy.withValues(alpha: 0.2), size: 20),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10,
              fontWeight: isActive ? FontWeight.w800 : FontWeight.w600,
              color: isActive ? brandNavy : brandNavy.withValues(alpha: 0.4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnimatedLine(int index) {
    bool isActive = _processIndex > index;
    return Expanded(
      child: Container(
        height: 2,
        margin: const EdgeInsets.only(bottom: 14), // Align with icon center roughly
        decoration: BoxDecoration(
          color: isActive ? brandBronze : brandNavy.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(1),
        ),
      ),
    );
  }

  Widget _buildUnifiedReferralCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(gradient: const LinearGradient(colors: [brandBronze, Color(0xFF8B6B4E)]), borderRadius: BorderRadius.circular(32)),
      child: Row(
        children: [
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Refer & Earn', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            Text('Get ₹500 for every referral.', style: GoogleFonts.plusJakartaSans(color: Colors.white70, fontSize: 12)),
          ])),
          const Icon(Icons.card_giftcard_rounded, color: Colors.white, size: 40),
        ],
      ),
    );
  }

  Widget _buildExpertCarousel() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Talk to Experts'),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: pureWhite, borderRadius: BorderRadius.circular(24)),
          child: Row(
            children: [
              const CircleAvatar(radius: 20, backgroundImage: NetworkImage('https://i.pravatar.cc/150?u=expert1')),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('CA Venkat is Online', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
                Text('Available for consultation', style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.green)),
              ])),
              const Icon(Icons.chat_bubble_rounded, color: brandBronze),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRecentActivityFeed() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('Active Items'),
        const SizedBox(height: 16),
        _buildActivityItem('Pvt Ltd Registration', 'Pending verification', '2h ago'),
      ],
    );
  }

  Widget _buildActivityItem(String title, String status, String time) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: pureWhite, borderRadius: BorderRadius.circular(24)),
      child: Row(
        children: [
          const Icon(Icons.access_time_rounded, color: brandBronze),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold)),
            Text(status, style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.grey)),
          ])),
          Text(time, style: GoogleFonts.plusJakartaSans(fontSize: 10, color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w900, color: brandNavy));
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    bool isSelected = _selectedIndex == index;
    return InkWell(
      onTap: () => setState(() => _selectedIndex = index),
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon, 
              color: isSelected ? brandBronze : Colors.grey.shade400, 
              size: 24
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 10,
                color: isSelected ? brandNavy : Colors.grey.shade400,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              ),
            )
          ],
        ),
      ),
    );
  }


}
