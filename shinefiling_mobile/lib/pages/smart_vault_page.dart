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
                _buildSectionTitle('Active Repositories'),
                const SizedBox(height: 16),
                _buildCategoryGrid(),
                const SizedBox(height: 32),
                if (_files.isNotEmpty) ...[
                   _buildSectionTitle('Recent Files'),
                   const SizedBox(height: 16),
                   ..._files.take(5).map((f) => _buildExpiringItem(f['name'] ?? 'File', 'Uploaded: ${_formatDate(f['createdAt'])}', Colors.blue)),
                ]
                else if (!_isLoading) 
                   const Text('No files uploaded yet', style: TextStyle(color: Colors.grey)),
                
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

  Widget _buildCategoryGrid() {
    // Simply counting total files for now, distributed nicely or based on extension
    int total = _files.length;
    int docs = _files.where((f) => f['name'].toString().endsWith('.pdf')).length;
    int img = _files.where((f) => f['name'].toString().endsWith('.jpg') || f['name'].toString().endsWith('.png')).length;
    
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      childAspectRatio: 1.1,
      children: [
        _buildFolderCard('Registration', Icons.business_rounded, docs, Colors.blue),
        _buildFolderCard('Tax', Icons.receipt_long_rounded, 0, Colors.green),
        _buildFolderCard('Identity', Icons.how_to_reg_rounded, img, Colors.purple),
        _buildFolderCard('Legal', Icons.gavel_rounded, total - docs - img, Colors.orange),
      ],
    );
  }

  Widget _buildFolderCard(String title, IconData icon, int count, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
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
          Icon(icon, color: color, size: 32),
          Column(
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
                '$count Files',
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),
            ],
          ),
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
