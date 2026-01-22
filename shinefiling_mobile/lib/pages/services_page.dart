import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../services/api_service.dart';
import 'service_details_page.dart';

class ServicesPage extends StatefulWidget {
  const ServicesPage({super.key});

  @override
  State<ServicesPage> createState() => _ServicesPageState();
}

class _ServicesPageState extends State<ServicesPage> {
  // Brand Colors
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);
  
  // State
  bool _isLoading = true;
  List<Map<String, dynamic>> _allServices = [];
  List<Map<String, dynamic>> _filteredServices = [];
  String _searchQuery = '';
  String _selectedCategory = 'All';
  List<String> _categories = ['All'];

  @override
  void initState() {
    super.initState();
    _loadServices();
  }

  Future<void> _loadServices() async {
    setState(() => _isLoading = true);
    try {
      final services = await ApiService().getAllServices();
      
      // Extract Categories
      final cats = <String>{'All'};
      for (var s in services) {
        if (s['category'] != null) cats.add(s['category']);
      }

      setState(() {
        _allServices = services;
        _filteredServices = services;
        _categories = cats.toList();
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _filterServices() {
    setState(() {
      _filteredServices = _allServices.where((s) {
        final matchesSearch = s['name'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
        final matchesCat = _selectedCategory == 'All' || s['category'] == _selectedCategory;
        return matchesSearch && matchesCat;
      }).toList();
    });
  }

  IconData _getIconForCategory(String? category) {
    if (category == null) return Icons.inventory_2_rounded;
    final cat = category.toLowerCase();
    if (cat.contains('business') || cat.contains('company')) return Icons.business_rounded;
    if (cat.contains('tax') || cat.contains('gst')) return Icons.currency_rupee_rounded;
    if (cat.contains('license')) return Icons.receipt_long_rounded;
    if (cat.contains('legal')) return Icons.gavel_rounded;
    if (cat.contains('ipr') || cat.contains('trademark')) return Icons.verified_user_rounded;
    if (cat.contains('finance')) return Icons.bar_chart_rounded;
    if (cat.contains('certification')) return Icons.workspace_premium_rounded;
    return Icons.work_rounded;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA), // Clean Light Bg
      body: SafeArea(
        child: Column(
          children: [
            // Header
            _buildHeader(),
            
            // Filters
            _buildCategoryFilter(),

            // Content
            Expanded(
              child: _isLoading 
                ? const Center(child: CircularProgressIndicator(color: brandBronze))
                : _filteredServices.isEmpty
                  ? _buildEmptyState()
                  : _buildServicesGrid(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'All Services',
            style: GoogleFonts.outfit(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: brandNavy,
            ),
          ).animate().fadeIn().slideX(),
          const SizedBox(height: 16),
          // Search Bar
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: brandNavy.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: TextField(
              onChanged: (val) {
                _searchQuery = val;
                _filterServices();
              },
              decoration: InputDecoration(
                hintText: 'Search Services...',
                hintStyle: GoogleFonts.plusJakartaSans(color: Colors.grey.shade400, fontSize: 14),
                prefixIcon: const Icon(Icons.search_rounded, color: brandBronze, size: 20),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ).animate().fadeIn(delay: 100.ms).slideY(),
        ],
      ),
    );
  }

  Widget _buildCategoryFilter() {
    return SizedBox(
      height: 40,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        scrollDirection: Axis.horizontal,
        itemCount: _categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final cat = _categories[index];
          final isSelected = _selectedCategory == cat;
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedCategory = cat;
                _filterServices();
              });
            },
            child: AnimatedContainer(
              duration: 200.ms,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected ? brandNavy : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: isSelected ? brandNavy : Colors.grey.shade200),
                boxShadow: isSelected 
                  ? [BoxShadow(color: brandNavy.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 4))] 
                  : [],
              ),
              child: Text(
                cat,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: isSelected ? Colors.white : Colors.grey.shade600,
                ),
              ),
            ),
          );
        },
      ),
    ).animate().fadeIn(delay: 200.ms);
  }

  Widget _buildServicesGrid() {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: _filteredServices.length,
      itemBuilder: (context, index) {
        final service = _filteredServices[index];
        return _buildServiceCard(service, index);
      },
    );
  }

  Widget _buildServiceCard(Map<String, dynamic> service, int index) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04), // Soft shadow
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ServiceDetailsPage(
                  serviceName: service['name'] ?? '',
                  category: service['category'] ?? '',
                ),
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Icon
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: Colors.grey.shade100),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    _getIconForCategory(service['category']),
                    color: brandNavy,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                
                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        service['name'] ?? 'Unknown Service',
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: brandNavy,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        service['description'] ?? 'Professional registration & licensing services.',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          color: Colors.grey.shade500,
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 12),
                      
                      // View Details Button (Small)
                      Align(
                        alignment: Alignment.centerRight,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            border: Border.all(color: brandBronze),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'View Details',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: brandBronze,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ).animate(delay: (50 * index).ms).fadeIn().slideY(begin: 0.1);
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off_rounded, size: 64, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          Text(
            'No services found',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 16,
              color: Colors.grey.shade500,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
