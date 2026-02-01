import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/api_service.dart';


class SmartVaultPage extends StatefulWidget {
  const SmartVaultPage({super.key});

  @override
  State<SmartVaultPage> createState() => _SmartVaultPageState();
}

class _SmartVaultPageState extends State<SmartVaultPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  List<Map<String, dynamic>> _files = [];
  bool _isLoading = true;
  double _usedStorageMB = 0.0;
  final double _totalStorageMB = 1024.0; // 1GB limit example

  @override
  void initState() {
    super.initState();
    _fetchFiles();
  }

  Future<void> _fetchFiles() async {
    final files = await ApiService().getSmartVaultFiles();
    double size = 0.0;
    for (var f in files) {
      size += (f['size'] ?? 0) / (1024 * 1024); // Assuming size in bytes
    }
    if (mounted) {
      setState(() {
        _files = files;
        _usedStorageMB = size;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF2F1EF),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          _buildSliverAppBar(),
          SliverPadding(
            padding: const EdgeInsets.all(24),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildStorageUsage(),
                const SizedBox(height: 32),
                _buildSectionTitle('Digital Document Wallet'),
                const SizedBox(height: 16),
                _buildDigiLockerGrid(),
                const SizedBox(height: 32),
                
                // Keep file list but maybe rename title if needed
                if (_files.isNotEmpty) ...[
                   _buildSectionTitle('Uploaded Files'),
                   const SizedBox(height: 16),
                   ..._files.take(5).map((f) => _buildExpiringItem(f['name'] ?? 'File', 'Uploaded: ${_formatDate(f['createdAt'])}', Colors.blue)),
                ]
                else if (!_isLoading) 
                   const Text('No documents uploaded yet. Tap the cards above to add.', style: TextStyle(color: Colors.grey)),
                
                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ).animate().fadeIn(duration: 600.ms),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 120,
      pinned: true,
      backgroundColor: brandNavy,
      elevation: 0,
      leading: const BackButton(color: Colors.white),
      actions: [
        IconButton(
          icon: const Icon(Icons.drive_folder_upload_rounded, color: Colors.white),
          onPressed: () {},
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        title: Text(
          'Smart Vault',
          style: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.w900,
            fontSize: 18,
            color: Colors.white,
          ),
        ),
        background: Container(color: brandNavy),
      ),
    );
  }

  Widget _buildStorageUsage() {
    double progress = (_usedStorageMB / _totalStorageMB).clamp(0.0, 1.0);
    int percentage = (progress * 100).toInt();

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: brandNavy,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(
            color: brandNavy.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Cloud Infrastructure',
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontWeight: FontWeight.w800,
                  fontSize: 16,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '$percentage%',
                  style: GoogleFonts.plusJakartaSans(
                    color: brandBronze,
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          ClipRRect(
            borderRadius: BorderRadius.circular(100),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.white.withValues(alpha: 0.05),
              color: brandBronze,
              minHeight: 10,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            '${_usedStorageMB.toStringAsFixed(2)} MB used of 1 GB secure storage',
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white.withValues(alpha: 0.3),
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title.toUpperCase(),
      style: GoogleFonts.plusJakartaSans(
        color: brandNavy.withValues(alpha: 0.4),
        fontSize: 12,
        fontWeight: FontWeight.w900,
        letterSpacing: 1.2,
      ),
    );
  }

  Widget _buildDigiLockerGrid() {
    return Column(
      children: [
        _buildIdentityCard(
          title: 'Aadhaar Card', 
          subtitle: 'Unique Identification Authority Of India',
          icon: Icons.fingerprint_rounded, 
          color: const Color(0xFFF44336), // Red for Aadhaar brand vibe
          bgColor: const Color(0xFFFFEBEE),
          docType: 'aadhaar'
        ),
        const SizedBox(height: 12),
        _buildIdentityCard(
          title: 'PAN Card', 
          subtitle: 'Income Tax Department',
          icon: Icons.badge_rounded, 
          color: const Color(0xFF1E88E5), // Blue for PAN/Income Tax
          bgColor: const Color(0xFFE3F2FD),
          docType: 'pan'
        ),
        const SizedBox(height: 12),
        _buildIdentityCard(
          title: 'Driving License', 
          subtitle: 'Ministry of Road Transport & Highways',
          icon: Icons.directions_car_rounded, 
          color: const Color(0xFF43A047), // Green/Grey
          bgColor: const Color(0xFFE8F5E9),
          docType: 'dl'
        ),
        const SizedBox(height: 12),
        _buildIdentityCard(
          title: 'Voter ID', 
          subtitle: 'Election Commission of India',
          icon: Icons.how_to_vote_rounded, 
          color: const Color(0xFFFB8C00), 
          bgColor: const Color(0xFFFFF3E0),
          docType: 'voter'
        ),
      ],
    );
  }

  Widget _buildIdentityCard({
    required String title, 
    required String subtitle, 
    required IconData icon, 
    required Color color, 
    required Color bgColor,
    required String docType,
  }) {
    // Check if we have files for this type
    bool isLinked = _files.any((f) => f['name'].toString().toLowerCase().contains(docType));

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.08),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
        border: Border.all(color: color.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: bgColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: brandNavy,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.grey,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: isLinked ? const Color(0xFFE8F5E9) : const Color(0xFFF5F5F5),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isLinked ? Colors.green.withValues(alpha: 0.3) : Colors.grey.withValues(alpha: 0.2)
              )
            ),
            child: Text(
              isLinked ? 'VIEW' : 'ADD',
              style: GoogleFonts.plusJakartaSans(
                color: isLinked ? Colors.green[700] : Colors.grey[600],
                fontWeight: FontWeight.w900,
                fontSize: 11,
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildExpiringItem(String title, String status, Color color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: brandNavy.withValues(alpha: 0.02),
            blurRadius: 5,
          ),
        ],
      ),
      child: Row(
        children: [
          Icon(Icons.warning_amber_rounded, color: color, size: 24),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 14)),
                Text(status, style: GoogleFonts.plusJakartaSans(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          TextButton(
            onPressed: () {},
            child: Text('View', style: GoogleFonts.plusJakartaSans(color: brandNavy, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
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
}
