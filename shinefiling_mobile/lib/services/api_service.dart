import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart';

class ApiService {
  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // Secure Storage
  static const _storage = FlutterSecureStorage();

  // Base URL for your Backend
  // Base URL Configuration
  // ---------------------------------------------------------------------------
  // IP Option 1: Mobile/Home Network (Active)
  static const String _ip1 = "192.168.1.8"; 
  static const String _ip3 = "10.252.180.100"; 
  // IP Option 2: Office/Alternate Network
  static const String _ip2 = "172.19.25.100";
  
  // Set Active IP: Change this variable to switch networks
  final String baseUrl = "http://$_ip1:8080/api";
  // --------------------------------------------------------------------------- 

  // User Session
  Map<String, dynamic>? _currentUser;

  // --- HELPERS ---
  
  Future<Map<String, String>> _getHeaders({bool isJson = true}) async {
    final Map<String, String> headers = {};
    if (isJson) headers["Content-Type"] = "application/json";

    final token = await _getToken();
    if (token != null) {
      headers["Authorization"] = "Bearer $token";
      headers["x-auth-token"] = token; // Legacy support if needed
    }
    
    return headers;
  }

  Future<String?> _getToken() async {
    // MAX SECURITY: Read from Encrypted Storage
    return await _storage.read(key: 'token');
  }

  // --- AUTHENTICATION ---

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": email,
          "password": password
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _currentUser = data;

        // Persist Session
        final prefs = await SharedPreferences.getInstance();
        if (data['token'] != null) {
           await _storage.write(key: 'token', value: data['token']);
        }
        await prefs.setString('user_email', email);
        if (data['fullName'] != null) await prefs.setString('user_name', data['fullName']);
        if (data['id'] != null) await prefs.setString('user_id', data['id'].toString());
        if (data['role'] != null) await prefs.setString('role', data['role']);

