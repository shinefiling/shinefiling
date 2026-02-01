import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:async';
import '../services/api_service.dart';
import 'video_call_page.dart';

class ChatPage extends StatefulWidget {
  static bool isChatOpen = false;

  final String orderId;
  final String serviceName;

  const ChatPage({
    super.key,
    required this.orderId,
    required this.serviceName,
  });

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);
  
  // Theme Colors
  static const Color myMessageColor = brandNavy; 
  static const Color otherMessageColor = Colors.white;

  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  List<Map<String, dynamic>> _messages = [];
  Timer? _timer;

  String? _userEmail;

  @override
  void initState() {
    super.initState();
    ChatPage.isChatOpen = true;
    _loadUserEmail();
    _fetchHistory();
    // Faster polling for "real-time" feel
    _timer = Timer.periodic(const Duration(seconds: 3), (timer) => _fetchHistory());
  }

  Future<void> _loadUserEmail() async {
    _userEmail = await ApiService().getStoredEmail();
  }

  @override
  void dispose() {
    ChatPage.isChatOpen = false;
    _timer?.cancel();
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _fetchHistory() async {
    final history = await ApiService().getChatHistory(widget.orderId);
    // Mark as read when viewing
    await ApiService().markChatAsRead(widget.orderId);
    
    if (mounted) {
      setState(() {
        _messages = List<Map<String, dynamic>>.from(history.map((e) {
          // Robust checking for 'isMe'
          bool isMe = false;
          
          final role = (e['role'] ?? e['sender'] ?? '').toString().toUpperCase();
          
          // 1. Explicit Admin/System Roles -> Always Receiver (Left)
          if (['ADMIN', 'SUPER_ADMIN', 'EXPERT', 'SUPPORT', 'SYSTEM'].contains(role)) {
             isMe = false;
          } 
          // 2. Explicit User Roles -> Always Sender (Right)
          else if (['USER', 'CLIENT'].contains(role)) {
             isMe = true;
          }
          // 3. Fallback: Email Check
          else if (_userEmail != null) {
             final senderEmail = (e['email'] ?? e['senderEmail'] ?? e['sender'] ?? '').toString();
             if (senderEmail.isNotEmpty && senderEmail.toLowerCase() == _userEmail!.toLowerCase()) {
                isMe = true;
             }
          }

          final String content = e['message'] ?? e['content'] ?? e['text'] ?? '';
          final String timeStr = e['timestamp'] ?? e['createdAt'] ?? e['date'] ?? '';
          final bool isRead = e['isRead'] == true || e['read'] == true;

          return <String, dynamic>{
            'isUser': isMe,
            'message': content,
            'time': _formatTime(timeStr),
            'status': isRead ? 'read' : 'sent',
          };
        }));
      });
    }
  }
  
  String _formatTime(String? dateStr) {
    if (dateStr == null) return '';
    try {
      final date = DateTime.parse(dateStr).toLocal();
      return "${date.hour}:${date.minute.toString().padLeft(2, '0')}";
    } catch(e) { 
      return ''; 
    }
  }

  Future<void> _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    _messageController.clear();
    
    final Map<String, dynamic> newMsg = {
      'isUser': true,
      'message': text,
      'time': _formatTime(DateTime.now().toIso8601String()),
      'status': 'sent',
    };

    // Optimistic UI Update
    setState(() {
      _messages.add(newMsg);
    });
    
    _scrollToBottom();

    await ApiService().sendMessage(widget.orderId, text);
    _fetchHistory(); // Refresh to get server timestamp
  }
  
  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      Future.delayed(const Duration(milliseconds: 100), () {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      });
    }
  }

  void _startCall() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => VoiceCallPage(
          expertName: 'Shine Expert',
          expertRole: 'Online | ${widget.serviceName}',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5), // Application Theme BG
      appBar: _buildAppBar(),
      body: Column(
        children: [
          Expanded(
            child: _messages.isEmpty 
              ? Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    decoration: BoxDecoration(
                      color: brandBronze.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      "Messages and calls are end-to-end encrypted.\nNo one outside of this chat, not even ShineFiling, can read or listen to them.",
                      textAlign: TextAlign.center,
                      style: GoogleFonts.plusJakartaSans(color: brandNavy.withValues(alpha: 0.6), fontSize: 11),
                    ),
                  ),
                )
              : ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                return _buildMessageBubble(msg['message'], msg['time'], msg['isUser'], msg['status'] ?? 'sent');
              },
            ),
          ),
          _buildInputArea(),
        ],
      ),
    );
  }

  void _handleAttachment() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        margin: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.purple.withOpacity(0.1), shape: BoxShape.circle),
                child: const Icon(Icons.description_rounded, color: Colors.purple),
              ),
              title: const Text('Document'),
              onTap: () { Navigator.pop(context); },
            ),
            ListTile(
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.pink.withOpacity(0.1), shape: BoxShape.circle),
                child: const Icon(Icons.image_rounded, color: Colors.pink),
              ),
              title: const Text('Gallery'),
              onTap: () { Navigator.pop(context); },
            ),
            ListTile(
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), shape: BoxShape.circle),
                child: const Icon(Icons.camera_alt_rounded, color: Colors.orange),
              ),
              title: const Text('Camera'),
              onTap: () { Navigator.pop(context); },
            ),
          ],
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: brandNavy,
      elevation: 0,
      leadingWidth: 70,
      leading: InkWell(
        onTap: () => Navigator.pop(context),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
            const SizedBox(width: 2),
            CircleAvatar(
              radius: 18,
              backgroundImage: const NetworkImage('https://i.pravatar.cc/150?u=expert'),
              backgroundColor: brandBronze,
            ),
          ],
        ),
      ),
      titleSpacing: 0,
      title: InkWell(
        onTap: () {},
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Shine Expert', // Dynamic name if available
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              widget.serviceName,
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white.withValues(alpha: 0.7),
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
      actions: [
        IconButton(
          onPressed: _startCall,
          icon: const Icon(Icons.call_rounded, color: Colors.white),
        ),
        IconButton(
          onPressed: () {},
          icon: const Icon(Icons.more_vert_rounded, color: Colors.white),
        ),
      ],
    );
  }


  Widget _buildMessageBubble(String message, String time, bool isUser, String status) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        decoration: BoxDecoration(
          color: isUser ? brandNavy : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(20),
            topRight: const Radius.circular(20),
            bottomLeft: isUser ? const Radius.circular(20) : Radius.zero,
            bottomRight: isUser ? Radius.zero : const Radius.circular(20),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 5,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Text(
              message,
              style: TextStyle(
                fontSize: 15, 
                color: isUser ? Colors.white : brandNavy,
                height: 1.4
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  time,
                  style: TextStyle(
                    fontSize: 10,
                    color: isUser ? Colors.white.withValues(alpha: 0.5) : Colors.grey,
                  ),
                ),
                if (isUser) ...[
                  const SizedBox(width: 4),
                  Icon(
                    Icons.done_all, 
                    size: 14, 
                    color: status == 'read' ? Colors.blueAccent : Colors.grey
                  ),
                ]
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF5F7FA),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.grey.withValues(alpha: 0.2)),
                ),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.emoji_emotions_outlined, color: Colors.grey),
                      onPressed: () {},
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _messageController,
                        decoration: const InputDecoration(
                          hintText: 'Type your message...',
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(vertical: 14),
                          isDense: true,
                        ),
                        minLines: 1,
                        maxLines: 5,
                      ),
                    ),
                    const SizedBox(width: 4),
                    IconButton(
                      icon: const Icon(Icons.attach_file, color: Colors.grey),
                      onPressed: _handleAttachment,
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            GestureDetector(
              onTap: _sendMessage,
              child: const CircleAvatar(
                radius: 24,
                backgroundColor: brandBronze,
                child: Icon(Icons.send_rounded, color: Colors.white, size: 22),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

