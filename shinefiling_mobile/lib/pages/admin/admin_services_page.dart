import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';
import '../../widgets/shine_loader.dart';

class AdminServicesPage extends StatefulWidget {
  const AdminServicesPage({super.key});

  @override
  State<AdminServicesPage> createState() => _AdminServicesPageState();
}

class _AdminServicesPageState extends State<AdminServicesPage> {
  static const Color brandNavy = Color(0xFF0D1B21);
  static const Color brandBronze = Color(0xFFC59D7F);

  List<Map<String, dynamic>> _services = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchServices();
  }

  Future<void> _fetchServices() async {
    final data = await ApiService().getAdminServices();
    if (mounted) {
      setState(() {
        _services = data;
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
          'Manage Services',
          style: GoogleFonts.plusJakartaSans(
            color: brandNavy,
            fontWeight: FontWeight.w900,
            fontSize: 18,
          ),
        ),
      ),
      body: _isLoading
          ? const ShineLoader(text: 'Cataloging Services...')
          : RefreshIndicator(
              onRefresh: _fetchServices,
              color: brandBronze,
              child: ListView.builder(
                padding: const EdgeInsets.all(20),
                physics: const BouncingScrollPhysics(),
                itemCount: _services.length,
                itemBuilder: (context, index) {
                  final service = _services[index];
                  bool isActive = service['isActive'] ?? true;
                  
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
                    child: SwitchListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                      title: Text(
                        service['name'],
                        style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.w800,
                          color: brandNavy,
                          fontSize: 15,
                        ),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          Text(
                            '${service['category']} • ${service['price']}',
                            style: GoogleFonts.plusJakartaSans(fontSize: 12, color: brandBronze, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      activeColor: brandBronze,
                      value: isActive,
                      onChanged: (val) => _toggleServiceStatus(service, val),
                    ),
                  );
                },
              ),
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: brandNavy,
        label: Text('New Service', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, color: Colors.white)),
        icon: const Icon(Icons.add_rounded, color: brandBronze),
      ),
    );
  }

  Future<void> _toggleServiceStatus(Map<String, dynamic> service, bool isActive) async {
    setState(() => service['isActive'] = isActive);
    // Optimistic UI update, then call API
    if (service['id'] != null) {
      await ApiService().updateServiceStatus(service['id'].toString(), isActive);
    }
  }
}