        return {
          'success': true,
          'user': data
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Login failed'
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  Future<Map<String, dynamic>> signup(String name, String email, String mobile, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/signup'),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "fullName": name,
          "email": email,
          "mobile": mobile,
          "password": password,
          "role": "USER"
        }),
      );

      if (response.statusCode == 200) {
        return {'success': true};
      } else {
        final error = jsonDecode(response.body);
        return {'success': false, 'message': error['message'] ?? 'Signup failed'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  Future<void> logout() async {
    _currentUser = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    await _storage.deleteAll();
  }

  Future<String?> getStoredEmail() async {
    if (_currentUser != null && _currentUser!['email'] != null) {
      return _currentUser!['email'];
    }
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_email');
  }

  Future<int?> getUserId() async {
    if (_currentUser != null && _currentUser!['id'] != null) {
      return _currentUser!['id'];
    }
    final prefs = await SharedPreferences.getInstance();
    String? id = prefs.getString('user_id');
    return id != null ? int.tryParse(id) : null;
  }

  // --- PROFILE & USER ---

  Future<Map<String, dynamic>> getUserStats() async {
    final id = await getUserId();
    if (id == null) return {};

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/$id/stats'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return {};
    } catch (e) {
      return {};
    }
  }

  Future<Map<String, dynamic>> getUserProfile() async {
    final id = await getUserId();
    if (id == null) return {};

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/$id'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['profileImage'] != null) {
          String img = data['profileImage'].toString();
          if (img.contains('localhost')) {
            final host = Uri.parse(baseUrl).host;
            data['profileImage'] = img.replaceAll('localhost', host);
          }
        }
        return data;
      }
      return {};
    } catch (e) {
      if (kDebugMode) print("Error fetching profile: $e");
      return {};
    }
  }

  // --- PAYMENTS ---

  Future<List<Map<String, dynamic>>> getUserPayments() async {
    final id = await getUserId();
    if (id == null) return [];

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/$id/payments'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        List<dynamic> list = jsonDecode(response.body);
        return list.map((e) => e as Map<String, dynamic>).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // --- NOTIFICATIONS ---

  Future<List<Map<String, dynamic>>> getNotifications() async {
    final email = await getStoredEmail();
    if (email == null) return [];

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/notifications?email=$email'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        List<dynamic> list = jsonDecode(response.body);
        return list.map((e) => e as Map<String, dynamic>).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // --- CHAT ---

  Future<List<Map<String, dynamic>>> getChatHistory(String ticketId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/chat/history/$ticketId'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        List<dynamic> list = jsonDecode(response.body);
        return list.map((e) => e as Map<String, dynamic>).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> fetchUnreadChatMessages() async {
    final email = await getStoredEmail();
    if (email == null) return [];
    try {
      // 1. Get Unread Counts (Map of TicketId -> Count)
      final response = await http.get(
        Uri.parse('$baseUrl/chat/unread/user?email=$email'),
        headers: await _getHeaders(),
      );

      List<Map<String, dynamic>> unreadMessages = [];

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is Map<String, dynamic>) {
           for (var ticketId in data.keys) {
             int count = data[ticketId] is int ? data[ticketId] : 0;
             if (count > 0) {
                // 2. Fetch latest message for this ticket to show content
                // We limit to 1 to save bandwidth if backend supports it, otherwise fetch history
                // Assuming getChatHistory returns full list, we take last.
                final history = await getChatHistory(ticketId);
                if (history.isNotEmpty) {
                  // Find the latest message that is NOT from the user (i.e. from Admin/Expert)
                  // This ensures we notify about the incoming message, even if User replied after it
                  var lastMsg = history.last;
                  for (var i = history.length - 1; i >= 0; i--) {
                     final m = history[i];
                     final r = (m['role'] ?? m['sender'] ?? '').toString().toUpperCase();
                     if (r != 'USER' && r != 'CLIENT') {
                        lastMsg = m;
                        break;
                     }
                  }
                  
                  // Inject ticketId/submissionId for navigation
                  lastMsg['ticketId'] = ticketId; 
                  lastMsg['unreadCount'] = count;
                  unreadMessages.add(lastMsg);
                }
             }
           }
        }
      }
      return unreadMessages;
    } catch (e) {
      if (kDebugMode) print("Unread fetch error: $e");
      return [];
    }
  }

  Future<bool> markChatAsRead(String ticketId) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/chat/read/$ticketId?role=USER'),
        headers: await _getHeaders(),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<Map<String, dynamic>> sendMessage(String ticketId, String message) async {
    final email = await getStoredEmail();
    if (email == null) return {};

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/chat/send'),
        headers: await _getHeaders(),
        body: jsonEncode({
          "email": email,
          "message": message,
          "ticketId": ticketId,
          "role": "USER"
        }),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return {};
    } catch (e) {
      return {};
    }
  }

  // --- DASHBOARD ---

  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final orders = await getOrders();
      int active = 0;
      int completed = 0;
      int alerts = 0;

      for (var order in orders) {
        String status = (order['status'] ?? '').toString().toLowerCase();
        if (status == 'completed' || status == 'approved') {
          completed++;
        } else if (status.contains('action') || status.contains('rejected')) {
          alerts++;
        } else {
          active++;
        }
      }

      return {
        'active': active.toString().padLeft(2, '0'),
        'completed': completed.toString().padLeft(2, '0'),
        'alerts': alerts.toString().padLeft(2, '0')
      };
    } catch (e) {
      return {'active': '-', 'completed': '-', 'alerts': '-'};
    }
  }

  Future<List<Map<String, dynamic>>> getOrders({String filter = 'All', String? queryEmail}) async {
    final email = queryEmail ?? await getStoredEmail();
    if (email == null) return [];

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/services/my-requests?email=$email'),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        List<Map<String, dynamic>> orders = [];

        for (var item in data) {
          orders.add({
            'id': item['id'].toString(),
            'submissionId': item['submissionId'],
            'chatId': (item['submissionId'] != null && item['submissionId'].toString().isNotEmpty) ? item['submissionId'].toString() : item['id'].toString(),
            'serviceName': item['serviceName'] ?? 'Unknown Service',
            'status': item['status'] ?? 'Pending',
            'progress': _calculateProgress(item['status']),
            'date': _formatDate(item['createdAt']),
            'color': _getStatusColor(item['status']),
            'details': item
          });
        }

        if (filter == 'All') return orders;
        return orders.where((o) => o['status'] == filter).toList();
      }
      return [];
    } catch (e) {
      if (kDebugMode) print("Error fetching orders: $e");
      return [];
    }
  }

  // --- SUBMISSION WITH FILES ---

  Future<bool> submitApplication(Map<String, dynamic> data, {List<String>? filePaths}) async {
    final email = await getStoredEmail();
    if (email == null) return false;
    
    // Add Email to formData
    data['email'] = email;

    try {
      if (filePaths != null && filePaths.isNotEmpty) {
        // Multipart Request for Files
        var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/services/apply-with-docs'));
        request.headers.addAll(await _getHeaders(isJson: false));
        
        // Add Fields
        request.fields['email'] = email;
        request.fields['serviceName'] = data['service'];
        request.fields['formData'] = jsonEncode(data);

        // Add Files
        for (var path in filePaths) {
           // Basic check if file exists
           request.files.add(await http.MultipartFile.fromPath('documents', path));
        }

        var response = await request.send();
        return response.statusCode == 200;

      } else {
        // Standard JSON Request
        final response = await http.post(
          Uri.parse('$baseUrl/services/apply'),
          headers: await _getHeaders(),
          body: jsonEncode({
            "email": email,
            "serviceName": data['service'],
            "formData": jsonEncode(data)
          }),
        );
        return response.statusCode == 200;
      }
    } catch (e) {
      if (kDebugMode) print("Submit error: $e");
      return false;
    }
  }

  // --- SERVICES ---

  Future<Map<String, dynamic>> getAllServicesCategorized() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/catalog'),
        headers: await _getHeaders(),
      );
      
      if (response.statusCode == 200) {
        List<dynamic> list = jsonDecode(response.body);
        Map<String, dynamic> categorized = {};
        for (var cat in list) {
          categorized[cat['category']] = {
            'icon': 0,
            'color': _parseColor(cat['color']),
            'items': cat['services']
          };
        }
        return categorized;
      }
      throw Exception('Failed to load');
    } catch (e) {
      // FULL FALLBACK CATALOG (User Requested)
      return {
        'Business Registration': {
          'color': 0xFF6366f1,
          'items': [
            "Private Limited Company Registration", "One Person Company (OPC) Registration",
            "Limited Liability Partnership (LLP) Registration", "Partnership Firm Registration",
            "Sole Proprietorship Registration", "Section 8 (NGO) Company Registration",
            "Nidhi Company Registration", "Producer Company Registration",
            "Public Limited Company Registration", "Indian Subsidiary Registration",
            "Foreign Company Registration (India)", "Startup Incorporation Advisory"
          ]
        },
        'Tax & GST Compliance': {
          'color': 0xFF10b981,
          'items': [
            "GST Registration", "GST Amendment / Correction", "GST Monthly Return (GSTR-1)",
            "GST Monthly Return (GSTR-3B)", "GST Annual Return (GSTR-9)", "GST Audit (GSTR-9C)",
            "GST Cancellation", "Income Tax Return (ITR-1)", "Income Tax Return (ITR-2)",
            "Income Tax Return (ITR-3)", "Income Tax Return (ITR-4)", "Income Tax Return (ITR-5/6/7)",
            "Advance Tax Filing", "TDS Return Filing"
          ]
        },
        'ROC / MCA Compliance': {
          'color': 0xFF3b82f6,
          'items': [
            "Annual ROC Filing (AOC-4)", "Annual ROC Filing (MGT-7)", "Director KYC (DIR-3 KYC)",
            "Add Director", "Remove Director", "Change Registered Office",
            "Increase Authorized Capital", "Share Transfer Filing", "MOA Amendment",
            "AOA Amendment", "Company Name Change", "Strike Off Company"
          ]
        },
        'Government Licenses': {
          'color': 0xFFf97316,
          'items': [
            "FSSAI Registration (Basic)", "FSSAI License (State)", "FSSAI License (Central)",
            "FSSAI Renewal", "FSSAI Correction", "Shop & Establishment License",
            "Trade License", "Labour License", "Factory License", "Drug License",
            "Fire Safety NOC", "Pollution Control (CTE / CTO)", "Import Export Code (IEC)"
          ]
        },
        'Intellectual Property (IPR)': {
          'color': 0xFF8b5cf6,
          'items': [
            "Trademark Registration", "Trademark Objection Reply", "Trademark Hearing Representation",
            "Trademark Renewal", "Trademark Assignment", "Copyright Registration",
            "Patent Provisional Filing", "Patent Complete Filing", "Design Registration"
          ]
        },
        'Labour Law & HR Compliance': {
          'color': 0xFF06b6d4,
          'items': [
            "PF Registration", "PF Return Filing", "ESI Registration", "ESI Return Filing",
            "Professional Tax Registration", "Professional Tax Filing", "Labour Welfare Fund Filing",
            "Payroll Compliance"
          ]
        },
        'Business Certifications': {
          'color': 0xFFf59e0b,
          'items': [
            "MSME / Udyam Registration", "ISO Certification (9001 / 14001 / 27001)",
            "Startup India Registration", "Digital Signature Certificate (DSC)",
            "Barcode / GS1 Registration", "PAN Application", "TAN Application"
          ]
        },
        'Legal Drafting': {
          'color': 0xFFf43f5e,
          'items': [
            "Partnership Deed Drafting", "Founders Agreement", "Shareholders Agreement",
            "Employment Agreement", "Rent / Lease Agreement", "Franchise Agreement",
            "NDA (Non-Disclosure Agreement)", "Vendor / Service Agreement"
          ]
        },
        'Legal Notices & Disputes': {
          'color': 0xFFef4444,
          'items': [
            "Legal Notice Drafting", "Reply to Legal Notice", "Cheque Bounce Notice (Section 138)",
            "GST / Income Tax Notice Reply", "ROC Notice Reply"
          ]
        },
        'Corrections & Amendments': {
          'color': 0xFFd946ef,
          'items': [
            "PAN Correction", "GST Certificate Correction", "FSSAI License Correction",
            "Company / LLP Detail Correction", "DIN / DSC Correction"
          ]
        },
        'Closure / Exit Services': {
          'color': 0xFF64748b,
          'items': [
            "LLP Closure", "GST Cancellation (Business Closure)",
            "Proprietorship Closure", "FSSAI License Cancellation"
          ]
        },
        'Financial & Startup Support': {
          'color': 0xFF14b8a6,
          'items': [
            "CMA Data Preparation", "Project Report for Bank Loan", "Business Valuation",
            "Startup Pitch Deck", "Cash Flow Statement", "Virtual CFO Services"
          ]
        }
      };
    }
  }
  
  // Helpers
  int _getStatusColor(String? status) {
    if (status == null) return 0xFF9E9E9E; // Grey
    status = status.toLowerCase();
    if (status == 'completed' || status == 'approved') return 0xFF10B981; // Green
    if (status == 'action required' || status == 'rejected') return 0xFFF43F5E; // Red
    if (status == 'in progress' || status == 'processing') return 0xFF2196F3; // Blue
    return 0xFFC59D7F; // Bronze/Pending
  }

  double _calculateProgress(String? status) {
    if (status == null) return 0.0;
    status = status.toLowerCase();
    if (status == 'completed' || status == 'approved') return 1.0;
    if (status == 'submitted') return 0.2;
    if (status == 'payment verified') return 0.4;
    if (status == 'processing') return 0.6;
    if (status == 'action required') return 0.5;
    return 0.1;
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return '';
    try {
      final date = DateTime.parse(dateStr);
      return "${date.day}/${date.month}/${date.year}";
    } catch (e) {
      return dateStr;
    }
  }
  
  int _parseColor(String? colorStr) {
    if (colorStr == null) return 0xFFC59D7F;
    try {
      if (colorStr.startsWith('#')) {
        return int.parse(colorStr.substring(1), radix: 16) + 0xFF000000;
      }
      if (colorStr.startsWith('0x')) {
        return int.parse(colorStr);
      }
      return int.parse(colorStr);
    } catch (e) {
      return 0xFFC59D7F;
    }
  }

  // --- ORDER DETAILS (Original Methods) - Kept for compatibility ---
  
  Future<Map<String, dynamic>> getOrderDetails(String orderId) async {
    final orders = await getOrders();
    final order = orders.firstWhere((o) => o['id'] == orderId, orElse: () => {});
    
    if (order.isEmpty) return {};

    final originalData = order['details'] ?? {};
    var rawFormData = originalData['formData'];
    Map<String, dynamic> formData = {};
    
    if (rawFormData is Map) {
      formData = Map<String, dynamic>.from(rawFormData);
    } else if (rawFormData is String && rawFormData.isNotEmpty) {
      try {
        formData = jsonDecode(rawFormData);
      } catch (e) {
        formData = {};
      }
    }

    return {
      'id': orderId,
      'serviceName': originalData['serviceName'],
      'status': originalData['status'],
      'businessDetails': {
        'name1': formData['companyName1'] ?? formData['businessName'] ?? 'N/A',
        'activity': formData['activity'] ?? 'N/A',
        'capital': formData['authorizedCapital'] ?? 'N/A'
      },
      'timeline': _generateTimeline(originalData['status'], originalData['createdAt'])
    };
  }

  List<Map<String, dynamic>> _generateTimeline(String? status, String? createdAt) {
    String date = _formatDate(createdAt);
    bool isCompleted = status?.toLowerCase() == 'completed';
    
    return [
      {'title': 'Application Submitted', 'date': date, 'isDone': true},
      {'title': 'Payment Verified', 'date': date, 'isDone': true},
      {'title': 'Processing by Expert', 'date': 'Ongoing', 'isDone': isCompleted},
      {'title': 'Completed', 'date': isCompleted ? 'Done' : '--', 'isDone': isCompleted},
    ];
  }

  // --- ADMIN METHODS ---
  // Ensure all undefined methods are implemented here

  Future<Map<String, dynamic>> getAdminStats() async {
     try {
       final response = await http.get(Uri.parse('$baseUrl/admin/stats'), headers: await _getHeaders());
       if (response.statusCode == 200) return jsonDecode(response.body);
       return {};
     } catch (e) { return {}; }
  }

  Future<List<Map<String, dynamic>>> getAllAdminOrders() async {
     try {
       final response = await http.get(Uri.parse('$baseUrl/admin/orders'), headers: await _getHeaders());
       if (response.statusCode == 200) {
          List<dynamic> data = jsonDecode(response.body);
          return data.map((item) => {
             'id': item['id'].toString(),
             'serviceName': item['serviceName'] ?? 'Unknown',
             'customerName': item['user']?['fullName'] ?? 'Unknown User',
             'status': item['status'] ?? 'Pending',
             'date': _formatDate(item['createdAt']),
          }).toList();
       }
       return [];
     } catch (e) { return []; }
  }

  Future<List<Map<String, dynamic>>> getPendingAgents() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/admin/agents/pending'), headers: await _getHeaders());
      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => e as Map<String, dynamic>).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> approveAgent(String id) async {
    try {
      final response = await http.put(Uri.parse('$baseUrl/admin/agents/$id/approve'), headers: await _getHeaders());
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> getAutomationWorkflows() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/admin/automation'), headers: await _getHeaders());
      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => e as Map<String, dynamic>).toList();
      }
      return [];
    } catch (e) {
       return [];
    }
  }

  Future<List<Map<String, dynamic>>> getFiles() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/admin/files'), headers: await _getHeaders());
      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => e as Map<String, dynamic>).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<Map<String, dynamic>> getAdminFinance() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/admin/finance'), headers: await _getHeaders());
      if (response.statusCode == 200) return jsonDecode(response.body);
      throw Exception('Failed');
    } catch (e) {
      return {};
    }
  }

  Future<bool> deleteOrder(String orderId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/admin/orders/$orderId'), 
        headers: await _getHeaders()
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<bool> verifyOrderDocs(String orderId) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/admin/orders/$orderId/verify-docs'), 
        headers: await _getHeaders()
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<Map<String, dynamic>> getFirewallStats() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/admin/security/stats'), 
        headers: await _getHeaders()
      );
      if (response.statusCode == 200) return jsonDecode(response.body);
      return {};
    } catch (e) {
      return {};
    }
  }

  // --- SERVICES ---

  Future<List<Map<String, dynamic>>> getAllServices() async {
    try {
      // Matches web app: calls /admin/services to get full catalog with prices
      final response = await http.get(
        Uri.parse('$baseUrl/admin/services'), 
        headers: await _getHeaders()
      );

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => e as Map<String, dynamic>).toList();
      }
      return [];
    } catch (e) {
      if (kDebugMode) print("Error fetching services: $e");
      return [];
    }
  }

  // --- ADMIN SERVICES ---
  
  Future<List<Map<String, dynamic>>> getAdminServices() async {
     return await getAllServices();
  }

  // Cleaned up section


  Future<bool> updateServiceStatus(String id, bool isActive) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/admin/services/$id/status'), 
        headers: await _getHeaders(),
        body: jsonEncode({'isActive': isActive})
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> getAdminLogs() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/admin/logs'), 
        headers: await _getHeaders()
      );
      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => e as Map<String, dynamic>).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<Map<String, dynamic>> changePassword(String oldPassword, String newPassword) async {
    final id = await getUserId();
    if (id == null) return {'success': false, 'message': 'User not logged in'};

    try {
      final response = await http.put(
        Uri.parse('$baseUrl/auth/change-password'), // Assuming this endpoint
        headers: await _getHeaders(),
        body: jsonEncode({
          'userId': id,
          'oldPassword': oldPassword,
          'newPassword': newPassword
        }),
      );
      
      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Password updated'};
      }
      final err = jsonDecode(response.body);
      return {'success': false, 'message': err['message'] ?? 'Failed'};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('user_id'); // Fixed key
    if (userId == null) return {'success': false, 'message': 'User not logged in'};

    try {
      final response = await http.put(
        Uri.parse('$baseUrl/users/$userId'),
        headers: await _getHeaders(),
        body: jsonEncode(data),
      );
      if (response.statusCode == 200) {
        // Update local prefs
        if (data.containsKey('fullName')) await prefs.setString('user_name', data['fullName']); // Fixed key
        return {'success': true, 'message': 'Profile updated successfully'};
      }
      return {'success': false, 'message': 'Update failed: ${response.statusCode}'};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<Map<String, dynamic>> uploadProfilePicture(String filePath) async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('user_id');
    if (userId == null) return {'success': false, 'message': 'User not logged in'};

    try {
      var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/users/$userId/upload-profile-image'));
      request.headers.addAll(await _getHeaders(isJson: false));
      
      request.files.add(await http.MultipartFile.fromPath('file', filePath)); // 'file' key typical for basic uploads

      var response = await request.send();
      final respStr = await response.stream.bytesToString();

      if (response.statusCode == 200) {
         try {
           final json = jsonDecode(respStr);
           return {'success': true, 'imageUrl': json['url'] ?? ''};
         } catch (e) {
           return {'success': true, 'message': 'Uploaded'};
         }
      }
      return {'success': false, 'message': 'Upload failed: ${response.statusCode}'};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<Map<String, dynamic>> submitKyc({
    required String pan,
    required String aadhaar,
    String? panPath,
    String? aadhaarPath,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('user_id'); // Fixed key
    if (userId == null) return {'success': false, 'message': 'User not logged in'};

    try {
      var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/users/$userId/kyc'));
      request.headers.addAll(await _getHeaders(isJson: false));
      
      request.fields['panNumber'] = pan;
      request.fields['aadhaarNumber'] = aadhaar;

      if (panPath != null) request.files.add(await http.MultipartFile.fromPath('panFile', panPath));
      if (aadhaarPath != null) request.files.add(await http.MultipartFile.fromPath('aadhaarFile', aadhaarPath));

      var response = await request.send();
       if (response.statusCode == 200) {
        return {'success': true, 'message': 'KYC submitted successfully'};
      }
      return {'success': false, 'message': 'Submission failed: ${response.statusCode}'};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<bool> updateUserStatus(int userId, String status) async {
      try {
        final response = await http.put(
          Uri.parse('$baseUrl/admin/users/$userId/status'),
          headers: await _getHeaders(),
          body: jsonEncode({'status': status})
        );
        return response.statusCode == 200;
      } catch (e) {
        return false;
      }
  }

  Future<List<Map<String, dynamic>>> getAllUsers() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/admin/users'), headers: await _getHeaders());
       if (response.statusCode == 200) {
         List<dynamic> data = jsonDecode(response.body);
         return data.map((e) => e as Map<String, dynamic>).toList();
       }
       return [];
    } catch (e) {
      return [];
    }
  }

  Future<Map<String, dynamic>> createSupportTicket(String subject, String description) async {
    final userId = await getUserId();
    if (userId == null) return {'success': false, 'message': 'User not logged in'};

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/support/tickets'),
        headers: await _getHeaders(),
        body: jsonEncode({
          'userId': userId,
          'subject': subject,
          'description': description,
          'status': 'Open'
        }),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        return {'success': true, 'message': 'Ticket created successfully'};
      }
      return {'success': false, 'message': 'Failed to create ticket'};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  Future<bool> sendContactMessage(String name, String email, String message) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/contact'), // Public endpoint usually
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          'name': name,
          'email': email,
          'message': message
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> getSmartVaultFiles() async {
    final userId = await getUserId();
    if (userId == null) return [];

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/$userId/smart-vault'),
        headers: await _getHeaders(),
      );
      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => e as Map<String, dynamic>).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}
