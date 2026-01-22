import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/api_service.dart';

class AdminFilesPage extends StatefulWidget {
  const AdminFilesPage({super.key});

  @override
  State<AdminFilesPage> createState() => _AdminFilesPageState();
}

class _AdminFilesPageState extends State<AdminFilesPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  static const Color brandNavy = Color(0xFF10232A);
  static const Color brandBronze = Color(0xFFC59D7F);

  bool _isLoading = true;
  List<Map<String, dynamic>> _files = [];
  
  // Mock Data for CMS
  final List<Map<String, dynamic>> _banners = [
    {'title': 'Startup India Sale', 'status': 'Active', 'clicks': '1,250', 'image': 'https://images.unsplash.com/photo-1557804506-669a67965ba0'},
    {'title': 'GST Filing Guide', 'status': 'Scheduled', 'clicks': '0', 'image': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f'},
  ];

  final List<Map<String, dynamic>> _blogs = [
    {'title': 'How to Register Pvt Ltd', 'author': 'Legal Team', 'views': '4.5k', 'status': 'Published'},
    {'title': 'GST Slabs Explained', 'author': 'Tax Expert', 'views': '-', 'status': 'Draft'},
    {'title': '5 Compliance Rulings', 'author': 'Admin', 'views': '1.2k', 'status': 'Published'},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _fetchData();
  }

  Future<void> _fetchData() async {
    final files = await ApiService().getFiles();
    if (mounted) {
      setState(() {
        _files = files;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text('CMS Studio', style: GoogleFonts.plusJakartaSans(color: brandNavy, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: brandNavy),
        bottom: TabBar(
          controller: _tabController,
          labelColor: brandBronze,
          unselectedLabelColor: Colors.grey,
          indicatorColor: brandBronze,
          tabs: const [
            Tab(text: 'Files'),
            Tab(text: 'Banners'),
            Tab(text: 'Blogs'),
          ],
        ),
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator(color: brandBronze))
        : TabBarView(
            controller: _tabController,
            children: [
              _buildFilesTab(),
              _buildBannersTab(),
              _buildBlogsTab(),
            ],
          ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: brandNavy,
        icon: const Icon(Icons.add, color: brandBronze),
        label: Text(_getFabLabel(), style: const TextStyle(color: brandBronze, fontWeight: FontWeight.bold)),
      ),
    );
  }

  String _getFabLabel() {
    // This doesn't update dynamically without setState on tab change, but defaults to general "Add"
    return 'Upload / Create'; 
  }

  Widget _buildFilesTab() {
    if (_files.isEmpty) return const Center(child: Text("No files found"));
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 0.8
      ),
      itemCount: _files.length,
      itemBuilder: (context, index) {
        final file = _files[index];
         IconData icon = Icons.insert_drive_file;
         Color color = Colors.grey;
         if(file['type'] == 'pdf') { icon = Icons.picture_as_pdf; color = Colors.red; }
         if(file['type'] == 'zip') { icon = Icons.folder_zip; color = Colors.amber; }
         if(file['type'] == 'doc') { icon = Icons.description; color = Colors.blue; }

         return Container(
           decoration: BoxDecoration(
             color: Colors.white,
             borderRadius: BorderRadius.circular(12),
             border: Border.all(color: Colors.grey.shade200)
           ),
           child: Column(
             mainAxisAlignment: MainAxisAlignment.center,
             children: [
                Icon(icon, size: 32, color: color),
                const SizedBox(height: 12),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Text(file['name'], textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                ),
                const SizedBox(height: 4),
                Text(file['size'], style: const TextStyle(fontSize: 10, color: Colors.grey)),
             ],
           ),
         );
      },
    );
  }

  Widget _buildBannersTab() {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _banners.length,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final banner = _banners[index];
        return Container(
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey.shade200)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 120,
                decoration: BoxDecoration(
                  color: Colors.grey.shade200,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  // image: DecorationImage(image: NetworkImage(banner['image']), fit: BoxFit.cover) // Commented out to prevent errors with net calls
                ),
                child: Center(child: Icon(Icons.image, size: 40, color: Colors.grey.shade400)),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(banner['title'], style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 16, color: brandNavy)),
                        Text("${banner['clicks']} clicks", style: const TextStyle(color: Colors.grey, fontSize: 12)),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: banner['status'] == 'Active' ? Colors.green.withValues(alpha: 0.1) : Colors.orange.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8)
                      ),
                      child: Text(banner['status'], style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: banner['status'] == 'Active' ? Colors.green : Colors.orange)),
                    )
                  ],
                ),
              )
            ],
          ),
        );
      },
    );
  }

  Widget _buildBlogsTab() {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _blogs.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final blog = _blogs[index];
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey.shade200)),
          child: Row(
            children: [
              Container(
                width: 48, height: 48,
                decoration: BoxDecoration(color: Colors.purple.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                child: Center(child: Text(blog['author'][0], style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.purple))),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(blog['title'], style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.bold, fontSize: 14, color: brandNavy)),
                    const SizedBox(height: 4),
                    Text("${blog['author']} • ${blog['views']} views", style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: blog['status'] == 'Published' ? Colors.green.withValues(alpha: 0.1) : Colors.grey.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(6)
                ),
                child: Text(blog['status'], style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: blog['status'] == 'Published' ? Colors.green : Colors.grey)),
              )
            ],
          ),
        );
      },
    );
  }
}
